import { Component } from '@angular/core';
import * as _ from 'lodash';
import cytoscape from 'cytoscape';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kmp-search',
  templateUrl: './kmp-search.component.html',
  styleUrls: ['./kmp-search.component.scss'],
  imports: [FormsModule], // Import FormsModule here
  standalone: true,
})
export class KmpSearchComponent {
  pattern: string = 'abaabab';
  text: string = 'abababaabaabbababaab';
  prefixFunctionTable: any[] = [];
  graphData: any;
  processingText: any[] = [];
  comparisons: any[] = [];
  comparisonsTable: any = [];

  constructor() {}

  performKMPSearch() {
    const lps = this.computeLPSArray(this.pattern);
    this.prefixFunctionTable = this.createPrefixFunctionTable(this.pattern, lps);
    this.comparisonsTable = this.createComparisonsTable(this.pattern, this.text, lps);
    this.drawFlowChart(this.pattern);
  }

  createComparisonsTable(pattern: string, text: string, lps: number[]): any[] {
    // Implement the logic to create the comparisons table here
    // This table should reflect the comparisons made during the KMP search process
    let comparisons = [];
    let i = 0,
      j = 0;

    while (i < text.length) {
      if (pattern[j] === text[i]) {
        if (j === pattern.length - 1) {
          comparisons.push({ index: i - j, match: true });
          j = lps[j];
        } else {
          j++;
        }
        i++;
      } else {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
        comparisons.push({ index: i, match: false });
      }
    }

    return comparisons;
  }

  createPrefixFunctionTable(pattern: string, lps: number[]): any[] {
    return pattern.split('').map((char, index) => {
      return {
        i: index + 1,
        p_i: char,
        pi_i: lps[index],
      };
    });
  }

  computeLPSArray(pat: string): number[] {
    const M = pat.length;
    const lps = new Array(M).fill(0);
    let len = 0;
    let i = 1;

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

  KMPSearch(pat: string, txt: string, lps: number[]): any[] {
    let M = pat.length;
    let N = txt.length;
    let i = 0; // index for txt[]
    let j = 0; // index for pat[]
    this.comparisons = new Array(N).fill(' ');

    while (i < N) {
      if (pat[j] === txt[i]) {
        j++;
        i++;
        if (j === M) {
          // Found pattern at index i - j
          j = lps[j - 1];
        }
      } else {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }

    // Here, you can push the necessary data to the processingText array
    // or any other structures you need for displaying the results

    return []; // Return the necessary data for updating the view
  }

  drawFlowChart(pat: string) {
    const lps = this.computeLPSArray(pat);
    const nodes = [{ id: '0', name: 'start', shape: 'rectangle' }];
    const links = [];
    const patChars = pat.split('');

    patChars.forEach((ch, i) => {
      nodes.push({ id: (i + 1).toString(), name: ch, shape: 'circle' });
    });
    nodes.push({ id: nodes.length.toString(), name: '*', shape: 'circle' });

    const n = patChars.length;
    for (let i = 0; i < n; i++) {
      links.push({ from: i.toString(), to: (i + 1).toString(), label: 's' });
    }
    links.push({ from: (nodes.length - 2).toString(), to: (nodes.length - 1).toString(), label: 's' });

    let direction = -1;
    for (let i = 2; i < n + 1; i++) {
      links.push({
        from: i.toString(),
        to: (lps[i - 2] + 1).toString(),
        label: 'f',
        curve: true,
        controlPointDistance: direction * (89 + (i - lps[i - 1]) * 10),
      });
      direction *= -1;
    }
    links.push({
      from: (nodes.length - 1).toString(),
      to: (lps[lps.length - 1] + 1).toString(),
      label: '',
      curve: true,
      dotted: true,
      controlPointDistance: direction * (89 + (lps.length - lps[lps.length - 1]) * 10),
    });

    this.graphData = { nodes, links };
    this.initGraph(this.graphData);
  }

  initGraph(graphData: any) {
    var cy = cytoscape({
      container: document.getElementById('cy'),
      elements: {
        nodes: graphData.nodes.map((node: any) => ({
          data: { id: node.id, name: node.name, shape: node.shape },
        })),
        edges: graphData.links.map((link: any) => ({
          data: {
            id: 'e' + link.from + '-' + link.to,
            source: link.from,
            target: link.to,
            label: link.label,
            controlPointDistance: link.controlPointDistance,
            dotted: link.dotted,
          },
          classes: link.curve ? 'curved' : '',
        })),
      },
      style: [
        // ... (Your cytoscape styles here)
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autounselectify: true,
    });
  }

  // Additional helper methods if needed
}
