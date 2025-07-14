export const updateBadge = async (): Promise<void> => {
  const windows = await chrome.windows.getAll({ populate: true });
  let totalTabs = 0;

  windows.forEach(window => {
    if (window.tabs) {
      totalTabs += window.tabs.length;
    }
  });

  chrome.action.setBadgeText({ text: totalTabs.toString() });
  chrome.action.setBadgeBackgroundColor({ color: '#4285F4' });
};

export const initializeTabCounter = (): void => {
  chrome.tabs.onCreated.addListener(updateBadge);
  chrome.tabs.onRemoved.addListener(updateBadge);
  chrome.windows.onCreated.addListener(updateBadge);
  chrome.windows.onRemoved.addListener(updateBadge);

  updateBadge();
};
