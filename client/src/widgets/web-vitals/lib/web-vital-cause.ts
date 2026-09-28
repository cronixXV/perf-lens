import type { IResource } from '@shared/contracts/analysis';

export const findLcpResource = (
  resourceUrl: string | null,
  resources: IResource[]
): IResource | null => {
  if (!resourceUrl) {
    return null;
  }

  return resources.find((resource) => resource.url === resourceUrl) ?? null;
};
