// Helper to extract initials (e.g., "Mohamed Hassan" -> "MH", "Mohamed" -> "M", "Mohamed Ali Hassan" -> "MH")
export const getInitials = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Helper to generate a consistent, vibrant background color based on the user's name
export const stringToColor = (str?: string) => {
  if (!str) return '#9CA3AF'; // Default gray if no name
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777215)).toString(16);
  return '#' + '000000'.substring(0, 6 - color.length) + color;
};
