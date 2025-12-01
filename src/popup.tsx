import { useEffect } from 'react';
import { ClipboardButtons } from './features/tab-clipboard/ClipboardButtons';

function IndexPopup() {
  useEffect(() => {
    // background との接続を確立。接続が切れた時（popup が閉じた時）に
    // background 側で disablePopup() が呼ばれる
    chrome.runtime.connect({ name: 'popup' });
  }, []);

  return (
    <div
      style={{
        width: 240,
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <ClipboardButtons />
    </div>
  );
}

export default IndexPopup;
