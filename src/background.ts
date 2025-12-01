import { initializeTabCounter } from './features/tab-counter/service';
import { ClickHandler } from './features/background/ClickHandler';
import { showTemporaryBadge } from './features/background/badge';
import { showPopup, disablePopup } from './features/background/popup';
import { removeDuplicateTabs } from './features/tab-duplicates/service';

export {};

// 初期化
initializeServices();

function initializeServices() {
  // タブカウンターの初期化
  initializeTabCounter();

  // クリックハンドラーの設定
  const clickHandler = new ClickHandler({
    onSingleClick: async () => {
      try {
        const removedCount = await removeDuplicateTabs();
        await showTemporaryBadge(removedCount.toString(), 'success');
      } catch (error) {
        console.error('Error in single click handler:', error);
      }
    },
    onDoubleClick: async () => {
      try {
        await showPopup();
      } catch (error) {
        console.error('Error in double click handler:', error);
      }
    },
  });

  chrome.runtime.onInstalled.addListener(() => {
    disablePopup();
  });

  chrome.runtime.onConnect.addListener(port => {
    if (port.name === 'popup') {
      port.onDisconnect.addListener(() => {
        disablePopup();
      });
    }
  });

  chrome.action.onClicked.addListener(_tab => {
    clickHandler.handleClick();
  });
}
