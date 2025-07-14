import { useState } from 'react';
import { copyTabUrls, pasteTabUrls } from './service';

type Props = {
  buttonStyle: React.CSSProperties;
};

type FeedbackState = {
  copy: { show: boolean; message: string };
  paste: { show: boolean; message: string };
};

export const ClipboardButtons = ({ buttonStyle }: Props) => {
  const [feedback, setFeedback] = useState<FeedbackState>({
    copy: { show: false, message: '' },
    paste: { show: false, message: '' },
  });

  const showFeedback = (action: 'copy' | 'paste', message: string) => {
    setFeedback(prev => ({
      ...prev,
      [action]: { show: true, message },
    }));

    setTimeout(() => {
      setFeedback(prev => ({
        ...prev,
        [action]: { show: false, message: '' },
      }));
    }, 2000);
  };

  const handleCopy = async () => {
    try {
      const tabCount = await copyTabUrls();
      showFeedback('copy', `Copied ${tabCount} URLs`);
    } catch (error) {
      showFeedback('copy', 'Failed to copy URLs');
    }
  };

  const handlePaste = async () => {
    try {
      const urlCount = await pasteTabUrls();
      showFeedback('paste', `Opened ${urlCount} tabs`);
    } catch (error) {
      showFeedback('paste', 'Failed to paste URLs');
    }
  };

  const feedbackStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#4285F4',
    marginTop: 4,
    height: 16,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <>
      <div>
        <button onClick={handleCopy} style={buttonStyle}>
          Copy URLs
        </button>
        <div style={feedbackStyle}>
          {feedback.copy.show && feedback.copy.message}
        </div>
      </div>

      <div>
        <button onClick={handlePaste} style={buttonStyle}>
          Paste URLs
        </button>
        <div style={feedbackStyle}>
          {feedback.paste.show && feedback.paste.message}
        </div>
      </div>
    </>
  );
};
