export default function createGraph(graphData) {
  // console.log(graphData);
  var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: {
      nodes: graphData.nodes.map((node) => ({
        data: { id: node.id, name: node.name, shape: node.shape },
      })),
      edges: graphData.links.map((link) => ({
        data: {
          id: 'e' + link.from + '-' + link.to,
          source: link.from,
          target: link.to,
          label: link.label,
          controlPointDistance: link.controlPointDistance, // Include the control point
          dotted: link.dotted,
        },
        classes: link.curve ? 'curved' : '', // Class for curved edges
      })),
    },
    style: [
      {
        selector: 'node',
        style: {
          label: 'data(name)',
          'text-valign': 'center',
          'text-halign': 'center',
          'background-color': '#bbb',
          color: '#000',
          'font-size': '21px',
          width: '34px',
          height: '34px',
        },
      },
      {
        selector: 'edge[dotted]',
        style: {
          'line-style': 'dotted', // Apply dotted style
          'line-color': '#000', // Set the line color for dotted edges
          width: 2, // Set the width of the dotted line
        },
      },
      {
        selector: 'edge',
        style: {
          'target-arrow-shape': 'triangle',
          'arrow-scale': 1.6,
          width: 1,
          label: 'data(label)',
          'text-rotation': 'autorotate',
          'font-size': '21px',
        },
      },
      {
        selector: 'node[shape="circle"]',
        style: {
          shape: 'ellipse', // Cytoscape uses 'ellipse' for circles
          // ... other styles ...
        },
      },
      {
        selector: 'node[shape="rectangle"]',
        style: {
          shape: 'rectangle',
          width: '55px',
          // ... other styles ...
        },
      },
      {
        selector: 'edge.curved',
        style: {
          'curve-style': 'unbundled-bezier',
          'control-point-distances': 'data(controlPointDistance)',
          'control-point-weights': 0.5,
          'font-size': '21px',
        },
      },
      {
        selector: 'edge.curved[dotted]',
        style: {
          'curve-style': 'unbundled-bezier',
          'control-point-distances': 'data(controlPointDistance)',
          'control-point-weights': 0.5,
          'line-style': 'dotted', // Apply dotted style
          // ... other curved edge styles ...
        },
      },
    ],
    layout: {
      name: 'grid',
      rows: 1,
    },
    // Configuration for a static graph
    userZoomingEnabled: false,
    userPanningEnabled: false,
    boxSelectionEnabled: false,
    autoungrabify: true, // Prevent nodes from being grabbed
    autounselectify: true, // Prevent nodes and edges from being selected
  });
}
