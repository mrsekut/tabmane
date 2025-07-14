import { ActionButton } from '../../shared/components/ActionButton';
import { removeDuplicateTabs } from './service';

export const RemoveDuplicatesButton = () => {
  return (
    <ActionButton
      onClick={removeDuplicateTabs}
      successMessage={count =>
        count === 0 ? 'No duplicates found' : `Removed ${count} duplicate tabs`
      }
      errorMessage="Failed to remove duplicates"
    >
      Remove Duplicates
    </ActionButton>
  );
};
