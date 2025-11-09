import type { Stylesheet } from "cytoscape"

export const cytoscapeStylesheet: Stylesheet[] = [
  // Node styles
  {
    selector: "node",
    style: {
      "background-color": "#3b82f6",
      "border-width": 2,
      "border-color": "#1e40af",
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "12px",
      "font-weight": "bold",
      color: "#fff",
      "text-outline-color": "#1e40af",
      "text-outline-width": 2,
      width: "60px",
      height: "60px",
    },
  },
  // Root IP (generation 0)
  {
    selector: "node[generation = 0]",
    style: {
      "background-color": "#8b5cf6",
      "border-color": "#6d28d9",
      "border-width": 3,
      width: "80px",
      height: "80px",
      "font-size": "14px",
    },
  },
  // Derivative IPs (colored by generation)
  {
    selector: "node[generation > 0]",
    style: {
      "background-color": "mapData(generation, 1, 5, #3b82f6, #06b6d4)",
      "border-color": "mapData(generation, 1, 5, #1e40af, #0891b2)",
    },
  },
  // Selected node
  {
    selector: "node:selected",
    style: {
      "border-width": 4,
      "border-color": "#fbbf24",
      "background-color": "#f59e0b",
    },
  },
  // Hovered node
  {
    selector: "node:active",
    style: {
      "overlay-color": "#fbbf24",
      "overlay-padding": 8,
      "overlay-opacity": 0.25,
    },
  },
  // Edge styles
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#94a3b8",
      "target-arrow-color": "#94a3b8",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      "arrow-scale": 1.5,
    },
  },
  // Derivative edges
  {
    selector: "edge[type = 'derivative']",
    style: {
      "line-color": "#3b82f6",
      "target-arrow-color": "#3b82f6",
      width: 3,
    },
  },
  // License edges
  {
    selector: "edge[type = 'license']",
    style: {
      "line-color": "#10b981",
      "target-arrow-color": "#10b981",
      "line-style": "dashed",
      width: 2,
    },
  },
  // Royalty edges
  {
    selector: "edge[type = 'royalty']",
    style: {
      "line-color": "#f59e0b",
      "target-arrow-color": "#f59e0b",
      width: "mapData(weight, 0, 100, 2, 6)",
    },
  },
  // Selected edge
  {
    selector: "edge:selected",
    style: {
      "line-color": "#fbbf24",
      "target-arrow-color": "#fbbf24",
      width: 4,
    },
  },
  // Highlighted path
  {
    selector: ".highlighted",
    style: {
      "line-color": "#8b5cf6",
      "target-arrow-color": "#8b5cf6",
      "border-color": "#8b5cf6",
      "background-color": "#a78bfa",
      width: 4,
      "z-index": 999,
    },
  },
  // Dimmed (not in path)
  {
    selector: ".dimmed",
    style: {
      opacity: 0.2,
    },
  },
]

export const cytoscapeLayout = {
  name: "cola",
  animate: true,
  animationDuration: 1000,
  animationEasing: "ease-out",
  nodeSpacing: 100,
  edgeLengthVal: 150,
  padding: 50,
  randomize: false,
  avoidOverlap: true,
  handleDisconnected: true,
  convergenceThreshold: 0.01,
  flow: { axis: "y", minSeparation: 100 },
}

export const cytoscapeOptions = {
  wheelSensitivity: 0.2,
  minZoom: 0.1,
  maxZoom: 3,
  boxSelectionEnabled: true,
  autoungrabify: false,
  autounselectify: false,
}


