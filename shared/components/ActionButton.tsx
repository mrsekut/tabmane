import { useState } from 'react';

type Props = {
  children: React.ReactNode;
  onClick: () => Promise<number>;
  successMessage: (count: number) => string;
  errorMessage: string;
};

export const ActionButton = ({
  children,
  onClick,
  successMessage,
  errorMessage,
}: Props) => {
  const [feedback, setFeedback] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: '',
  });

  const showFeedback = (message: string) => {
    setFeedback({ show: true, message });

    setTimeout(() => {
      setFeedback({ show: false, message: '' });
    }, 2000);
  };

  const handleClick = async () => {
    try {
      const count = await onClick();
      showFeedback(successMessage(count));
    } catch (error) {
      showFeedback(errorMessage);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: 4,
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        {children}
      </button>

      <div
        style={{
          fontSize: 12,
          color: '#4285F4',
          marginTop: 4,
          height: 16,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {feedback.show && feedback.message}
      </div>
    </div>
  );
};
