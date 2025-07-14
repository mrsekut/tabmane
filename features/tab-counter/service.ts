export const updateBadge = async (): Promise<void> => {
  const windows = await chrome.windows.getAll({ populate: true });

  const totalTabs = windows.reduce(
    (total, window) => total + (window.tabs?.length ?? 0),
    0,
  );

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
