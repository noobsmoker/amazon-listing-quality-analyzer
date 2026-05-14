# Amazon Listing Quality Analyzer

A Chrome extension that analyzes Amazon product listings for quality and provides a delta review score for strengths and weaknesses.

## Features

- Analyzes Amazon product listings on amazon.com, amazon.co.uk, amazon.de, amazon.fr, amazon.co.jp, and amazon.ca
- Provides a quality score with breakdown of strengths and weaknesses
- Simple popup interface with one-click analysis
- Works on active Amazon product pages

## Installation

### For Developers / Testing

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the directory containing this extension (the folder with manifest.json)

### For End Users (Coming Soon)

This extension will be available in the Chrome Web Store once published.

## How It Works

1. Navigate to any Amazon product page
2. Click the extension icon in your Chrome toolbar
3. Click "Analyze Current Page" in the popup
4. View the quality score, strengths, and weaknesses

## Permissions

- `activeTab`: To analyze the currently active Amazon tab
- `storage`: To store analysis results temporarily
- Host permissions for Amazon domains: To inject the content script on Amazon pages

## Development

This extension uses:
- Manifest V3
- Vanilla JavaScript
- HTML/CSS for the popup

## Files

- `manifest.json`: Extension configuration
- `contentScript.js`: Runs on Amazon pages to collect listing data
- `popup.html`: Popup UI
- `popup.js`: Popup logic

## License

MIT

## Disclaimer

This extension is not affiliated with Amazon or any of its subsidiaries.