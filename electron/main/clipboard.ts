import { app, clipboard } from "electron";

let lastText = "";

function startClipboardWatcher(mainWindow: any) {
  console.log("开始监听剪贴板");
  // 定期检查剪贴板
  const timer = setInterval(() => {
    try {
      const currentText = clipboard.readText().trim();

      // 检查是否有新内容
      if (currentText && currentText !== lastText) {
        console.log("检测到新内容:", currentText);
        lastText = currentText;
        mainWindow?.webContents.send("clipboard-update", currentText);
      }
    } catch (error) {
      console.error("读取剪贴板错误:", error);
    }
  }, 1000); // 每秒检查一次

  // 清理函数
  app.on("will-quit", () => {
    clearInterval(timer);
  });
}

export default startClipboardWatcher;
