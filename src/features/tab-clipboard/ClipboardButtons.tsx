import { ActionButton } from '../../shared/components/ActionButton';
import { copyTabUrls, pasteTabUrls } from './service';

export const ClipboardButtons = () => {
  return (
    <>
      <ActionButton
        onClick={copyTabUrls}
        successMessage={count => `Copied ${count} URLs`}
        errorMessage="Failed to copy URLs"
      >
        Copy URLs
      </ActionButton>

      <ActionButton
        onClick={pasteTabUrls}
        successMessage={count => `Opened ${count} tabs`}
        errorMessage="Failed to paste URLs"
      >
        Paste URLs
      </ActionButton>
    </>
  );
};
