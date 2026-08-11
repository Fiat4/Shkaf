import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DiskGraph } from './components/DiskGraph';
import { PathBar } from './components/PathBar';
import { DiskNode } from './types/disk';
import { createDemoTree } from './utils/demoTree';
import { formatBytes } from './utils/format';
import './App.css';

function findNodeByPath(root: DiskNode, targetPath: string): DiskNode | null {
  if (root.path === targetPath) return root;
  for (const child of root.children) {
    const found = findNodeByPath(child, targetPath);
    if (found) return found;
  }
  return null;
}

function App() {
  const isElectron = Boolean(window.arbor?.isElectron);
  const [pathInput, setPathInput] = useState('');
  const [tree, setTree] = useState<DiskNode | null>(null);
  const [focusPath, setFocusPath] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<DiskNode[]>([]);

  useEffect(() => {
    if (!window.arbor) return undefined;
    return window.arbor.onScanProgress((info) => {
      setProgressLabel(
        info.done
          ? 'Готово'
          : `Сканировано узлов: ${info.visited} · ${info.path}`
      );
    });
  }, []);

  const focused = useMemo(() => {
    if (!tree || !focusPath) return tree;
    return findNodeByPath(tree, focusPath) ?? tree;
  }, [tree, focusPath]);

  const runScan = useCallback(async (target: string) => {
    const trimmed = target.trim();
    if (!trimmed) return;

    setError(null);
    setScanning(true);
    setProgressLabel('Начинаем обход…');

    try {
      if (!window.arbor) {
        throw new Error(
          'Сканирование реального пути доступно в десктоп-приложении Electron. Нажмите «Демо» для примера или запустите npm run electron.'
        );
      }

      const result = await window.arbor.scanPath(trimmed, { maxDepth: 6 });
      setTree(result);
      setFocusPath(result.path);
      setBreadcrumbs([result]);
      setPathInput(result.path);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось просканировать путь';
      setError(message);
      setTree(null);
      setFocusPath(null);
      setBreadcrumbs([]);
    } finally {
      setScanning(false);
      setProgressLabel('');
    }
  }, []);

  const handleBrowse = useCallback(async () => {
    if (!window.arbor) return;
    const selected = await window.arbor.selectFolder();
    if (selected) {
      setPathInput(selected);
      await runScan(selected);
    }
  }, [runScan]);

  const handleDemo = useCallback(() => {
    const demo = createDemoTree();
    setError(null);
    setTree(demo);
    setFocusPath(demo.path);
    setBreadcrumbs([demo]);
    setPathInput(demo.path);
  }, []);

  const handleDrill = useCallback(
    (node: DiskNode) => {
      if (!tree) return;
      setFocusPath(node.path);
      setBreadcrumbs((prev) => {
        const idx = prev.findIndex((item) => item.path === node.path);
        if (idx >= 0) return prev.slice(0, idx + 1);
        const next = [...prev];
        const parentIdx = next.findIndex((item) =>
          node.path.startsWith(item.path + '/') || node.path.startsWith(item.path + '\\')
        );
        if (parentIdx >= 0) {
          return [...next.slice(0, parentIdx + 1), node];
        }
        return [...next, node];
      });
    },
    [tree]
  );

  const goBreadcrumb = (node: DiskNode, index: number) => {
    setFocusPath(node.path);
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  };

  return (
    <div className={`app ${tree ? 'app--ready' : 'app--welcome'}`}>
      <div className="app__atmosphere" aria-hidden="true" />

      <header className="app__hero">
        <div className="app__brand-block">
          <p className="app__brand">Arbor</p>
          {!tree && (
            <>
              <h1 className="app__headline">Увидьте, куда уходит место на диске</h1>
              <p className="app__lead">
                Укажите папку — и получите живую схему с линиями: чем толще ветвь, тем больше объём.
              </p>
            </>
          )}
        </div>

        <PathBar
          value={pathInput}
          scanning={scanning}
          progressLabel={progressLabel}
          canBrowse={isElectron}
          onChange={setPathInput}
          onBrowse={handleBrowse}
          onScan={() => runScan(pathInput)}
          onDemo={handleDemo}
        />

        {error && <p className="app__error" role="alert">{error}</p>}

        {!isElectron && !tree && (
          <p className="app__note">
            Сейчас открыт браузерный режим. Для выбора системной папки запустите десктоп: <code>npm run electron</code>.
          </p>
        )}
      </header>

      {tree && focused && (
        <main className="app__main">
          <div className="app__toolbar">
            <nav className="app__crumbs" aria-label="Навигация по папкам">
              {breadcrumbs.map((crumb, index) => (
                <button
                  key={crumb.path}
                  type="button"
                  className="app__crumb"
                  onClick={() => goBreadcrumb(crumb, index)}
                >
                  {crumb.name}
                </button>
              ))}
            </nav>
            <p className="app__total">
              Всего в корне: <strong>{formatBytes(tree.size)}</strong>
            </p>
          </div>

          <DiskGraph root={focused} onDrill={handleDrill} />

          <section className="app__list" aria-label="Список содержимого">
            <h2>Содержимое</h2>
            <ul>
              {focused.children.slice(0, 40).map((child) => (
                <li key={child.path}>
                  <button
                    type="button"
                    className="app__list-item"
                    onClick={() => child.isDirectory && handleDrill(child)}
                    disabled={!child.isDirectory}
                  >
                    <span className="app__list-name">
                      <span
                        className={`app__list-kind ${
                          child.isDirectory ? 'is-dir' : 'is-file'
                        }`}
                        aria-hidden="true"
                      />
                      {child.name}
                    </span>
                    <span className="app__list-bar" aria-hidden="true">
                      <i style={{ width: `${Math.max(2, (child.size / focused.size) * 100)}%` }} />
                    </span>
                    <span className="app__list-size">{formatBytes(child.size)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
