const POPUP_FILE = 'popup.html';

export async function showPopup(): Promise<void> {
  try {
    await chrome.action.setPopup({ popup: POPUP_FILE });
    await chrome.action.openPopup();
  } catch (error) {
    await disablePopup();
  }
}

export async function disablePopup(): Promise<void> {
  await chrome.action.setPopup({ popup: '' });
}
