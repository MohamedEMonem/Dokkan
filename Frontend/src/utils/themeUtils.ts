/**
 * Lightens or darkens a hex color by a given percentage
 * @param hex The hex color code (e.g., "#005B7F")
 * @param percent Positive value to lighten, negative value to darken (-100 to 100)
 */
export function adjustColorBrightness(hex: string, percent: number): string {
  // Strip '#' if present
  let color = hex.replace(/^#/, "");

  // Convert 3-character hex to 6-character
  if (color.length === 3) {
    color = color.split("").map((char) => char + char).join("");
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + Math.round(2.55 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(2.55 * percent);
  let b = (num & 0x0000ff) + Math.round(2.55 * percent);

  // Clamp values between 0 and 255
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
