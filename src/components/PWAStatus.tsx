'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 px-4 text-center text-sm">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span>You&apos;re offline. Some features may be limited.</span>
      </div>
    </div>
  );
}
