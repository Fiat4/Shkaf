import { formatBytes, formatPercent } from './format';
import { buildGraphLayout } from './layout';
import { createDemoTree } from './demoTree';

describe('formatBytes', () => {
  it('formats zero and common units', () => {
    expect(formatBytes(0)).toBe('0 Б');
    expect(formatBytes(1024)).toBe('1.00 КБ');
    expect(formatBytes(1024 * 1024 * 2)).toBe('2.00 МБ');
  });
});

describe('formatPercent', () => {
  it('handles edge cases', () => {
    expect(formatPercent(0, 0)).toBe('0%');
    expect(formatPercent(1, 10000)).toBe('<0.1%');
    expect(formatPercent(50, 100)).toBe('50%');
  });
});

describe('buildGraphLayout', () => {
  it('builds nodes and links for demo tree', () => {
    const layout = buildGraphLayout(createDemoTree(), { maxDepth: 2 });
    expect(layout.nodes.length).toBeGreaterThan(1);
    expect(layout.links.length).toBeGreaterThan(0);
    expect(layout.maxSize).toBeGreaterThan(0);
  });
});
