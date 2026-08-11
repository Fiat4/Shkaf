const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const { scanDirectory } = require('./scanner');

const isDev =
  process.env.ELECTRON_START_URL != null ||
  process.env.NODE_ENV === 'development' ||
  !app.isPackaged;

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: 'Arbor — карта места на диске',
    backgroundColor: '#e8efe6',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, '..', 'build', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Выберите папку для анализа',
  });

  if (result.canceled || !result.filePaths.length) return null;
  return result.filePaths[0];
});

ipcMain.handle('fs:scan', async (event, targetPath, options = {}) => {
  if (!targetPath || typeof targetPath !== 'string') {
    throw new Error('Некорректный путь');
  }

  return scanDirectory(targetPath, {
    maxDepth: options.maxDepth ?? 6,
    skipHeavy: options.skipHeavy !== false,
    onProgress: (info) => {
      if (!event.sender.isDestroyed()) {
        event.sender.send('fs:scan-progress', info);
      }
    },
  });
});
