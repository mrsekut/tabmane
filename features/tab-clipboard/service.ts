import type { TabUrl } from './types';

export const copyTabUrls = async (): Promise<void> => {
  const currentWindow = await chrome.windows.getCurrent({ populate: true });
  const urls = extractUrlsFromTabs(currentWindow.tabs);
  await navigator.clipboard.writeText(urls.join('\n'));
};

export const pasteTabUrls = async (): Promise<void> => {
  const text = await navigator.clipboard.readText();
  const urls = parseUrlsFromText(text);

  urls.forEach(url => {
    if (isValidUrl(url)) {
      chrome.tabs.create({ url });
    }
  });
};

const extractUrlsFromTabs = (tabs?: chrome.tabs.Tab[]): TabUrl[] => {
  if (!tabs) return [];
  return tabs.map(tab => tab.url).filter((url): url is TabUrl => !!url);
};

const parseUrlsFromText = (text: string): TabUrl[] => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

const isValidUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://');
};
