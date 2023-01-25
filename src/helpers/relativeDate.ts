export const relativeDate = (dateValue: number | string | Date): string => {
  const startMs = new Date(dateValue).getTime();
  const endMs = Date.now();
  const deltaSec = Math.round((endMs - startMs) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (deltaSec < 30) {
    return "just now";
  } else if (deltaSec < minute) {
    return deltaSec + " seconds ago";
  } else if (deltaSec < 2 * minute) {
    return "a minute ago";
  } else if (deltaSec < hour) {
    return Math.floor(deltaSec / minute) + " minutes ago";
  } else if (Math.floor(deltaSec / hour) == 1) {
    return "1 hour ago";
  } else if (deltaSec < day) {
    return Math.floor(deltaSec / hour) + " hours ago";
  } else if (deltaSec < day * 2) {
    return "yesterday";
  } else {
    return deltaSec + " days ago";
  }
};
