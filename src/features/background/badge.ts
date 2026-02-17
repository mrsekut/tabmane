type BadgeColor = 'success' | 'default';

const COLORS = {
  success: '#4CAF50',
  default: '#666',
} as const satisfies Record<BadgeColor, string>;

const DISPLAY_DURATION = 3000;

export async function showTemporaryBadge(
  text: string,
  color: BadgeColor = 'default',
): Promise<void> {
  setBadge(text, COLORS[color]);

  setTimeout(() => {
    updateBadgeWithTabCount();
  }, DISPLAY_DURATION);
}

async function updateBadgeWithTabCount(): Promise<void> {
  const tabs = await chrome.tabs.query({});
  setBadge(tabs.length.toString(), COLORS.default);
}

function setBadge(text: string, color: string): void {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}
