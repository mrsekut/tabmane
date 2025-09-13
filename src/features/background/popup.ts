import { logger } from '../../shared/services/logger';

const POPUP_FILE = 'popup.html';
const DISABLE_DELAY = 100;

export async function showPopup(): Promise<void> {
  await logger.debug('Double click handling', {
    timestamp: new Date().toISOString(),
  });

  const startTime = Date.now();
  let resetTimer: NodeJS.Timeout | null = null;

  try {
    // ポップアップを有効化
    await enablePopup();

    // リセットタイマーを先に設定（openPopupの成否に関わらず実行される）
    resetTimer = setTimeout(async () => {
      try {
        await disablePopup();
      } catch (error) {
        console.error('Failed to reset popup:', error);
      }
    }, DISABLE_DELAY);

    // ポップアップを開く
    await chrome.action.openPopup();
  } catch (error) {
    await handlePopupError(error, startTime);

    // エラー時の後処理
    await cleanupAfterError(resetTimer);
  }
}

async function enablePopup(): Promise<void> {
  await chrome.action.setPopup({ popup: POPUP_FILE });
}

export async function disablePopup(): Promise<void> {
  await chrome.action.setPopup({ popup: '' });
}

async function handlePopupError(
  error: unknown,
  startTime: number,
): Promise<void> {
  await logger.error('Failed to open popup', {
    error:
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : error,
    timing: {
      elapsed: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    },
    chrome: {
      runtime: {
        id: chrome.runtime.id,
        lastError: chrome.runtime.lastError,
      },
    },
  });
}

async function cleanupAfterError(
  resetTimer: NodeJS.Timeout | null,
): Promise<void> {
  // ポップアップを確実に無効化
  try {
    await disablePopup();
  } catch (error) {
    console.error('Failed to reset popup after error:', error);
  }

  // タイマーをクリア
  if (resetTimer) {
    clearTimeout(resetTimer);
  }
}
