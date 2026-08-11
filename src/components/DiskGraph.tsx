import React, { useMemo, useState } from 'react';
import { DiskNode } from '../types/disk';
import { formatBytes, formatPercent } from '../utils/format';
import { buildGraphLayout, linkPath, LayoutNode } from '../utils/layout';
import './DiskGraph.css';

interface DiskGraphProps {
  root: DiskNode;
  onDrill: (node: DiskNode) => void;
}

function strokeForSize(size: number, maxSize: number): number {
  const ratio = Math.sqrt(Math.max(size, 1) / Math.max(maxSize, 1));
  return 1.5 + ratio * 14;
}

function colorForDepth(depth: number, isDirectory: boolean): string {
  if (!isDirectory) return 'var(--file-fill)';
  const palette = [
    'var(--node-0)',
    'var(--node-1)',
    'var(--node-2)',
    'var(--node-3)',
  ];
  return palette[Math.min(depth, palette.length - 1)];
}

export function DiskGraph({ root, onDrill }: DiskGraphProps) {
  const layout = useMemo(() => buildGraphLayout(root, { maxDepth: 3 }), [root]);
  const [hovered, setHovered] = useState<LayoutNode | null>(null);

  return (
    <div className="disk-graph">
      <div className="disk-graph__canvas-wrap">
        <svg
          className="disk-graph__svg"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="img"
          aria-label={`Диаграмма размера: ${root.name}`}
        >
          <defs>
            <linearGradient id="linkGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2f6b57" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#c48a3a" stopOpacity="0.55" />
            </linearGradient>
            <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
            </filter>
          </defs>

          <g className="disk-graph__links">
            {layout.links.map((link, index) => (
              <path
                key={link.id}
                className="disk-graph__link"
                d={linkPath(link.source, link.target)}
                stroke="url(#linkGlow)"
                strokeWidth={strokeForSize(link.weight, layout.maxSize)}
                style={{ animationDelay: `${index * 18}ms` }}
              />
            ))}
          </g>

          <g className="disk-graph__nodes">
            {layout.nodes.map((node, index) => {
              const radius = node.isDirectory
                ? 10 + Math.sqrt(node.size / layout.maxSize) * 18
                : 7 + Math.sqrt(node.size / layout.maxSize) * 10;
              const canDrill = node.isDirectory && node.path === node.raw.path && !node.path.includes('::');

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHovered(node)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (canDrill && node.depth > 0) onDrill(node.raw);
                  }}
                >
                  <g
                    className={`disk-graph__node ${canDrill ? 'is-interactive' : ''}`}
                    style={{ animationDelay: `${80 + index * 22}ms` }}
                  >
                    <circle
                      r={radius + 6}
                      className="disk-graph__halo"
                      fill={colorForDepth(node.depth, node.isDirectory)}
                    />
                    <circle
                      r={radius}
                      className="disk-graph__dot"
                      fill={colorForDepth(node.depth, node.isDirectory)}
                      filter="url(#softShadow)"
                    />
                    <text className="disk-graph__label" dy={radius + 16}>
                      {node.name.length > 22 ? `${node.name.slice(0, 20)}…` : node.name}
                    </text>
                    <text className="disk-graph__size" dy={radius + 32}>
                      {formatBytes(node.size)}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <aside className="disk-graph__side" aria-live="polite">
        <p className="disk-graph__side-kicker">Сейчас в фокусе</p>
        <h2 className="disk-graph__side-title">{hovered?.name ?? root.name}</h2>
        <p className="disk-graph__side-path">{hovered?.path ?? root.path}</p>
        <dl className="disk-graph__metrics">
          <div>
            <dt>Объём</dt>
            <dd>{formatBytes(hovered?.size ?? root.size)}</dd>
          </div>
          <div>
            <dt>Доля</dt>
            <dd>{formatPercent(hovered?.size ?? root.size, root.size)}</dd>
          </div>
          <div>
            <dt>Тип</dt>
            <dd>
              {(hovered?.isDirectory ?? root.isDirectory) ? 'Папка' : 'Файлы'}
            </dd>
          </div>
        </dl>
        <p className="disk-graph__hint">
          Толщина линий отражает размер. Клик по папке углубляет диаграмму.
        </p>
      </aside>
    </div>
  );
}
