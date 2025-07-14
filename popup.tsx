import { ClipboardButtons } from './features/tab-clipboard/ClipboardButtons';
import { RemoveDuplicatesButton } from './features/tab-duplicates/RemoveDuplicatesButton';

function IndexPopup() {
  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: 4,
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: 14,
  };

  return (
    <div
      style={{
        padding: 16,
        width: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
        Tab Manager
      </h3>

      <ClipboardButtons buttonStyle={buttonStyle} />
      <RemoveDuplicatesButton buttonStyle={buttonStyle} />
    </div>
  );
}

export default IndexPopup;
