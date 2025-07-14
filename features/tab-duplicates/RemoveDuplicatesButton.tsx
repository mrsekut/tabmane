import { removeDuplicateTabs } from './service';

type Props = {
  buttonStyle: React.CSSProperties;
};

export const RemoveDuplicatesButton = ({ buttonStyle }: Props) => {
  return (
    <button onClick={removeDuplicateTabs} style={buttonStyle}>
      Remove Duplicates
    </button>
  );
};
