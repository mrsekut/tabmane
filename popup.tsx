import { ClipboardButtons } from './features/tab-clipboard/ClipboardButtons';
import { RemoveDuplicatesButton } from './features/tab-duplicates/RemoveDuplicatesButton';

function IndexPopup() {
  return (
    <div
      style={{
        width: 280,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            📋
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: 'white',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            Tab Manager
          </h1>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: 20,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <ClipboardButtons />
        <RemoveDuplicatesButton />
      </div>
    </div>
  );
}

export default IndexPopup;
