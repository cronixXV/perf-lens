const getBoolean = (name: string, fallback: boolean): boolean => {
  const value = process.env[name];

  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

export const browserIsolation = {
  chromiumSandbox: getBoolean('CHROMIUM_SANDBOX', process.env.NODE_ENV === 'production')
} as const;
