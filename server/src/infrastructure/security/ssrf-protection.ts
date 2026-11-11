import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

import { AnalysisError } from '@domain/analysis/errors/analysis-error';

const SSRF_MESSAGE = 'The URL resolves to a private or otherwise restricted network address';

const blockedUrl = (): AnalysisError =>
  new AnalysisError({
    code: 'SSRF_BLOCKED',
    message: SSRF_MESSAGE,
    retryable: false
  });

const isPublicIpv4 = (address: string): boolean => {
  const octets = address.split('.').map(Number);
  const [first, second] = octets;

  if (octets.length !== 4 || first === undefined || second === undefined) {
    return false;
  }

  return !(
    first === 0 ||
    first === 10 ||
    first === 127 ||
    first >= 224 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && (second === 0 || second === 168)) ||
    (first === 198 && (second === 18 || second === 19 || second === 51)) ||
    (first === 203 && second === 0)
  );
};

const isPublicIpv6 = (address: string): boolean => {
  const normalized = address.toLowerCase();

  if (normalized.startsWith('::ffff:')) {
    const ipv4Address = normalized.slice('::ffff:'.length);

    return isIP(ipv4Address) === 4 && isPublicIpv4(ipv4Address);
  }

  const firstHextet = normalized.split(':')[0];
  const firstValue = Number.parseInt(firstHextet || '0', 16);

  // Global-unicast IPv6 occupies 2000::/3. Everything else is loopback,
  // link-local, unique-local, multicast, or otherwise special-use space.
  return Number.isFinite(firstValue) && (firstValue & 0xe000) === 0x2000;
};

export const isPublicIpAddress = (address: string): boolean => {
  const version = isIP(address);

  if (version === 4) {
    return isPublicIpv4(address);
  }

  if (version === 6) {
    return isPublicIpv6(address);
  }

  return false;
};

const isLocalHostname = (hostname: string): boolean => {
  const normalized = hostname
    .replace(/^\[|\]$/g, '')
    .replace(/\.$/, '')
    .toLowerCase();

  return normalized === 'localhost' || normalized.endsWith('.localhost');
};

export const assertSafeHttpUrl = async (value: string): Promise<void> => {
  const url = new URL(value);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, '');

  if (isLocalHostname(hostname)) {
    throw blockedUrl();
  }

  if (isIP(hostname)) {
    if (!isPublicIpAddress(hostname)) {
      throw blockedUrl();
    }

    return;
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });

  if (addresses.length === 0 || addresses.some(({ address }) => !isPublicIpAddress(address))) {
    throw blockedUrl();
  }
};
