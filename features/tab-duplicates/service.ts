import type { TabGroup, DuplicateTabIds } from './types';

export const removeDuplicateTabs = async (): Promise<number> => {
  const currentWindow = await chrome.windows.getCurrent({ populate: true });
  const tabs = currentWindow.tabs || [];

  const duplicateIds = findDuplicateTabIds(tabs);

  if (duplicateIds.length > 0) {
    await chrome.tabs.remove(duplicateIds);
  }

  return duplicateIds.length;
};

const findDuplicateTabIds = (tabs: chrome.tabs.Tab[]): DuplicateTabIds => {
  const urlToTabs = groupTabsByUrl(tabs);
  const duplicateIds: DuplicateTabIds = [];

  urlToTabs.forEach(group => {
    if (group.tabs.length > 1) {
      const tabsToRemove = selectTabsToRemove(group.tabs);
      duplicateIds.push(...tabsToRemove);
    }
  });

  return duplicateIds;
};

const groupTabsByUrl = (tabs: chrome.tabs.Tab[]): Map<string, TabGroup> => {
  const urlToTabs = new Map<string, TabGroup>();

  tabs.forEach(tab => {
    if (tab.url) {
      const existing = urlToTabs.get(tab.url);
      if (existing) {
        existing.tabs.push(tab);
      } else {
        urlToTabs.set(tab.url, {
          url: tab.url,
          tabs: [tab],
        });
      }
    }
  });

  return urlToTabs;
};

const selectTabsToRemove = (
  duplicateTabs: chrome.tabs.Tab[],
): DuplicateTabIds => {
  // Keep the first tab (by index), remove the rest
  const sortedTabs = [...duplicateTabs].sort(
    (a, b) => (a.index || 0) - (b.index || 0),
  );

  return sortedTabs
    .slice(1)
    .map(tab => tab.id)
    .filter((id): id is number => id !== undefined);
};
