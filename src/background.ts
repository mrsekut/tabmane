import { initializeTabCounter } from './features/tab-counter/service';
import { removeDuplicateTabs } from './features/tab-duplicates/service';
import { logger } from './shared/services/logger';

export {};

type ClickTimer = NodeJS.Timeout | null;
type BadgeColor = '#4CAF50' | '#666';
type ClickState = {
  count: number;
  firstClickTime: number;
  timer: ClickTimer;
};

const DOUBLE_CLICK_DELAY = 500;
const BADGE_DISPLAY_DURATION = 3000;
const POPUP_DISABLE_DELAY = 100;
const CLICK_RESET_DELAY = 600;

let clickState: ClickState = {
  count: 0,
  firstClickTime: 0,
  timer: null,
};

// Service Workerの状態をログ出力（デバッグ用）
chrome.runtime.onSuspend?.addListener(async () => {
  await logger.info('Service Worker suspending', { clickState });
});

chrome.runtime.onStartup?.addListener(async () => {
  await logger.info('Service Worker starting up');
  // 明示的に初期化
  clickState = {
    count: 0,
    firstClickTime: 0,
    timer: null,
  };
});

main();

function main() {
  initializeTabCounter();
  setupEventListeners();
}

function setupEventListeners() {
  chrome.runtime.onInstalled.addListener(() => {
    initializePopupState();
  });

  chrome.action.onClicked.addListener(async _tab => {
    const now = Date.now();
    const prevState = { ...clickState };

    // タイマーが存在する場合は必ずクリア
    if (clickState.timer) {
      clearTimeout(clickState.timer);
      clickState.timer = null;
    }

    // クリック間隔が長すぎる場合、または初回クリックの場合はリセット
    if (
      clickState.count === 0 ||
      now - clickState.firstClickTime > CLICK_RESET_DELAY
    ) {
      clickState.count = 1;
      clickState.firstClickTime = now;
    } else {
      clickState.count++;
    }

    await logger.debug('Click detected', {
      prevState,
      currentState: { ...clickState },
      timeSinceFirst: now - clickState.firstClickTime,
    });

    // ダブルクリック判定（2回以上のクリック）
    if (clickState.count >= 2) {
      await logger.info('Double click detected');
      // 即座にカウントをリセット
      clickState.count = 0;
      clickState.firstClickTime = 0;
      await handleDoubleClick();
    } else {
      // シングルクリックの可能性がある場合
      clickState.timer = setTimeout(async () => {
        // タイマー実行時に再度カウントを確認
        if (clickState.count === 1) {
          await logger.info('Single click confirmed');
          await handleSingleClick();
        }
        // タイマー実行後は必ずリセット
        clickState.count = 0;
        clickState.firstClickTime = 0;
        clickState.timer = null;
      }, DOUBLE_CLICK_DELAY);
    }
  });
}

function initializePopupState() {
  chrome.action.setPopup({ popup: '' });
}

async function handleDoubleClick(): Promise<void> {
  await enablePopupTemporarily();
}

function setBadge(text: string, color: BadgeColor) {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

async function updateBadge() {
  const tabs = await chrome.tabs.query({});
  chrome.action.setBadgeText({ text: tabs.length.toString() });
  chrome.action.setBadgeBackgroundColor({ color: '#666' });
}

async function handleSingleClick() {
  try {
    const removedCount = await removeDuplicateTabs();
    await logger.info('Single click: Removed duplicate tabs', { removedCount });
    setBadge(removedCount.toString(), '#4CAF50');

    setTimeout(() => {
      updateBadge();
    }, BADGE_DISPLAY_DURATION);
  } catch (error) {
    await logger.error('Error in handleSingleClick', error);
  }
}

async function enablePopupTemporarily(): Promise<void> {
  try {
    await chrome.action.setPopup({ popup: 'popup.html' });
    await chrome.action.openPopup();

    setTimeout(async () => {
      try {
        await chrome.action.setPopup({ popup: '' });
      } catch (error) {
        await logger.error('Failed to reset popup', error);
      }
    }, POPUP_DISABLE_DELAY);
  } catch (error) {
    await logger.error('Failed to enable popup', error);
    // エラー時は完全に状態をリセット
    clickState.count = 0;
    clickState.firstClickTime = 0;
    if (clickState.timer) {
      clearTimeout(clickState.timer);
      clickState.timer = null;
    }
  }
}
