export const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const getPageNumbers = (
  currentPage: number,
  totalPages: number
): (number | "...")[] => {
  if (totalPages <= 6) return range(1, totalPages);

  const left = Math.max(currentPage - 1, 1);
  const right = Math.min(currentPage + 1, totalPages);
  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;

  if (!showLeftDots) return [...range(1, 5), "...", totalPages];
  if (!showRightDots) return [1, "...", ...range(totalPages - 4, totalPages)];
  return [1, "...", ...range(left, right), "...", totalPages];
};
