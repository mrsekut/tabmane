import { initializeTabCounter } from './features/tab-counter/service';
import { removeDuplicateTabs } from './features/tab-duplicates/service';

export {};

// タブカウンター機能を初期化（タブ数をバッジに表示）
initializeTabCounter();

type ClickTimer = NodeJS.Timeout | null;
type BadgeColor = '#4CAF50' | '#666'; // 緑（成功）と灰色（通常）

// 定数定義
const DOUBLE_CLICK_DELAY = 300; // ダブルクリック判定の時間（ミリ秒）
const BADGE_DISPLAY_DURATION = 3000; // バッジ表示時間（ミリ秒）
const POPUP_DISABLE_DELAY = 100; // ポップアップを無効化するまでの遅延

// シングルクリックとダブルクリックを判別するためのタイマー
let clickTimer: ClickTimer = null;

// 拡張機能のインストール時にポップアップを無効化
// これにより、アイコンクリック時にポップアップではなく onClicked イベントが発火する
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setPopup({ popup: '' });
});

// 拡張機能アイコンがクリックされた時の処理
// シングルクリック: 重複タブ削除
// ダブルクリック: ポップアップを一時的に表示
chrome.action.onClicked.addListener(async _tab => {
  if (isSecondClick()) {
    await handleDoubleClick();
  } else {
    scheduleClickAction();
  }
});

const handleDoubleClick = async (): Promise<void> => {
  clearClickTimer();
  await enablePopupTemporarily();
};

// ポップアップを一時的に有効化して表示
// 表示後すぐに無効化して、次回のクリックで onClicked が発火するようにする
const enablePopupTemporarily = async (): Promise<void> => {
  await chrome.action.setPopup({ popup: 'popup.html' });
  await chrome.action.openPopup();
  setTimeout(() => {
    chrome.action.setPopup({ popup: '' });
  }, POPUP_DISABLE_DELAY);
};

const isSecondClick = () => clickTimer !== null;

const clearClickTimer = () => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
};

// バッジのテキストと色を設定
const setBadge = (text: string, color: BadgeColor) => {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
};

// シングルクリック時の処理: 重複タブ削除と結果表示
const handleSingleClick = async () => {
  const removedCount = await removeDuplicateTabs();
  setBadge(removedCount.toString(), '#4CAF50');

  // 一定時間後に通常のタブ数表示に戻す
  setTimeout(() => {
    updateBadge();
  }, BADGE_DISPLAY_DURATION);
};

// シングルクリック処理をスケジュール
// DOUBLE_CLICK_DELAY 後に実行されるが、その前にダブルクリックが検出されればキャンセル
const scheduleClickAction = () => {
  clickTimer = setTimeout(async () => {
    clickTimer = null;
    await handleSingleClick();
  }, DOUBLE_CLICK_DELAY);
};

// タブカウンターのバッジ更新関数
// 現在開いているタブ数を取得してバッジに表示
const updateBadge = async () => {
  const tabs = await chrome.tabs.query({});
  chrome.action.setBadgeText({ text: tabs.length.toString() });
  chrome.action.setBadgeBackgroundColor({ color: '#666' });
};
