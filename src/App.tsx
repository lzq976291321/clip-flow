import { useState } from "react";
import { useClipboardManager } from "./hooks/useClipboardManager";
import { useTheme } from "./hooks/useTheme";
import "./App.css";

function App() {
  const { items, copyToClipboard } = useClipboardManager();
  const { isDark } = useTheme();

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>
      <div className="clipboard-list">
        {items.map((item) => (
          <div
            key={item.id}
            className="clipboard-item"
            onClick={() => copyToClipboard(item)}
          >
            {item.type === "text" && <div className="text">{item.content}</div>}
            {item.type === "image" && (
              <img className="img" src={item.imageData} alt="Clipboard" />
            )}
            {item.type === "file" && (
              <div className="file-list">
                {item.filePaths?.map((path) => (
                  <div key={path}>{path}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
