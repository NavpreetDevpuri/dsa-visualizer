function isSuffix(pattern, candidate) {
  if (candidate.length > pattern.length) return false;
  return pattern.endsWith(candidate);
}

function computeTransitionFunction(pattern, alphabet) {
  let m = pattern.length;
  let transitionTable = [];

  for (let q = 0; q <= m; ++q) {
    transitionTable[q] = {};
    for (let a of alphabet) {
      // k is the longest prefix of pattern that is a suffix of pattern[0..q-1] + a
      let k = Math.min(m, q + 1);
      while (!isSuffix(pattern, pattern.substring(0, q) + a, k)) {
        k--;
      }
      transitionTable[q][a] = k;
    }
  }
  return transitionTable;
}

function isSuffix(pattern, text, k) {
  if (k > text.length) return false;
  for (let i = 0; i < k; i++) {
    if (pattern[i] !== text[text.length - k + i]) {
      return false;
    }
  }
  return true;
}

function finiteAutomatonMatcher(text, pattern, alphabet) {
  let m = pattern.length;
  let n = text.length;
  let transitionTable = computeTransitionFunction(pattern, alphabet);
  let q = 0; // state
  const states = [];

  for (let i = 0; i < n; i++) {
    q = transitionTable[q][text[i]] || 0;
    states.push(q);
    if (q === m) {
      console.log('Pattern occurs with shift ' + (i - m + 1));
    }
  }

  return { transitionTable, states };
}

// // Example usage
// let text = 'ababcababac';
// let pattern = 'ababaca';
// let alphabet = Array.from(new Set(pattern)).sort(); // unique characters from the pattern

// Example usage:
let text = 'abababacaba';
let pattern = 'ababaca';
let alphabet = 'abc'.split(''); // Alphabet is an array of all lowercase English letters
const { transitionTable, states } = finiteAutomatonMatcher(text, pattern, alphabet);
console.table(transitionTable);

// Let's find the pattern in the text
// finiteAutomatonMatcher(text, pattern, alphabet);
