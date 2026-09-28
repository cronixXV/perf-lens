import { TResourceType } from '@shared/contracts/analysis';

export const getResourceType = (url: string, initiatorType: string): TResourceType | undefined => {
  if (initiatorType === 'document') {
    return 'document';
  }

  if (initiatorType === 'script') {
    return 'script';
  }

  if (initiatorType === 'fetch') {
    return 'fetch';
  }

  if (initiatorType === 'xmlhttprequest') {
    return 'xhr';
  }

  const pathname = new URL(url).pathname.toLowerCase();

  if (/\.(woff2?|ttf|otf|eot)$/.test(pathname)) {
    return 'font';
  }

  if (/\.css$/.test(pathname)) {
    return 'stylesheet';
  }

  if (/\.(png|jpe?g|webp|gif|svg|avif|ico)$/.test(pathname)) {
    return 'image';
  }

  if (initiatorType === 'img') {
    return 'image';
  }

  if (initiatorType === 'link') {
    return 'stylesheet';
  }

  return undefined;
};
