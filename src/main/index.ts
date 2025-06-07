import { app, shell, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, clipboard } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { buttonContents } from './config/ButtonContentProvider'

import { OverlayController, OVERLAY_WINDOW_OPTS } from 'electron-overlay-window'
import { uIOhook, UiohookKey as Key } from 'uiohook-napi'
//
app.disableHardwareAcceleration()
// 启动 uIOhook 监听
uIOhook.start()
// 定义全局快捷键
const toggleMouseKey = 'CmdOrCtrl + J'
// const toggleShowKey = 'CmdOrCtrl + K'
let mainWindow: BrowserWindow
let tray: Tray | null = null

// 创建托盘
function createTray(window: BrowserWindow): void {
  // 替换为你的托盘图标路径，确保图标存在
  const trayIconPath = join(__dirname, '../../resources/icon.png')
  tray = new Tray(trayIconPath)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        window.show()
      }
    },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('应用名称')
  tray.setContextMenu(contextMenu)

  // 点击托盘图标显示/隐藏窗口
  tray.on('click', () => {
    if (window.isVisible()) {
      window.hide()
    } else {
      window.show()
    }
  })
}
// 左侧菜单的数据获取
ipcMain.handle('get-button-contents', async () => {
  const jsonPath = path.join(app.getPath('userData'), 'buttonContents.json')
  const data = fs.readFileSync(jsonPath, 'utf-8')
  return JSON.parse(data)
})
// 获取版本信息,cnb上的一个文本文件 6.8新增,同时增加了http的导入,其他没变,有错误可以删掉
ipcMain.handle('get-version-info', async () => {
  return new Promise((resolve, reject) => {
    const url = 'https://cnb.cool/vagrant_soul/poe2-app-update/-/git/raw/main/newversion.txt'
    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          resolve(data)
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
})
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    ...OVERLAY_WINDOW_OPTS,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  // 打开开发者工具
  // mainWindow.webContents.openDevTools()

  // 定义json文件
  const jsonPath = path.join(app.getPath('userData'), 'buttonContents.json')

  // 检查文件是否存在，不存在则创建
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify(buttonContents, null, 2))
  }

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

  // 附着窗口 测试用记事本
  // OverlayController.attachByTitle(mainWindow, 'demo.txt - Notepad')
  OverlayController.attachByTitle(mainWindow, 'Path of Exile 2')

  // 定义一个公共函数，用于处理 attach 和 focus 事件
  const handleAttachOrFocus = (): void => {
    setTimeout(() => {
      if (!mainWindow.isDestroyed()) {
        mainWindow.hide()
      }
    }, 100) // 100ms 延迟确保覆盖窗口完成初始化,这里不加延时,整个窗口就会一直显示
  }

  // 监听 attach 事件
  OverlayController.events.on('attach', handleAttachOrFocus)

  // 监听 focus 事件
  OverlayController.events.on('focus', handleAttachOrFocus)

  makeDemoInteractive()
  LogOverlayEventCalls()
  // 创建托盘
  createTray(mainWindow)
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
//-----------------------testing
function LogOverlayEventCalls(): void {
  // Still getting used to the events so uhhhhh just log when all of them are used.
  OverlayController.events.addListener('attach', () => {
    console.log('attach event emitted ')
  })

  OverlayController.events.addListener('fullscreen', () => {
    console.log('fullscreen event emitted ')
  })

  OverlayController.events.addListener('detach', () => {
    console.log('detach event emitted ')
  })

  OverlayController.events.addListener('moveresize', () => {
    // console.log('moveresize event emitted ')
  })

  OverlayController.events.addListener('blur', () => {
    console.log('blur event emitted ')
  })

  OverlayController.events.addListener('focus', () => {
    console.log('focus event emitted ')
  })
}
// 切换游戏窗口和软件窗口
function makeDemoInteractive(): void {
  let isInteractable = false

  function toggleOverlayState(): void {
    if (isInteractable) {
      mainWindow.show()
      isInteractable = false
      OverlayController.focusTarget()
      // mainWindow.webContents.send('focus-change', false)
      console.log('the first state')
      console.log(isInteractable)
      // isInteractable = false
    } else {
      // isInteractable = true
      mainWindow.show()
      // mainWindow.webContents.send('focus-change', true)
      isInteractable = true
      OverlayController.activateOverlay()
      // OverlayController.focusTarget()
      console.log('the second state ')
      console.log(isInteractable)
    }
  }

  mainWindow.on('blur', () => {
    isInteractable = false
    // mainWindow.webContents.send('focus-change', false)
    mainWindow.hide()
    console.log('the three state ')
  })

  globalShortcut.register(toggleMouseKey, toggleOverlayState)

  // 查询按钮的点击事件
  ipcMain.on('ping', () => {
    isInteractable = true
    OverlayController.focusTarget()
    setTimeout(() => {
      if (!mainWindow.isDestroyed()) {
        mainWindow.hide()
      }
    }, 200) // 300ms 延时
    // mainWindow.webContents.send('focus-change', false)
    setTimeout(() => {
      uIOhook.keyTap(Key.F, [Key.Ctrl])
      // 这里加延时是因为游戏里面需要,否则太快了,游戏会识别不到,暂时这样解决
    }, 100)
    const clipboardText = clipboard.readText()
    console.log('Clipboard text:', clipboardText)
    // 添加 100ms 延时后执行 Ctrl+V 操作
    setTimeout(() => {
      uIOhook.keyTap(Key.V, [Key.Ctrl])
      // console.log('Ctrl+V 操作已执行')
    }, 100)
    console.log('the hotkey is pressed ')
  })
}

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
  // ipcMain.on('ping', () => console.log('pong'))

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
