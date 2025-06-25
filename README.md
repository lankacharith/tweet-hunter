# 🔥 Tweet Hunter - Chrome Extension

A Chrome extension that automatically displays the top tweets by likes on X (formerly Twitter) profile pages.

## Features

- **Automatic Detection**: Detects when you're on an X/Twitter profile page
- **Real-time Scraping**: Scrapes all tweets currently in the DOM
- **Smart Sorting**: Sorts tweets by like count in descending order
- **Live Updates**: Updates automatically as more tweets load (handles infinite scroll)
- **Beautiful UI**: Clean, dark sidebar that matches X's design
- **Toggle Functionality**: Hide/show the sidebar with a single click
- **No APIs Required**: Works entirely client-side, no backend needed

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top right
4. **Click "Load unpacked"** and select the `tweet-hunter` folder
5. **Pin the extension** to your toolbar for easy access

### Method 2: Create Icons (Optional)

Before loading the extension, you may want to create proper icons:

1. Create 16x16, 48x48, and 128x128 PNG icons
2. Replace the placeholder files in the `icons/` folder:
   - `icons/icon16.png`
   - `icons/icon48.png` 
   - `icons/icon128.png`

You can use any image editor or online tools to create simple icons with a fire emoji 🔥 or "TH" text.

## Usage

1. **Navigate** to any X (Twitter) profile page (e.g., `https://x.com/naval`)
2. **Wait** for the page to load completely
3. **Look** for the sidebar on the right side of the screen
4. **View** the top 5 tweets by likes, displayed with:
   - Tweet content (truncated if too long)
   - Like count with heart emoji ❤️
   - Retweet count with arrow emoji 🔄 (if available)
   - Timestamp (if available)
   - Direct link to the tweet
5. **Click** the toggle button (−/+) to hide/show the sidebar
6. **Scroll** down the profile to load more tweets - the sidebar updates automatically!

## How It Works

### Technical Details

- **Content Script**: Runs on `https://x.com/*` and `https://twitter.com/*`
- **DOM Scraping**: Uses `querySelectorAll` to find tweet elements
- **Data Extraction**: Parses like counts, retweet counts, and tweet content
- **Real-time Updates**: Uses `MutationObserver` to detect new tweets
- **Smart Parsing**: Handles K, M, B suffixes in like counts (1K = 1000, 1M = 1000000)
- **Performance**: Updates every 3 seconds + debounced updates on DOM changes

### Supported Pages

- ✅ Profile pages: `https://x.com/username` or `https://twitter.com/username`
- ❌ Home timeline, search results, or other pages

### Data Extracted

For each tweet, the extension extracts:
- **Text content** (truncated to 100 characters)
- **Like count** (with proper number formatting)
- **Retweet count** (optional)
- **Tweet link** (if available)
- **Timestamp** (if available)

## File Structure

```
tweet-hunter/
├── manifest.json          # Extension configuration
├── content_script.js      # Main functionality
├── styles.css            # Sidebar styling
├── popup.html            # Extension popup
├── popup.js              # Popup functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Troubleshooting

### Extension Not Working?

1. **Check URL**: Make sure you're on a profile page (e.g., `https://x.com/username`)
2. **Refresh Page**: Try refreshing the page after installing the extension
3. **Check Console**: Open Developer Tools (F12) and look for any errors
4. **Reinstall**: Try removing and re-adding the extension

### Sidebar Not Appearing?

1. **Wait**: The sidebar appears after the page fully loads
2. **Scroll**: Try scrolling down to trigger tweet loading
3. **Check Permissions**: Ensure the extension has permission to run on the page

### Performance Issues?

- The extension updates every 3 seconds by default
- If you experience lag, you can modify the update interval in `content_script.js`

## Development

### Making Changes

1. **Edit** the files in the `tweet-hunter` folder
2. **Reload** the extension in `chrome://extensions/`
3. **Refresh** the X/Twitter page to see changes

### Key Files to Modify

- `content_script.js`: Main functionality and tweet scraping logic
- `styles.css`: Sidebar appearance and animations
- `manifest.json`: Extension permissions and configuration

## Privacy & Security

- **No Data Collection**: The extension doesn't collect or store any data
- **Client-side Only**: All processing happens in your browser
- **No External APIs**: No requests to external servers
- **Open Source**: Code is transparent and auditable

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ❌ Firefox (requires different manifest format)

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the extension!

---

**Note**: This extension is for educational purposes and personal use. Please respect X's Terms of Service and rate limits. 