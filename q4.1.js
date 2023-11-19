// JavaScript implementation of KMP algorithm

// Preprocess the pattern to create the longest prefix suffix array (lps)
function computeLPSArray(pattern) {
  let m = pattern.length;
  let lps = Array(m).fill(0);
  let len = 0; // length of the previous longest prefix suffix
  let i = 1;

  // loop calculates lps[i] for i = 1 to m-1
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

// KMP algorithm to search for a pattern in a text
function KMPMatcher(text, pattern) {
  let n = text.length;
  let m = pattern.length;
  let lps = computeLPSArray(pattern);

  let i = 0; // index for text
  let j = 0; // index for pattern

  while (i < n) {
    if (pattern[j] === text[i]) {
      j++;
      i++;
    }
    if (j === m) {
      console.log('Pattern found at index ' + (i - j));
      j = lps[j - 1];
    } else if (i < n && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i = i + 1;
      }
    }
  }
}

// Example usage:
const text = 'ababbabbabaababbabb';
const pattern = 'abaabab';
KMPMatcher(text, pattern);
