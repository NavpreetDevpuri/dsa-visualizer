import createGraph from './main.js';
window.onload = function () {
  const pattern = 'abaabab';
  const text = 'abababaabaabbababaab';
  KMPSearch(pattern, text);
  drawFlowChart(pattern);
  const { lps, processingTextTableRows, foundIndices } = KMPSearch(pattern, text);
  drawFlowChart(pattern);
  addResultsInHTML(pattern, text, lps, processingTextTableRows, foundIndices);
};
document.getElementById('search-btn').addEventListener('click', function () {
  const pattern = document.getElementById('pattern').value;
  const text = document.getElementById('text').value;

  if (pattern && text) {
    const { lps, processingTextTableRows, foundIndices } = KMPSearch(pattern, text);
    drawFlowChart(pattern);
    addResultsInHTML(pattern, text, lps, processingTextTableRows, foundIndices);
  } else {
    alert('Please enter both a pattern and text to search.');
  }
});

function addResultsInHTML(pattern, text, lps, processingTextTableRows, foundIndices) {
  let prefixFunctionTable = createHTMLTable(
    ['i', ..._.range(1, pattern.length + 1)],
    [
      ['P[i]', ...pattern.split('')],
      ['PI[i]', ...pattern.split('').map((c, i) => lps[i])],
    ],
  );
  let prefixFunctionContainer = document.getElementById('prefix-function');
  prefixFunctionContainer.innerHTML = '';
  prefixFunctionContainer.appendChild(prefixFunctionTable);

  let processingTextTable = createProcessingTextHTMLTable(_.range(1, text.length + 1), processingTextTableRows, text);
  let processingTextContainer = document.getElementById('processing-text');
  processingTextContainer.innerHTML = '';
  processingTextContainer.appendChild(processingTextTable);

  let foundIndicesContainer = document.getElementById('found-indices');
  foundIndicesContainer.innerHTML = '';
  console.log(foundIndices);
  if (foundIndices.length == 0) {
    foundIndicesContainer.innerHTML = 'There are no occurrences found';
  } else {
    if (foundIndices.length > 1) {
      foundIndicesContainer.innerHTML = `There are ${foundIndices.length} occurrences found at indices: ${foundIndices}`;
    } else {
      foundIndicesContainer.innerHTML = `There is ${foundIndices.length} occurrence found at index ${foundIndices}`;
    }
  }
}

function KMPSearch(pattern, text) {
  let M = pattern.length;
  let N = text.length;
  let lps = computeLPSArray(pattern);
  const foundIndices = [];

  let processingTextTableRows = []; // To hold the table rows
  let comparisonRows = []; // To hold the comparison count for each step

  // First row of the table with the text characters
  processingTextTableRows.push(text.split(''));

  let i = 0; // Index for txt[]
  let j = 0; // Index for pat[]
  let comparisons = 0; // Number of comparisons
  let patternRow = new Array(N).fill(' '); // Initialize patternRow with spaces

  let comparisonRow = new Array(N).fill(' '); // Initialize comparisonRow with spaces
  while (i < N) {
    // Update patternRow only when we make a comparison or need to adjust the pattern position
    if (i < N && (pattern[j] === text[i] || j === 0 || lps[j - 1] !== j - 1)) {
      patternRow.fill(' '); // Reset patternRow with spaces
      // Place the pattern at the correct position
      for (let k = 0; k < M && i - j + k < N; k++) {
        patternRow[i - j + k] = pattern[k];
      }
    }

    if (pattern[j] === text[i]) {
      comparisons++; // Increment comparisons only when characters are compared
      comparisonRow[i] = comparisons; // Mark the comparison count at the matched position
      patternRow[i] = pattern[j]; // update the patternRow to reflect the match
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
    } else if (i < N && pattern[j] !== text[i]) {
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

    // Only add the comparison and pattern rows if the comparison count has changed
    if (comparisonRow.some((num) => num !== ' ')) {
    }
  }

  comparisonRows.push(`Step ${i} (Comparisons: ${comparisons})`);
  if (comparisonRow.some((c) => c != ' ')) {
    processingTextTableRows.push(comparisonRow);
  }
  processingTextTableRows.push(patternRow.slice());

  return { lps, processingTextTableRows, foundIndices };
}

function computeLPSArray(pat) {
  const M = pat.length;
  const lps = new Array(M).fill(0);
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

  return lps;
}

function drawFlowChart(pat) {
  const lps = computeLPSArray(pat);
  const nodes = [{ id: 0, name: 'start', shape: 'rectangle' }];
  const links = [];
  const patChars = pat.split('');
  patChars.forEach((ch, i) => {
    nodes.push({ id: i + 1, name: ch });
  });
  nodes.push({ id: nodes[nodes.length - 1].id + 1, name: '*' });
  const n = patChars.length;
  for (let i = 0; i < n; i += 1) {
    links.push({ from: i, to: i + 1, label: 's' });
  }
  links.push({ from: nodes[nodes.length - 2].id, to: nodes[nodes.length - 1].id, label: 's' });
  links.push({ from: 1, to: 0, label: 'f', curve: true, controlPointDistance: 89 });
  let direction = -1;
  for (let i = 2; i < n + 1; i += 1) {
    links.push({
      from: i,
      to: lps[i - 2] + 1,
      label: 'f',
      curve: true,
      controlPointDistance: direction * (89 + (i - lps[i - 1]) * 10),
    });
    direction *= -1;
  }
  links.push({
    from: nodes[nodes.length - 1].id,
    to: lps[lps.length - 1] + 1,
    label: '',
    curve: true,
    dotted: true,
    controlPointDistance: direction * (89 + (lps.length - lps[lps.length - 1]) * 10),
  });
  const graphData = {
    nodes,
    links,
  };

  createGraph(graphData);
}

function createHTMLTable(headers, rows) {
  const table = document.createElement('table');
  table.style.border = '1px solid black';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '20px';
  table.style.textAlign = 'center';

  // Create header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    th.style.border = '1px solid black';
    th.style.padding = '8px';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create body rows
  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = cell;
      td.style.border = '1px solid black';
      td.style.padding = '8px';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

function createProcessingTextHTMLTable(headers, rows, text) {
  const table = document.createElement('table');
  table.style.border = '1px solid black';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '20px';
  table.style.textAlign = 'center';

  // Create header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    th.style.border = '1px solid black';
    th.style.padding = '8px';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create body rows
  const tbody = document.createElement('tbody');
  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    row.forEach((cell, j) => {
      const td = document.createElement('td');
      td.textContent = cell;
      td.style.border = '1px solid black';
      td.style.padding = '8px';
      if (i == 0) {
        td.style.background = 'rgba(58, 114, 134, 0.3)';
      }
      if (i > 0 && i % 2 == 0) {
        if (cell === text[j]) {
          td.style.background = '#9CCF99';
        }
        if (rows[i - 1][j] == ' ' && cell !== ' ' && rows[i - 1].slice(j).every((v) => v == ' ')) {
          td.style.background = '#E6D4C4';
        }
        if (cell !== ' ' && !td.style.background) {
          td.style.background = '#ff7c81';
        }
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}
