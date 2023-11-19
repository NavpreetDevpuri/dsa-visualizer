const _ = require('lodash');

function KMPSearch(pat, txt) {
  let M = pat.length;
  let N = txt.length;
  let lps = new Array(M).fill(0);
  computeLPSArray(pat, M, lps);
  const foundIndices = [];

  console.log('Prefix Function');
  console.table([
    ['i', ..._.range(1, pat.length + 1)],
    ['P[i]', ...pat.split('')],
    ['PI[i]', ...pat.split('').map((c, i) => lps[i])],
  ]);

  let processingTextTableRows = []; // To hold the table rows
  let comparisonRows = []; // To hold the comparison count for each step

  // First row of the table with the text characters
  processingTextTableRows.push(txt.split(''));

  let i = 0; // Index for txt[]
  let j = 0; // Index for pat[]
  let comparisons = 0; // Number of comparisons
  let patternRow = new Array(N).fill(' '); // Initialize patternRow with spaces

  let comparisonRow = new Array(N).fill(' '); // Initialize comparisonRow with spaces
  while (i < N) {
    // Update patternRow only when we make a comparison or need to adjust the pattern position
    if (i < N && j != 0 && (pat[j] === txt[i] || j === 0 || lps[j - 1] !== j - 1)) {
      patternRow.fill(' '); // Reset patternRow with spaces
      // Place the pattern at the correct position
      for (let k = 0; k < M && i - j + k < N; k++) {
        patternRow[i - j + k] = pat[k];
      }
    }

    if (pat[j] === txt[i]) {
      comparisons++; // Increment comparisons only when characters are compared
      comparisonRow[i] = comparisons; // Mark the comparison count at the matched position
      patternRow[i] = pat[j]; // update the patternRow to reflect the match
      i++;
      j++;
    }
    if (j === M) {
      comparisonRows.push(`Step ${i} (Comparisons: ${comparisons})`);
      processingTextTableRows.push(comparisonRow);
      processingTextTableRows.push(patternRow.slice());
      comparisonRow = new Array(N).fill(' '); // Initialize comparisonRow with spaces
      foundIndices.push(i - j);
      j = lps[j - 1];
    } else if (i < N && pat[j] !== txt[i]) {
      comparisons++; // Increment comparisons only when characters are compared
      comparisonRow[i] = comparisons; // Mark the comparison count at the matched position
      if (j !== 0) {
        comparisonRows.push(`Step ${i} (Comparisons: ${comparisons})`);
        processingTextTableRows.push(comparisonRow);
        processingTextTableRows.push(patternRow.slice());
        comparisonRow = new Array(N).fill(' '); // Initialize comparisonRow with spaces
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  comparisonRows.push(`Step ${i} (Comparisons: ${comparisons})`);
  if (comparisonRow.some((c) => c != ' ')) {
    processingTextTableRows.push(comparisonRow);
    processingTextTableRows.push(patternRow.slice());
  }

  // table = transformTable(table, txt);

  console.log('Comparisons made in KMP');
  console.table(processingTextTableRows);
  console.log(`Total comparisons: ${comparisons}`);
  console.log(`Found pattern at ${foundIndices.length > 1 ? 'indeces' : 'index'} ${foundIndices}`);
}

function computeLPSArray(pat, M, lps) {
  let len = 0;
  let i = 1;

  // The loop calculates lps[i] for i = 1 to M-1
  while (i < M) {
    if (pat[i] === pat[len]) {
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
}

// Example usage
KMPSearch('bababaab', 'abababaabaabbababaab');
// KMPSearch('aabaabaaab', 'aaabaabaaabaabaaabab');
