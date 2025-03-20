'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the MouseTrail component with SSR disabled
const MouseTrail = dynamic(() => import('@/components/mouse-trail'), {
  ssr: false,
  loading: () => null,
});

export function ResponsiveMouseTrail() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted to avoid hydration mismatch
    setIsMounted(true);

    // Check initial screen size
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 800);
    };

    // Set initial value
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Don't render anything during SSR or before hydration
  if (!isMounted) return null;

  // Only render MouseTrail if screen is large enough
  return isLargeScreen ? (
    <div className="fixed inset-0 pointer-events-none">
      <MouseTrail />
    </div>
  ) : null;
}

export default ResponsiveMouseTrail;
