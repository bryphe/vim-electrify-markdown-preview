const {BrowserWindow} = require("electron").remote;

var currentWindow = null;
var lastContents = "";

// This is a more advanced scenario - this uses an IPC channel
// to send data from the plugin -> BrowserWindow
vim.addCommand("MarkdownPreview", function(context) {
    if (currentWindow) {
        currentWindow.focus();
        return;
    }

    currentWindow = new BrowserWindow({width: 800, height: 600, title: "vim-electrify-markdown-preview"});
    currentWindow.loadURL(`file://${__dirname}/markdown_preview.html`);
    currentWindow.focus();
    currentWindow.webcontents.send("content-update", lastContents);

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
    lastContents = args.newContents;

    if(!currentWindow)
        return;

    currentWindow.webContents.send("content-update", args.newContents);
});
