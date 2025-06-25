// Tweet Hunter - Content Script
class TweetHunter {
  constructor() {
    this.sidebar = null;
    this.isVisible = true;
    this.updateInterval = null;
    this.mutationObserver = null;
    this.init();
  }

  init() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Check if we're on a profile page
    if (!this.isProfilePage()) {
      return;
    }

    // Create and inject sidebar
    this.createSidebar();
    
    // Start monitoring for changes
    this.startMonitoring();
    
    // Initial update
    this.updateTopTweets();
  }

  isProfilePage() {
    const url = window.location.href;
    const profilePattern = /^https:\/\/(x\.com|twitter\.com)\/[^\/]+\/?$/;
    return profilePattern.test(url);
  }

  createSidebar() {
    // Create sidebar container
    this.sidebar = document.createElement('div');
    this.sidebar.id = 'tweet-hunter-sidebar';
    this.sidebar.innerHTML = `
      <div class="th-header">
        <h3>🔥 Top Tweets</h3>
        <button class="th-toggle" title="Toggle sidebar">−</button>
      </div>
      <div class="th-content">
        <div class="th-loading">Loading top tweets...</div>
      </div>
    `;

    // Add toggle functionality
    const toggleBtn = this.sidebar.querySelector('.th-toggle');
    toggleBtn.addEventListener('click', () => this.toggleSidebar());

    // Inject into page
    document.body.appendChild(this.sidebar);
  }

  toggleSidebar() {
    this.isVisible = !this.isVisible;
    this.sidebar.classList.toggle('th-hidden', !this.isVisible);
    
    const toggleBtn = this.sidebar.querySelector('.th-toggle');
    toggleBtn.textContent = this.isVisible ? '−' : '+';
  }

  startMonitoring() {
    // Set up periodic updates
    this.updateInterval = setInterval(() => {
      this.updateTopTweets();
    }, 3000); // Update every 3 seconds

    // Set up mutation observer for dynamic content
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new tweets were added
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.querySelector && node.querySelector('[data-testid="tweet"]')) {
                shouldUpdate = true;
              }
            }
          });
        }
      });

      if (shouldUpdate) {
        // Debounce updates
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
          this.updateTopTweets();
        }, 1000);
      }
    });

    // Start observing
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  updateTopTweets() {
    const tweets = this.scrapeTweets();
    const topTweets = this.sortTweetsByLikes(tweets).slice(0, 5);
    this.renderTopTweets(topTweets);
  }

  scrapeTweets() {
    const tweets = [];
    
    // Find all tweet containers
    const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
    
    tweetElements.forEach((tweetElement) => {
      try {
        const tweetData = this.extractTweetData(tweetElement);
        if (tweetData) {
          tweets.push(tweetData);
        }
      } catch (error) {
        console.warn('Error extracting tweet data:', error);
      }
    });

    return tweets;
  }

  extractTweetData(tweetElement) {
    // Find tweet text
    const textElement = tweetElement.querySelector('[data-testid="tweetText"]');
    if (!textElement) return null;

    const text = textElement.textContent.trim();
    if (!text) return null;

    // Find like count
    const likeButton = tweetElement.querySelector('[data-testid="like"]');
    let likeCount = 0;
    
    if (likeButton) {
      const likeText = likeButton.textContent.trim();
      likeCount = this.parseCount(likeText);
    }

    // Find retweet count
    const retweetButton = tweetElement.querySelector('[data-testid="retweet"]');
    let retweetCount = 0;
    
    if (retweetButton) {
      const retweetText = retweetButton.textContent.trim();
      retweetCount = this.parseCount(retweetText);
    }

    // Find tweet link
    const tweetLink = tweetElement.closest('article')?.querySelector('a[href*="/status/"]');
    const link = tweetLink ? tweetLink.href : null;

    // Find timestamp
    const timeElement = tweetElement.querySelector('time');
    const timestamp = timeElement ? timeElement.getAttribute('datetime') : null;

    return {
      text,
      likeCount,
      retweetCount,
      link,
      timestamp,
      element: tweetElement
    };
  }

  parseCount(text) {
    if (!text) return 0;
    
    // Remove any non-numeric characters except K, M, B
    const cleanText = text.replace(/[^\d.KMB]/g, '');
    
    if (cleanText.includes('K')) {
      return parseFloat(cleanText.replace('K', '')) * 1000;
    } else if (cleanText.includes('M')) {
      return parseFloat(cleanText.replace('M', '')) * 1000000;
    } else if (cleanText.includes('B')) {
      return parseFloat(cleanText.replace('B', '')) * 1000000000;
    } else {
      return parseInt(cleanText) || 0;
    }
  }

  sortTweetsByLikes(tweets) {
    return tweets.sort((a, b) => b.likeCount - a.likeCount);
  }

  renderTopTweets(tweets) {
    const contentDiv = this.sidebar.querySelector('.th-content');
    
    if (tweets.length === 0) {
      contentDiv.innerHTML = '<div class="th-no-tweets">No tweets found</div>';
      return;
    }

    const tweetsHTML = tweets.map((tweet, index) => {
      const truncatedText = tweet.text.length > 100 
        ? tweet.text.substring(0, 100) + '...' 
        : tweet.text;
      
      const formattedLikes = this.formatCount(tweet.likeCount);
      const formattedRetweets = this.formatCount(tweet.retweetCount);
      
      const timeDisplay = tweet.timestamp 
        ? new Date(tweet.timestamp).toLocaleDateString()
        : '';

      return `
        <div class="th-tweet" data-rank="${index + 1}">
          <div class="th-tweet-header">
            <span class="th-rank">#${index + 1}</span>
            <span class="th-stats">
              ❤️ ${formattedLikes}
              ${tweet.retweetCount > 0 ? `🔄 ${formattedRetweets}` : ''}
            </span>
          </div>
          <div class="th-tweet-text">${this.escapeHtml(truncatedText)}</div>
          <div class="th-tweet-footer">
            ${timeDisplay ? `<span class="th-time">${timeDisplay}</span>` : ''}
            ${tweet.link ? `<a href="${tweet.link}" target="_blank" class="th-link">View Tweet</a>` : ''}
          </div>
        </div>
      `;
    }).join('');

    contentDiv.innerHTML = tweetsHTML;
  }

  formatCount(count) {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return count.toString();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    
    if (this.sidebar && this.sidebar.parentNode) {
      this.sidebar.parentNode.removeChild(this.sidebar);
    }
  }
}

// Initialize Tweet Hunter when script loads
const tweetHunter = new TweetHunter();

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  tweetHunter.destroy();
}); 