type TabGroup = {
  url: string;
  tabs: chrome.tabs.Tab[];
};

type DuplicateTabIds = number[];

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
  return Array.from(urlToTabs.values())
    .filter(group => group.tabs.length > 1)
    .flatMap(group => selectTabsToRemove(group.tabs));
};

const groupTabsByUrl = (tabs: chrome.tabs.Tab[]): Map<string, TabGroup> => {
  return tabs.reduce((acc, tab) => {
    if (!tab.url) return acc;
    return acc.set(tab.url, {
      url: tab.url,
      tabs: acc.get(tab.url)?.tabs.concat(tab) ?? [tab],
    });
  }, new Map<string, TabGroup>());
};

const selectTabsToRemove = (
  duplicateTabs: chrome.tabs.Tab[],
): DuplicateTabIds => {
  // Keep the first tab (by index), remove the rest
  const sortedTabs = duplicateTabs.toSorted(
    (a, b) => (a.index || 0) - (b.index || 0),
  );

  return sortedTabs
    .slice(1)
    .map(tab => tab.id)
    .filter(id => id !== undefined);
};
