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
        width: 180,
        borderRadius: 12,
        padding: 8,
      }}
    >
      <ClipboardButtons />
    </div>
  );
}

export default IndexPopup;
