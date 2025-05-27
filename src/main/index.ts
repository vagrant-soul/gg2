import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// 新增部分
import fs from 'fs'
import path from 'path'
import { buttonContents } from './config/ButtonContentProvider'
ipcMain.handle('get-button-contents', async () => {
  const jsonPath = path.join(app.getPath('userData'), 'buttonContents.json')
  const data = fs.readFileSync(jsonPath, 'utf-8')
  return JSON.parse(data)
})
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1027,
    height: 1000,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  // 打开开发者工具
  mainWindow.webContents.openDevTools()
  // 在 createWindow 函数中添加文件检查逻辑
  const jsonPath = path.join(app.getPath('userData'), 'buttonContents.json')

  // 检查文件是否存在，不存在则创建
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify(buttonContents, null, 2))
  }
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
// 添加保存处理程序
ipcMain.handle('save-button-content', async (_, { type, data }) => {
  const jsonPath = path.join(app.getPath('userData'), 'buttonContents.json')
  const existingData = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) : {}

  // 更新指定类型的数据
  existingData[type] = data

  // 保存更新后的数据
  fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2))

  // 通知所有窗口更新
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((window) => {
    if (window.webContents) {
      window.webContents.send('button-contents-updated')
    }
  })

  return existingData
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
