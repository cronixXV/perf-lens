import type { TVitalStatus } from '../model/types/web-vitals.type';

export const getStatusColorPalette = (status: TVitalStatus) => {
  switch (status) {
    case 'good':
      return 'green';

    case 'needs-improvement':
      return 'orange';

    case 'poor':
      return 'red';

    case 'unavailable':
      return 'gray';
  }
};
