import type { TabUrl } from './types';

export const copyTabUrls = async () => {
  const currentWindow = await chrome.windows.getCurrent({ populate: true });
  const urls = extractUrlsFromTabs(currentWindow.tabs);
  await navigator.clipboard.writeText(urls.join('\n'));
  return urls.length;
};

export const openTabUrls = async () => {
  const text = await navigator.clipboard.readText();
  const urls = parseUrlsFromText(text);
  const validUrls = urls.filter(isValidUrl);

  validUrls.forEach(url => {
    chrome.tabs.create({ url });
  });

  return validUrls.length;
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
