import log from 'electron-log'
log.catchErrors({
  showDialog: process.env.NODE_ENV === 'development',
  onError: error => {
    return true
  }
})
Object.assign(console, log.functions)
// require('@electron/remote/main').initialize()
import { app, BrowserWindow } from 'electron'

let mainWindow
const winUrl =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9081/`
    : `file://${__dirname}/`

async function createWindow() {
  let windowConfig = {
    height: 650,
    width: 985,
    minHeight: 650,
    minWidth: 985,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      // devTools: process.env.NODE_ENV === 'development',
      devTools: true,
      webSecurity: false,
      backgroundThrottling: true,
      enableRemoteModule: false
    },
    enableLargerThanScreen: true,
    offscreen: true,
    hasShadow: true
  }
  if (process.platform === 'darwin') {
    windowConfig.titleBarStyle = 'hidden'
    windowConfig.webPreferences.backgroundThrottling = true
  }
  if (process.platform === 'win32') {
    windowConfig.backgroundColor = '#ffffff'
    windowConfig.webPreferences.backgroundThrottling = true
  }
  mainWindow = new BrowserWindow(windowConfig)
  // if (process.env.NODE_ENV === 'development') {
  mainWindow.webContents.openDevTools()
  // }
  mainWindow.loadURL(`${winUrl}main.html`)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('close', e => {
    if (mainWindow === null) {
      return
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
;(async () => {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
  await app.whenReady()
  await createWindow()
})()
