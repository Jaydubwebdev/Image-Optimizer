const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const os = require('os');
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const slash = require("slash");
const log = require('electron-log');

// Setup Events for Installer
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    return;
}

// Set Environment
process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isWin = process.platform === "win32" ? true : false;
const isLinux = process.platform === "linux" ? true : false;
const isMac = process.platform.env === "darwin" ? true : false;

let mainWindow;

// Build Main Window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "Electron Starter",
        width: 400,
        height: 450,
        resizable: isDev,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('./app/index.html')
}

// Initialize Application
app.whenReady().then(() => {
    createMainWindow();

    // Instantiate Application Menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on('active', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

// Build Menu
const menu = [
    ...(isDev ? [
        { role: "fileMenu" },
        { role: "viewMenu" }
    ] : [])
]

// Imagemin
ipcMain.on("image:minimize", (e, options) => {
    options.dest = path.join(os.homedir(), "cio");
    shrinkImage(options);
})
  
async function shrinkImage({ imgPath, quality, dest }) {
    try {
    const pngQuality = quality / 100;
    
    const files = await imagemin([slash(imgPath)], {
        destination: dest,
        plugins: [
            imageminMozjpeg({ quality }),
            imageminPngquant({
                quality: [pngQuality, pngQuality],
            }),
        ],
    });
    log.info(files);
    
    shell.openPath(dest);
    
    mainWindow.webContents.send('image:done');
    } catch (err) {
        console.log(err);
        log.error(err);
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})