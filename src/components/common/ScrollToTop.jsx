import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../../utils/scrollUtils';

/**
 * ScrollToTop component that automatically scrolls to top on route changes
 * Place this component inside your Router to enable global scroll-to-top behavior
 */
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route changes
    scrollToTop({ behavior: 'smooth' });
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;