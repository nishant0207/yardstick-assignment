export function cn(...inputs: (string | undefined)[]) {
    return inputs.filter(Boolean).join(" ");
  }

/**
 * Format a number according to Indian currency format
 * Example: 1234567.89 becomes 12,34,567.89
 */
export function formatIndianCurrency(amount: number): string {
  // Convert the number to a string with 2 decimal places
  const numStr = Math.abs(amount).toFixed(2);
  
  // Split the string into whole and decimal parts
  const [wholePart, decimalPart] = numStr.split('.');
  
  // Format the whole part according to Indian number system
  // First, get the last 3 digits
  const lastThree = wholePart.substring(wholePart.length - 3);
  
  // Get the remaining digits and split them into groups of 2
  const otherNumbers = wholePart.substring(0, wholePart.length - 3);
  const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  // Combine the formatted parts
  const formattedWholePart = otherNumbers ? 
    formattedOtherNumbers + ',' + lastThree : 
    lastThree;
  
  // Return the formatted number with decimal part
  return `₹${formattedWholePart}.${decimalPart}`;
}