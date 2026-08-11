const fs = require('fs');
const path = require('path');

const SKIP_NAMES = new Set([
  '.git',
  'node_modules',
  '.Trash',
  '$Recycle.Bin',
  'System Volume Information',
]);

/**
 * Recursively scan a directory and return a size tree.
 * @param {string} targetPath
 * @param {{ maxDepth?: number, onProgress?: (info: object) => void, skipHeavy?: boolean }} options
 */
async function scanDirectory(targetPath, options = {}) {
  const maxDepth = options.maxDepth ?? 8;
  const skipHeavy = options.skipHeavy !== false;
  const onProgress = options.onProgress;
  let visited = 0;

  async function walk(dirPath, depth) {
    visited += 1;
    if (onProgress && visited % 40 === 0) {
      onProgress({ path: dirPath, visited });
    }

    const name = path.basename(dirPath) || dirPath;
    const node = {
      name,
      path: dirPath,
      size: 0,
      fileSize: 0,
      children: [],
      isDirectory: true,
    };

    let entries;
    try {
      entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    } catch {
      return node;
    }

    for (const entry of entries) {
      if (entry.name === '.' || entry.name === '..') continue;
      if (skipHeavy && SKIP_NAMES.has(entry.name)) continue;

      const fullPath = path.join(dirPath, entry.name);

      let stats;
      try {
        stats = await fs.promises.lstat(fullPath);
      } catch {
        continue;
      }

      if (stats.isSymbolicLink()) continue;

      if (stats.isDirectory()) {
        if (depth >= maxDepth) {
          const approx = await approximateDirSize(fullPath);
          node.children.push({
            name: entry.name,
            path: fullPath,
            size: approx,
            fileSize: 0,
            children: [],
            isDirectory: true,
            truncated: true,
          });
          node.size += approx;
        } else {
          const child = await walk(fullPath, depth + 1);
          node.children.push(child);
          node.size += child.size;
        }
      } else if (stats.isFile()) {
        const size = stats.size || 0;
        node.fileSize += size;
        node.size += size;
        node.children.push({
          name: entry.name,
          path: fullPath,
          size,
          fileSize: size,
          children: [],
          isDirectory: false,
        });
      }
    }

    node.children.sort((a, b) => b.size - a.size);
    return node;
  }

  const root = await walk(path.resolve(targetPath), 0);
  if (onProgress) onProgress({ path: targetPath, visited, done: true });
  return root;
}

async function approximateDirSize(dirPath) {
  let total = 0;
  const stack = [dirPath];
  let steps = 0;

  while (stack.length && steps < 5000) {
    const current = stack.pop();
    steps += 1;
    let entries;
    try {
      entries = await fs.promises.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (SKIP_NAMES.has(entry.name)) continue;
      const fullPath = path.join(current, entry.name);
      try {
        const stats = await fs.promises.lstat(fullPath);
        if (stats.isSymbolicLink()) continue;
        if (stats.isDirectory()) stack.push(fullPath);
        else if (stats.isFile()) total += stats.size || 0;
      } catch {
        // ignore inaccessible entries
      }
    }
  }

  return total;
}

module.exports = { scanDirectory };
