export interface DiskNode {
  name: string;
  path: string;
  size: number;
  fileSize: number;
  children: DiskNode[];
  isDirectory: boolean;
  truncated?: boolean;
}

export interface ScanProgress {
  path: string;
  visited: number;
  done?: boolean;
}

export interface ArborAPI {
  isElectron: true;
  selectFolder: () => Promise<string | null>;
  scanPath: (
    targetPath: string,
    options?: { maxDepth?: number; skipHeavy?: boolean }
  ) => Promise<DiskNode>;
  onScanProgress: (callback: (info: ScanProgress) => void) => () => void;
}

declare global {
  interface Window {
    arbor?: ArborAPI;
  }
}

export {};
