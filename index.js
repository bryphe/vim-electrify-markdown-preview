const {BrowserWindow} = require("electron").remote;

var currentWindow = null;
// This is a more advanced scenario - this uses an IPC channel
// to send data from the plugin -> BrowserWindow
vim.addCommand("MarkdownPreview", function(context) {
    if(currentWindow)
        return;

    currentWindow = new BrowserWindow({width: 800, height: 600, skipTaskbar: true, title: "vim-electrify-markdown-preview", autoHideMenuBar: true});
    currentWindow.loadURL(`file://${__dirname}/markdown_preview.html`);

    currentWindow.on("close", () => {
        currentWindow = null;
    });
});

vim.addCommand("MarkdownPreviewClose", (context) => {
    if(!currentWindow)
        return;

    currentWindow.destroy();
    currentWindow = null;
});

vim.on("BufferChanged", (args) => {

    if(!currentWindow)
        return;

    currentWindow.webContents.send("content-update", args.newContents);
});
