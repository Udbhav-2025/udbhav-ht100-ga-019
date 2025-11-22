'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  fallback?: React.ReactNode;
  onErrorFallback?: () => void;
}

const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  ({ className, fallback, onErrorFallback, children, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const sourcesRef = useRef<React.ReactElement[]>([]);
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const errorHandledRef = useRef(false);

    // Extract source elements from children
    useEffect(() => {
      if (children && React.Children.count(children) > 0) {
        sourcesRef.current = React.Children.toArray(children).filter(
          (child): child is React.ReactElement => 
            React.isValidElement(child) && child.type === 'source'
        ) as React.ReactElement[];
      } else {
        sourcesRef.current = [];
      }
    }, [children]);

    // Combine refs
    const combinedRef = (node: HTMLVideoElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLVideoElement | null>).current = node;
      }
      videoRef.current = node;
    };

    const handleError = () => {
      // Prevent multiple error handlers from firing
      if (errorHandledRef.current) return;
      
      // Clear timeout
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }

      // Try next source if available (only once)
      if (currentSourceIndex < sourcesRef.current.length - 1 && !errorHandledRef.current) {
        errorHandledRef.current = true;
        setCurrentSourceIndex(currentSourceIndex + 1);
        // Try to reload with next source
        setTimeout(() => {
          if (videoRef.current && !hasError) {
            errorHandledRef.current = false;
            videoRef.current.load();
          }
        }, 100);
        return;
      }

      // All sources failed - show fallback immediately and stop trying
      if (!errorHandledRef.current) {
        errorHandledRef.current = true;
        setHasError(true);
        // Stop the video element
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.src = '';
          videoRef.current.load();
        }
        if (onErrorFallback) {
          onErrorFallback();
        }
      }
    };

    useEffect(() => {
      // Reset when children change
      setHasError(false);
      setCurrentSourceIndex(0);
      errorHandledRef.current = false;
      
      // Set timeout to show fallback if video doesn't load within 2 seconds
      loadTimeoutRef.current = setTimeout(() => {
        if (videoRef.current && videoRef.current.readyState < 2 && !errorHandledRef.current) {
          // Video hasn't loaded enough data
          errorHandledRef.current = true;
          setHasError(true);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.src = '';
          }
          if (onErrorFallback) {
            onErrorFallback();
          }
        }
      }, 2000);

      return () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
      };
    }, [children, onErrorFallback]);

    // Show fallback if error - don't render video at all
    if (hasError && fallback) {
      return <>{fallback}</>;
    }

    // Only render the current source being tried
    const currentSource = sourcesRef.current[currentSourceIndex];

    return (
      <video
        ref={combinedRef}
        className={cn('w-full h-full object-cover', className)}
        onError={handleError}
        onLoadedData={() => {
          // Clear timeout on successful load
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
            loadTimeoutRef.current = null;
          }
          errorHandledRef.current = false;
        }}
        onCanPlay={() => {
          // Clear timeout when video can play
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
            loadTimeoutRef.current = null;
          }
          errorHandledRef.current = false;
        }}
        {...props}
      >
        {currentSource}
      </video>
    );
  }
);

Video.displayName = 'Video';

export default Video;

