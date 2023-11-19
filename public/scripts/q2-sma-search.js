import createGraph from './main.js';
window.onload = function () {
  // Example usage:
  let text = 'abababacaba';
  let pattern = 'ababaca';

  drawTables(pattern, text);
  // Let's find the pattern in the text
  // finiteAutomatonMatcher(text, pattern, alphabet);

  drawFlowChart(pattern, text);
};

document.getElementById('search-btn').addEventListener('click', function () {
  const pattern = document.getElementById('pattern').value;
  const text = document.getElementById('text').value;
  if (pattern && text) {
    // finiteAutomatonMatcher(pattern, text);
    drawTables(pattern, text);
    drawFlowChart(pattern, text);
  } else {
    alert('Please enter both a pattern and text to search.');
  }
});

function drawFlowChart(pattern, text) {
  const alphabet = Array.from(new Set([...pattern, ...text]));
  let transitionTable = computeTransitionFunction(pattern, alphabet);

  const nodes = _.range(0, pattern.length + 1).map((i) => ({ id: i, name: i }));
  const links = [];
  let direction = -1;
  transitionTable.forEach((row, i) => {
    Object.keys(row).forEach((ch) => {
      if (row[ch] === 0) return;
      const currLink = { from: i, to: row[ch], label: ch };
      if (row[ch] < i) {
        currLink.curve = true;
        currLink.controlPointDistance = direction * (89 + (i - row[ch]) * 10);
        direction *= -1;
      }
      links.push(currLink);
    });
  });
  const graphData = {
    nodes,
    links,
  };

  createGraph(graphData);
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

function finiteAutomatonMatcher(pattern, text) {
  let m = pattern.length;
  let n = text.length;
  const alphabet = Array.from(new Set([...pattern, ...text]));
  alphabet.sort();
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

function createTransitionHTMLTable(headers, rows) {
  const table = document.createElement('table');
  // table.style.border = '1px solid black';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '20px';
  table.style.textAlign = 'center';

  // Create header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    // th.style.border = '1px solid black';
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
      if (j != 0 && j != row.length - 1) {
        td.style.border = '1px solid black';
      }
      if (i + 1 == cell) {
        td.style.background = '#ccc';
      }
      td.style.padding = '8px';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

function createSmaProcessingTextHTMLTable(headers, rows, pattern) {
  const table = document.createElement('table');
  // table.style.border = '1px solid black';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '20px';
  table.style.textAlign = 'center';

  // Create header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    // th.style.border = '1px solid black';
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
      // if (j != 0 && j != row.length - 1) {
      //   td.style.border = '1px solid black';
      // }
      if (cell == pattern.length) {
        td.style.background = '#ccc';
      }
      td.style.padding = '8px';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

function drawTables(pattern, text) {
  const { transitionTable, states } = finiteAutomatonMatcher(pattern, text);
  const transitionTableRows = transitionTable.map((row, i) => [i, ...Object.values(row), pattern[i]]);
  let transitionTableElement = createTransitionHTMLTable(
    ['state', ...Object.keys(transitionTable[0]), 'P'],
    transitionTableRows,
  );
  let transitionTableElementContainer = document.getElementById('transition-table');
  transitionTableElementContainer.innerHTML = '';
  transitionTableElementContainer.appendChild(transitionTableElement);

  const smaProcessingTextTableRows = [
    ['T[i]', '-', ...text.split('')],
    ['state (T[i])', '0', ...states],
  ];
  let smaProcessingTextTableElement = createSmaProcessingTextHTMLTable(
    ['i', '-', ..._.range(1, text.length + 1)],
    smaProcessingTextTableRows,
    pattern,
  );

  let smaProcessingTextContainer = document.getElementById('processing-text');
  smaProcessingTextContainer.innerHTML = '';
  smaProcessingTextContainer.appendChild(smaProcessingTextTableElement);
}

// // Example usage
// let text = 'ababcababac';
// let pattern = 'ababaca';
// let alphabet = Array.from(new Set(pattern)).sort(); // unique characters from the pattern
