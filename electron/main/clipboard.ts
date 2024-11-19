import { app, clipboard, ipcMain, nativeImage } from "electron";
import type { ClipboardItem } from "@/hooks/useClipboardManager";

function startClipboardWatcher(mainWindow: any) {
  console.log("开始监听剪贴板");

  let lastText = clipboard.readText();
  let lastImage = clipboard.readImage().toDataURL();
  let lastFilePaths = "";

  try {
    lastFilePaths = clipboard.readBuffer("FileNameW").toString();
  } catch (error) {
    // 忽略错误
  }

  // 定期检查剪贴板
  const timer = setInterval(() => {
    try {
      let clipboardData: Omit<ClipboardItem, "id" | "timestamp"> | null = null;

      // 检查是否有新的图片
      const newImage = clipboard.readImage();
      if (!newImage.isEmpty()) {
        const newImageData = newImage.toDataURL();
        if (newImageData !== lastImage) {
          lastImage = newImageData;
          clipboardData = {
            type: "image",
            imageData: newImageData,
          };
        }
      }

      // 检查是否有新的文件
      if (!clipboardData) {
        try {
          const newFilePaths = clipboard.readBuffer("FileNameW").toString();
          if (newFilePaths && newFilePaths !== lastFilePaths) {
            lastFilePaths = newFilePaths;
            clipboardData = {
              type: "file",
              filePaths: newFilePaths.split("\n").filter(Boolean),
            };
          }
        } catch (error) {
          // 忽略错误
        }
      }

      // 检查是否有新的文本
      if (!clipboardData) {
        const newText = clipboard.readText().trim();
        if (newText && newText !== lastText) {
          lastText = newText;
          clipboardData = {
            type: "text",
            content: newText,
          };
        }
      }

      // 如果检测到新内容,发送给渲染进程
      if (clipboardData) {
        mainWindow?.webContents.send("clipboard-changed", clipboardData);
      }
    } catch (error) {
      console.error("读取剪贴板错误:", error);
    }
  }, 1000);

  // 处理复制请求
  ipcMain.on("copy-text", (_, text) => {
    clipboard.writeText(text);
  });

  ipcMain.on("copy-image", (_, imageData) => {
    const img = nativeImage.createFromDataURL(imageData);
    clipboard.writeImage(img);
  });

  ipcMain.on("copy-files", (_, filePaths) => {
    clipboard.writeBuffer("FileNameW", Buffer.from(filePaths.join("\n")));
  });

  // 清理函数
  app.on("will-quit", () => {
    clearInterval(timer);
  });
}

export default startClipboardWatcher;
