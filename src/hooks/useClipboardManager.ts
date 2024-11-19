import { useState, useEffect } from "react";

interface ClipboardItem {
  id: string;
  type: "text" | "image" | "file";
  content?: string;
  imageData?: string;
  filePaths?: string[];
  timestamp: number;
}

const STORAGE_KEY = "clipboard_history";
const MAX_ITEMS = 100;

export const useClipboardManager = () => {
  const [items, setItems] = useState<ClipboardItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("读取本地存储失败:", error);
      return [];
    }
  });

  const copyToClipboard = (item: ClipboardItem) => {
    switch (item.type) {
      case "text":
        window.clipboardManager.copyText(item.content || "");
        break;
      case "image":
        // TODO: 实现图片复制
        window.clipboardManager.copyImage?.(item.imageData || "");
        break;
      case "file":
        // TODO: 实现文件复制
        window.clipboardManager.copyFiles?.(item.filePaths || []);
        break;
    }
  };

  useEffect(() => {
    const cleanup = window?.clipboardManager.onClipboardChange((data) => {
      if (!data) return;

      setItems((prev) => {
        // 查找是否存在相同内容
        const existingIndex = prev.findIndex(
          (item) =>
            item.type === data.type &&
            ((data.type === "text" && item.content === data.content) ||
              (data.type === "image" && item.imageData === data.imageData) ||
              (data.type === "file" &&
                JSON.stringify(item.filePaths) ===
                  JSON.stringify(data.filePaths)))
        );

        if (existingIndex > -1) {
          // 如果找到相同内容,将其移到最前面并更新时间戳
          const existingItem = prev[existingIndex];
          const newItems = [
            { ...existingItem, timestamp: Date.now() },
            ...prev.slice(0, existingIndex),
            ...prev.slice(existingIndex + 1),
          ];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
          return newItems;
        }

        // 如果是新内容,添加到最前面
        const newItems = [
          {
            id: Date.now().toString(),
            ...data,
            timestamp: Date.now(),
          },
          ...prev,
        ].slice(0, MAX_ITEMS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        return newItems;
      });
    });

    return cleanup;
  }, []);

  return {
    items,
    copyToClipboard,
  };
};

// 更新全局类型定义
declare global {
  interface Window {
    clipboardManager: {
      onClipboardChange: (
        callback: (data: Omit<ClipboardItem, "id" | "timestamp">) => void
      ) => () => void;
      copyText: (text: string) => void;
      copyImage?: (imageData: string) => void;
      copyFiles?: (filePaths: string[]) => void;
    };
  }
}

export type { ClipboardItem };
