import { copyTabUrls, pasteTabUrls } from './service';

type Props = {
  buttonStyle: React.CSSProperties;
};

export const ClipboardButtons = ({ buttonStyle }: Props) => {
  return (
    <>
      <button onClick={copyTabUrls} style={buttonStyle}>
        Copy URLs
      </button>
      <button onClick={pasteTabUrls} style={buttonStyle}>
        Paste URLs
      </button>
    </>
  );
};
