import { ActionButton } from '../../shared/components/ActionButton';
import { copyTabUrls, openTabUrls } from './service';

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
        onClick={openTabUrls}
        successMessage={count => `Opened ${count} tabs`}
        errorMessage="Failed to open URLs"
      >
        Open URLs
      </ActionButton>
    </>
  );
};
