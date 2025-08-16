/**
 * Scroll utility functions for consistent scroll behavior across the app
 */

/**
 * Scrolls to the top of the page with smooth animation
 * @param {Object} options - Scroll options
 * @param {string} options.behavior - Scroll behavior ('smooth' or 'auto')
 * @param {number} options.top - Top position to scroll to (default: 0)
 */
export const scrollToTop = (options = {}) => {
  const { behavior = 'smooth', top = 0 } = options;

  window.scrollTo({
    top,
    behavior,
  });
};

/**
 * Scrolls to a specific element by ID
 * @param {string} elementId - The ID of the element to scroll to
 * @param {Object} options - Scroll options
 */
export const scrollToElement = (elementId, options = {}) => {
  const { behavior = 'smooth', block = 'start', inline = 'nearest' } = options;

  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior,
      block,
      inline,
    });
  }
};

/**
 * Scrolls to top with a delay (useful for route transitions)
 * @param {number} delay - Delay in milliseconds (default: 0)
 * @param {Object} scrollOptions - Scroll options
 */
export const scrollToTopWithDelay = (delay = 0, scrollOptions = {}) => {
  setTimeout(() => {
    scrollToTop(scrollOptions);
  }, delay);
};

/**
 * Checks if the page is scrolled past a certain threshold
 * @param {number} threshold - Scroll threshold in pixels (default: 100)
 * @returns {boolean} - True if scrolled past threshold
 */
export const isScrolledPastThreshold = (threshold = 100) => {
  return window.scrollY > threshold;
};