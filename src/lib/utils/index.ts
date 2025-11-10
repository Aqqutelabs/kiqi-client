// Utility function to join class names conditionally
export function cn(...args: any[]): string {
  return args.flat(Infinity).filter(Boolean).join(" ");
}

// utility to copy to clipboard
export const copyToClipboard = async (
  text: string,
  utility?: (value: boolean) => void
) => {
  if (utility) {
    utility(true);
    setTimeout(() => utility(false), 1000);
  }
  await navigator.clipboard.writeText(text);
};


// utility to convert hex to rgba
export function hexToRgba(hex: string, alpha = 0.1) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
