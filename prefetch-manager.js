/**
 * PrefetchManager
 * Handles aggressive preloading of HTML and Image assets to improve perceived performance.
 */
class PrefetchManager {
    constructor() {
        this.fetchedUrls = new Set();
        this.observer = null;
    }

    init() {
        console.log("PrefetchManager initialized.");
        this.setupLinkPrefetching();
    }

    /**
     * Sets up event listeners for all internal links to prefetch on hover.
     */
    setupLinkPrefetching() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (this.isInternalLink(link)) {
                link.addEventListener('mouseenter', () => this.prefetchUrl(link.href));
                link.addEventListener('touchstart', () => this.prefetchUrl(link.href), { passive: true });
            }
        });
    }

    /**
     * Checks if a link is internal to the website.
     * @param {HTMLAnchorElement} link 
     * @returns {boolean}
     */
    isInternalLink(link) {
        return link.hostname === window.location.hostname;
    }

    /**
     * Fetches and caches the HTML content of a URL.
     * @param {string} url 
     */
    async prefetchUrl(url) {
        if (this.fetchedUrls.has(url)) return;

        this.fetchedUrls.add(url);
        // console.log(`Prefetching: ${url}`);

        try {
            const response = await fetch(url, { priority: 'low' });
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            // The browser cache will store the response.
        } catch (err) {
            console.warn(`Error prefetching ${url}:`, err);
        }
    }

    /**
     * Preloads an image.
     * @param {string} src 
     */
    static prefetchImage(src) {
        if (!src) return;
        const img = new Image();
        img.src = src;
        // console.log(`Prefetching Image: ${src}`);
    }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    window.PrefetchManager = new PrefetchManager();
    window.PrefetchManager.init();

    // Expose static method globally for ease of use in inline scripts
    window.PrefetchManagerClass = PrefetchManager;
});
