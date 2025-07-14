import { ClipboardButtons } from './features/tab-clipboard/ClipboardButtons';
import { RemoveDuplicatesButton } from './features/tab-duplicates/RemoveDuplicatesButton';

function IndexPopup() {
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

      <ClipboardButtons />
      <RemoveDuplicatesButton />
    </div>
  );
}

export default IndexPopup;
