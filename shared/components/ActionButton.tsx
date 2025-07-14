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

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const count = await onClick();
      showFeedback(successMessage(count));
    } catch (error) {
      showFeedback(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          borderRadius: 8,
          backgroundColor: isLoading ? '#e0e0e0' : '#4285F4',
          color: 'white',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: 14,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          boxShadow: isLoading ? 'none' : '0 2px 4px rgba(66, 133, 244, 0.2)',
          transform: isLoading ? 'none' : 'translateY(0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        onMouseEnter={e => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#3367D6';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 4px 8px rgba(66, 133, 244, 0.3)';
          }
        }}
        onMouseLeave={e => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#4285F4';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 2px 4px rgba(66, 133, 244, 0.2)';
          }
        }}
      >
        {isLoading && (
          <div
            style={{
              width: 16,
              height: 16,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
        {children}
      </button>

      <div
        style={{
          fontSize: 12,
          color: feedback.show ? '#4285F4' : 'transparent',
          marginTop: 6,
          height: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 500,
          transition: 'color 0.2s ease',
        }}
      >
        {feedback.message}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `,
        }}
      />
    </div>
  );
};
