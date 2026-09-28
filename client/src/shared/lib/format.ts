export const formatSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${Math.round(bytes / 1024)} KB`;
};

export const formatTime = (milliseconds: number) => `${Math.round(milliseconds)} ms`;
