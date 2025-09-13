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

    // ダブルクリック判定（2回以上のクリック）
    if (clickState.count >= 2) {
      // 即座にカウントをリセット
      clickState.count = 0;
      clickState.firstClickTime = 0;
      await handleDoubleClick();
    } else {
      // シングルクリックの可能性がある場合
      clickState.timer = setTimeout(async () => {
        // タイマー実行時に再度カウントを確認
        if (clickState.count === 1) {
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
  // ダブルクリック時の情報を記録（エラー発生時のコンテキスト用）
  await logger.debug('Double click handling', {
    timestamp: new Date().toISOString(),
  });
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
    setBadge(removedCount.toString(), '#4CAF50');

    setTimeout(() => {
      updateBadge();
    }, BADGE_DISPLAY_DURATION);
  } catch (error) {
    console.error('Error in handleSingleClick:', error);
  }
}

async function enablePopupTemporarily(): Promise<void> {
  // タイマー変数を外で定義して、必ず実行されるようにする
  let resetTimer: NodeJS.Timeout | null = null;
  const startTime = Date.now();

  try {
    // まずポップアップを有効化
    await chrome.action.setPopup({ popup: 'popup.html' });

    // リセットタイマーを先に設定（openPopupの成否に関わらず実行される）
    resetTimer = setTimeout(async () => {
      try {
        await chrome.action.setPopup({ popup: '' });
      } catch (resetError) {
        console.error('Failed to reset popup:', resetError);
      }
    }, POPUP_DISABLE_DELAY);

    // ポップアップを開く試行
    await chrome.action.openPopup();
  } catch (error) {
    // openPopupのエラー原因を調査するための詳細ログ
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

    // エラー時も確実にポップアップを無効化
    try {
      await chrome.action.setPopup({ popup: '' });
    } catch (resetError) {
      console.error('Failed to reset popup after error:', resetError);
    }

    // タイマーが設定されていればクリア
    if (resetTimer) {
      clearTimeout(resetTimer);
    }

    // clickStateのリセット
    clickState.count = 0;
    clickState.firstClickTime = 0;
    if (clickState.timer) {
      clearTimeout(clickState.timer);
      clickState.timer = null;
    }
  }
}
