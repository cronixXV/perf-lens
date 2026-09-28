import type { TVitalStatus } from '../model/types/web-vitals.type';

export const getVitalStatusLabel = (status: TVitalStatus): string => {
  switch (status) {
    case 'good':
      return 'Good';

    case 'needs-improvement':
      return 'Needs improvement';

    case 'poor':
      return 'Poor';

    case 'unavailable':
      return 'Unavailable';
  }
};
