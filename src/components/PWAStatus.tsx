'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Smartphone, AlertCircle } from 'lucide-react';

interface PWAStatusProps {
  showDebugInfo?: boolean;
}

export default function PWAStatus({ showDebugInfo = false }: PWAStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [pwaStatus, setPwaStatus] = useState({
    isInstalled: false,
    hasServiceWorker: false,
    isStandalone: false,
    isDevelopment: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    // Check PWA status
    const checkPWAStatus = () => {
      setPwaStatus({
        isInstalled: window.matchMedia('(display-mode: standalone)').matches,
        hasServiceWorker: 'serviceWorker' in navigator,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        isDevelopment: process.env.NODE_ENV === 'development'
      });
    };

    checkPWAStatus();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show offline status
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 px-4 text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span>You&apos;re offline. Some features may be limited.</span>
        </div>
      </div>
    );
  }

  // Show PWA debug info in development
  if (showDebugInfo && pwaStatus.isDevelopment) {
    return (
      <div className="fixed top-0 right-0 z-50 bg-blue-600 text-white py-2 px-4 text-xs max-w-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-3 h-3" />
            <span className="font-semibold">PWA Status</span>
          </div>
          <div className="space-y-1 text-xs">
            <div>Installed: {pwaStatus.isInstalled ? '✅' : '❌'}</div>
            <div>Service Worker: {pwaStatus.hasServiceWorker ? '✅' : '❌'}</div>
            <div>Standalone: {pwaStatus.isStandalone ? '✅' : '❌'}</div>
            <div>Mode: {pwaStatus.isDevelopment ? 'Development' : 'Production'}</div>
          </div>
        </div>
      </div>
    );
  }

  // Show PWA installed status
  if (pwaStatus.isInstalled) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white py-2 px-4 text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Smartphone className="w-4 h-4" />
          <span>App is installed and running in standalone mode</span>
        </div>
      </div>
    );
  }

  return null;
}
