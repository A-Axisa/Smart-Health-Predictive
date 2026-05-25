/**
 * Compares two strings in constant time using XOR.
 *
 * @param {string} a - The first string to compare
 * @param {string} b - The second string to compare
 * 
 * @returns {boolean} True if the strings are equal, false otherwise
 */
export function stringEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
