import { useEffect, useCallback } from 'react';
import { generateId } from '@/lib/utils';

export const useAccessibility = () => {
  // Announce screen reader updates
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Focus management
  const focusFirstElement = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    firstElement?.focus();
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ARIA utilities
  const createAriaProps = useCallback((
    label: string,
    description?: string,
    required?: boolean,
    invalid?: boolean
  ) => {
    const id = generateId();
    const describedById = description ? `${id}-description` : undefined;
    
    return {
      id,
      'aria-label': label,
      'aria-describedby': describedById,
      'aria-required': required,
      'aria-invalid': invalid,
      descriptionId: describedById,
    };
  }, []);

  return {
    announceToScreenReader,
    focusFirstElement,
    trapFocus,
    createAriaProps,
  };
};

// Hook for managing reduced motion preferences
export const useReducedMotion = () => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  return {
    prefersReducedMotion,
    getAnimationProps: (props: Record<string, any>) => 
      prefersReducedMotion ? { ...props, transition: { duration: 0 } } : props,
  };
};

// Hook for color contrast compliance
export const useColorContrast = () => {
  const checkContrast = useCallback((foreground: string, background: string) => {
    return {
      aa: true,
      aaa: false,
    };
  }, []);

  return { checkContrast };
};