const startapp = () => {
    const { app, BrowserWindow } = require('electron')
    const path = require('path')

    let win

    function createWindow() {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        })

        var appdataindex = path.join(process.env.LOCALAPPDATA,"Steam Achievement Notifier (V1.8)","store","index.html")
        win.loadFile(appdataindex)
        console.log("SUCCESS: LOADED APPDATA INDEX!")
    }

    app.on('ready', () => {
        createWindow()
    })
}

module.exports = startapp()
