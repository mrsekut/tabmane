import { ClipboardButtons } from './features/tab-clipboard/ClipboardButtons';
import { RemoveDuplicatesButton } from './features/tab-duplicates/RemoveDuplicatesButton';

function IndexPopup() {
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
      <RemoveDuplicatesButton />
      <div style={{ marginTop: 16 }}>
        <ClipboardButtons />
      </div>
    </div>
  );
}

export default IndexPopup;
