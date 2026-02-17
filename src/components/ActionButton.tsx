import { useState } from 'react';

type Props = {
  children: React.ReactNode;
  onClick: () => Promise<number>;
  successMessage: (count: number) => string;
  errorMessage: string;
  variant?: 'default' | 'danger';
};

export const ActionButton = ({
  children,
  onClick,
  successMessage,
  errorMessage,
  variant = 'default',
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(children);

  const colors = {
    default: {
      background: '#4285F4',
      hover: '#3367D6',
      shadow: 'rgba(66, 133, 244, 0.2)',
      hoverShadow: 'rgba(66, 133, 244, 0.3)',
    },
    danger: {
      background: '#FF8C00',
      hover: '#FF7700',
      shadow: 'rgba(255, 140, 0, 0.2)',
      hoverShadow: 'rgba(255, 140, 0, 0.3)',
    },
  };

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const count = await onClick();
      const message = successMessage(count);
      setButtonLabel(message);

      setTimeout(() => {
        setButtonLabel(children);
      }, 2000);
    } catch (error) {
      setButtonLabel(errorMessage);

      setTimeout(() => {
        setButtonLabel(children);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          borderRadius: 6,
          backgroundColor: isLoading ? '#e0e0e0' : colors[variant].background,
          color: 'white',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: 13,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          boxShadow: isLoading ? 'none' : `0 2px 4px ${colors[variant].shadow}`,
          transform: isLoading ? 'none' : 'translateY(0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
        onMouseEnter={e => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = colors[variant].hover;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 4px 8px ${colors[variant].hoverShadow}`;
          }
        }}
        onMouseLeave={e => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = colors[variant].background;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 2px 4px ${colors[variant].shadow}`;
          }
        }}
      >
        {isLoading && (
          <div
            style={{
              width: 14,
              height: 14,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
        {buttonLabel}
      </button>

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
