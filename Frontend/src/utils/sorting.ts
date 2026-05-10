/**
 * A generic sorting helper that returns a comparator function for Array.prototype.sort().
 * 
 * @param key - The property key to sort by.
 * @param order - Sort order: 'asc' or 'desc' (default: 'asc').
 * @param parseType - Optional conversion: 'number' or 'date'.
 * 
 * @example
 * products.sort(sortBy('price', 'desc', 'number'));
 */
export const sortBy = <T>(
  key: keyof T,
  order: "asc" | "desc" = "asc",
  parseType?: "number" | "date"
) => {
  return (a: T, b: T) => {
    let valA: any = a[key];
    let valB: any = b[key];

    if (parseType === "number") {
      valA = Number(valA);
      valB = Number(valB);
    } else if (parseType === "date") {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    }

    // Standard comparison
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  };
};
