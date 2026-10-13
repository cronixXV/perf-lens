import type { IResource } from '@shared/contracts/analysis';

export const getScriptName = (resource: IResource): string => {
  try {
    const pathname = new URL(resource.url).pathname;
    const filename = pathname.split('/').pop();

    return filename || resource.url;
  } catch {
    return resource.url;
  }
};
