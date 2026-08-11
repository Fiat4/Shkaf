import { hierarchy, tree as d3Tree } from 'd3-hierarchy';
import { DiskNode } from '../types/disk';

export interface LayoutNode {
  id: string;
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  truncated?: boolean;
  depth: number;
  x: number;
  y: number;
  raw: DiskNode;
}

export interface LayoutLink {
  id: string;
  source: LayoutNode;
  target: LayoutNode;
  weight: number;
}

export interface GraphLayout {
  nodes: LayoutNode[];
  links: LayoutLink[];
  width: number;
  height: number;
  maxSize: number;
}

const MAX_CHILDREN = 14;

function pruneForView(node: DiskNode, depth: number, maxDepth: number): DiskNode {
  if (!node.isDirectory || depth >= maxDepth) {
    return {
      ...node,
      children: [],
    };
  }

  const dirs = node.children.filter((c) => c.isDirectory);
  const files = node.children.filter((c) => !c.isDirectory);
  const visibleDirs = dirs.slice(0, MAX_CHILDREN);
  const hiddenDirs = dirs.slice(MAX_CHILDREN);
  const fileBucketSize = files.reduce((sum, f) => sum + f.size, 0);
  const hiddenDirSize = hiddenDirs.reduce((sum, d) => sum + d.size, 0);

  const children: DiskNode[] = visibleDirs.map((child) =>
    pruneForView(child, depth + 1, maxDepth)
  );

  if (fileBucketSize > 0) {
    children.push({
      name: `файлы (${files.length})`,
      path: `${node.path}::files`,
      size: fileBucketSize,
      fileSize: fileBucketSize,
      children: [],
      isDirectory: false,
    });
  }

  if (hiddenDirSize > 0) {
    children.push({
      name: `ещё ${hiddenDirs.length} папок`,
      path: `${node.path}::more`,
      size: hiddenDirSize,
      fileSize: 0,
      children: [],
      isDirectory: true,
      truncated: true,
    });
  }

  children.sort((a, b) => b.size - a.size);

  return {
    ...node,
    children,
  };
}

export function buildGraphLayout(
  root: DiskNode,
  options?: { maxDepth?: number; rowGap?: number; colGap?: number }
): GraphLayout {
  const maxDepth = options?.maxDepth ?? 3;
  const rowGap = options?.rowGap ?? 56;
  const colGap = options?.colGap ?? 220;

  const pruned = pruneForView(root, 0, maxDepth);
  const rootHierarchy = hierarchy(pruned);
  const layout = d3Tree<DiskNode>().nodeSize([rowGap, colGap]);
  const laidOut = layout(rootHierarchy);

  const nodes: LayoutNode[] = [];
  const links: LayoutLink[] = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  laidOut.each((d) => {
    // d3 tree: x is vertical, y is horizontal — swap for left-to-right tree
    const x = d.y;
    const y = d.x;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);

    nodes.push({
      id: d.data.path,
      name: d.data.name,
      path: d.data.path,
      size: d.data.size,
      isDirectory: d.data.isDirectory,
      truncated: d.data.truncated,
      depth: d.depth,
      x,
      y,
      raw: d.data,
    });
  });

  const byPath = new Map(nodes.map((n) => [n.path, n]));

  laidOut.links().forEach((link) => {
    const source = byPath.get(link.source.data.path);
    const target = byPath.get(link.target.data.path);
    if (!source || !target) return;
    links.push({
      id: `${source.path}->${target.path}`,
      source,
      target,
      weight: target.size,
    });
  });

  const padX = 140;
  const padY = 80;
  const width = Math.max(800, maxX - minX + padX * 2);
  const height = Math.max(420, maxY - minY + padY * 2);

  nodes.forEach((n) => {
    n.x = n.x - minX + padX;
    n.y = n.y - minY + padY;
  });

  return {
    nodes,
    links,
    width,
    height,
    maxSize: root.size || 1,
  };
}

export function linkPath(source: LayoutNode, target: LayoutNode): string {
  const midX = (source.x + target.x) / 2;
  return `M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`;
}
