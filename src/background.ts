import { initializeTabCounter } from './features/tab-counter/service';
import { removeDuplicateTabs } from './features/tab-duplicates/service';

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

    if (clickState.timer) {
      clearTimeout(clickState.timer);
      clickState.timer = null;
    }

    if (
      clickState.count === 0 ||
      now - clickState.firstClickTime > CLICK_RESET_DELAY
    ) {
      clickState.count = 1;
      clickState.firstClickTime = now;
    } else {
      clickState.count++;
    }

    if (clickState.count >= 2) {
      clickState.count = 0;
      await handleDoubleClick();
    } else {
      clickState.timer = setTimeout(async () => {
        if (clickState.count === 1) {
          await handleSingleClick();
        }
        clickState.count = 0;
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
  const removedCount = await removeDuplicateTabs();
  setBadge(removedCount.toString(), '#4CAF50');

  setTimeout(() => {
    updateBadge();
  }, BADGE_DISPLAY_DURATION);
}

async function enablePopupTemporarily(): Promise<void> {
  try {
    await chrome.action.setPopup({ popup: 'popup.html' });
    await chrome.action.openPopup();

    setTimeout(async () => {
      try {
        await chrome.action.setPopup({ popup: '' });
      } catch (error) {
        console.error('Failed to reset popup:', error);
      }
    }, POPUP_DISABLE_DELAY);
  } catch (error) {
    console.error('Failed to enable popup:', error);
    clickState.count = 0;
  }
}
