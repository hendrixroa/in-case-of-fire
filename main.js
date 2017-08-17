const electron = require('electron')
const os = require('os').release()
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const Menu = electron.Menu
const dialog = electron.dialog
let trayIcon = null
let trayMenu = null

const path = require('path')
const url = require('url')
const fs = require('fs')

let mainWindow

createWindow =  () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    resizable: false,
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.on('minimize',(event) => {
    mainWindow.hide()
  })

  trayIcon = new Tray(path.join(__dirname, 'resources/img/icon.jpg'));

  const trayMenuTemplate = [
    {
      label: 'Open',
      type: 'radio',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Minimize',
      type: 'radio',
      click: () => {
        mainWindow.hide()
      }
    },
    {
      label: 'Close', 
      type: 'radio',
      role: 'close'
    }
  ];
  trayIcon.setToolTip('This is my application.')
  trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
  trayIcon.setContextMenu(trayMenu)
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})