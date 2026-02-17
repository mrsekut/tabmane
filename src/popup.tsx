import { useEffect } from 'react';
import { ClipboardButtons } from './features/copyTabs/ClipboardButtons';

function IndexPopup() {
  useEffect(() => {
    // Establish connection with background.
    // When disconnected (popup closed), background calls disablePopup().
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
