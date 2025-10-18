'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/common/ui/button';
import { Download, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallAppButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function InstallAppButton({ 
  variant = 'primary', 
  size = 'md', 
  showText = true,
  className = ''
}: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Check if we're in a supported browser
      if (typeof window === 'undefined') return;
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      
      if (isIOS && !isInStandaloneMode) {
        alert('To install this app on iOS, tap the Share button and then "Add to Home Screen".');
        return;
      }
      
      // For other browsers, show instructions
      alert('Install prompt not available. Please use your browser\'s menu to "Install App" or "Add to Home Screen".');
      return;
    }

    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
        setIsInstalled(true);
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
      alert('Failed to install app. Please try again or use your browser menu to install.');
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Show button if we have a deferred prompt or if we're in a supported environment
  if (typeof window === 'undefined') return null;
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Show button if:
  // 1. We have a deferred prompt (Chrome/Edge)
  // 2. We're on iOS and not in standalone mode
  // 3. We're in development mode
  const shouldShow = deferredPrompt || (isIOS && !isInStandaloneMode) || isDevelopment;

  console.log('InstallAppButton render:', { 
    isDevelopment, 
    deferredPrompt: !!deferredPrompt, 
    isIOS,
    isInStandaloneMode,
    shouldShow, 
    isInstalled 
  });

  // Don't show if no install prompt available and not in supported environment
  if (!shouldShow) {
    console.log('InstallAppButton: Not showing button');
    return null;
  }

  const getButtonContent = () => {
    if (isInstalling) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          {showText && <span>Installing...</span>}
        </>
      );
    }

    return (
      <>
        <Download className="w-4 h-4" />
        {showText && <span>Install App</span>}
      </>
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
      case 'outline':
        return 'border border-primary text-primary hover:bg-primary hover:text-white';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  return (
    <Button
      onClick={handleInstallClick}
      disabled={isInstalling}
      className={`${getSizeClasses()} ${getVariantClasses()} ${className}`}
    >
      {getButtonContent()}
    </Button>
  );
}
