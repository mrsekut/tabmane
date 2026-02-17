# Tabmane

A simple Chrome extension for tab management.

## Install

[Chrome Web Store](https://chromewebstore.google.com/detail/tabmane/lkiipjfhkmchacakagikppdcpophifdn?authuser=0&hl=ja)

## Features

- Display total tab count across all windows
- Remove duplicate tabs within the same window (single click)
- Double click to open a popup with the following actions:
  - **Copy URLs**: Copy all tab URLs in the current window to clipboard
  - **Open URLs**: Read URLs from clipboard and open them in new tabs

## Development

```bash
bun install
```

Enable Developer Mode at `chrome://extensions/` and load the `build/chrome-mv3-dev` directory.

```bash
bun run dev
```
