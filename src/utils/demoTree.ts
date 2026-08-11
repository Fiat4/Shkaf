import { DiskNode } from '../types/disk';

/** Demo tree for browser preview when Electron API is unavailable. */
export function createDemoTree(): DiskNode {
  const files = (name: string, size: number): DiskNode => ({
    name,
    path: `/demo/${name}`,
    size,
    fileSize: size,
    children: [],
    isDirectory: false,
  });

  const folder = (name: string, children: DiskNode[]): DiskNode => {
    const size = children.reduce((sum, child) => sum + child.size, 0);
    const fileSize = children
      .filter((c) => !c.isDirectory)
      .reduce((sum, child) => sum + child.size, 0);
    return {
      name,
      path: `/demo/${name}`,
      size,
      fileSize,
      children: [...children].sort((a, b) => b.size - a.size),
      isDirectory: true,
    };
  };

  return folder('Projects', [
    folder('Arbor', [
      folder('src', [
        files('App.tsx', 18_000),
        files('DiskGraph.tsx', 24_000),
        files('index.css', 8_500),
        folder('components', [
          files('PathBar.tsx', 6_200),
          files('Legend.tsx', 3_100),
        ]),
      ]),
      folder('electron', [
        files('main.js', 4_800),
        files('scanner.js', 7_200),
        files('preload.js', 1_100),
      ]),
      files('package.json', 2_400),
      files('README.md', 5_600),
    ]),
    folder('Design', [
      files('brand.fig', 42_000_000),
      files('icons.svg', 180_000),
      folder('exports', [
        files('poster.png', 8_400_000),
        files('mark.png', 420_000),
      ]),
    ]),
    folder('Archives', [
      files('photos-2024.zip', 1_250_000_000),
      files('docs-backup.tar', 380_000_000),
      folder('old', [
        files('notes.txt', 12_000),
        files('draft.docx', 2_200_000),
      ]),
    ]),
    folder('Media', [
      folder('video', [
        files('reel.mp4', 640_000_000),
        files('cut.mov', 210_000_000),
      ]),
      folder('audio', [
        files('theme.wav', 48_000_000),
        files('voice.mp3', 6_500_000),
      ]),
    ]),
    files('todo.md', 4_200),
  ]);
}
