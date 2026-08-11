const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('arbor', {
  isElectron: true,
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  scanPath: (targetPath, options) => ipcRenderer.invoke('fs:scan', targetPath, options),
  onScanProgress: (callback) => {
    const handler = (_event, info) => callback(info);
    ipcRenderer.on('fs:scan-progress', handler);
    return () => ipcRenderer.removeListener('fs:scan-progress', handler);
  },
});
