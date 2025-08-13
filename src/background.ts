import { initializeTabCounter } from './features/tab-counter/service';
import { removeDuplicateTabs } from './features/tab-duplicates/service';

export {};

type ClickTimer = NodeJS.Timeout | null;
type BadgeColor = '#4CAF50' | '#666';

const DOUBLE_CLICK_DELAY = 300;
const BADGE_DISPLAY_DURATION = 3000;
const POPUP_DISABLE_DELAY = 100;

let clickTimer: ClickTimer = null;

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
    if (isSecondClick()) {
      await handleDoubleClick();
    } else {
      scheduleClickAction();
    }
  });
}

function initializePopupState() {
  chrome.action.setPopup({ popup: '' });
}

function isSecondClick() {
  return clickTimer !== null;
}

function scheduleClickAction() {
  clickTimer = setTimeout(async () => {
    clickTimer = null;
    await handleSingleClick();
  }, DOUBLE_CLICK_DELAY);
}

async function handleDoubleClick(): Promise<void> {
  clearClickTimer();
  await enablePopupTemporarily();
}

function clearClickTimer() {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
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
  await chrome.action.setPopup({ popup: 'popup.html' });
  await chrome.action.openPopup();
  setTimeout(() => {
    chrome.action.setPopup({ popup: '' });
  }, POPUP_DISABLE_DELAY);
}
