import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';

export interface AccessibilityOptions {
  announceChanges?: boolean;
  enableKeyboardNavigation?: boolean;
  enableScreenReaderSupport?: boolean;
  enableFocusManagement?: boolean;
}

export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    announceChanges = true,
    enableKeyboardNavigation = true,
    enableScreenReaderSupport = true,
    enableFocusManagement = true,
  } = options;

  const liveRegionRef = useRef<HTMLElement | null>(null);

  // Create announcement region for screen readers (singleton-like)
  useEffect(() => {
    if (!announceChanges || !enableScreenReaderSupport) return;

    // Reuse an existing announcer if present
    let region = document.getElementById(
      'global-aria-announcer'
    ) as HTMLDivElement | null;

    if (!region) {
      region = document.createElement('div');
      region.id = 'global-aria-announcer';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.setAttribute('role', 'status');
      region.style.position = 'absolute';
      region.style.left = '-10000px';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.overflow = 'hidden';
      document.body.appendChild(region);
    }

    liveRegionRef.current = region;

    // Do not remove the announcer on cleanup; just clear the ref
    return () => {
      liveRegionRef.current = null;
    };
  }, [announceChanges, enableScreenReaderSupport]);

  // Announce changes to screen readers
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (
        !announceChanges ||
        !enableScreenReaderSupport ||
        !liveRegionRef.current
      ) {
        return;
      }

      try {
        liveRegionRef.current.setAttribute('aria-live', priority);
        liveRegionRef.current.textContent = message;
        // Clear soon after to allow repeated announcements of same text
        setTimeout(() => {
          if (
            liveRegionRef.current &&
            document.body.contains(liveRegionRef.current)
          ) {
            liveRegionRef.current.textContent = '';
          }
        }, 1000);
      } catch (error) {
        // Silently handle DOM manipulation errors
        console.warn('Accessibility announcement failed:', error);
      }
    },
    [announceChanges, enableScreenReaderSupport]
  );

  // Focus management utilities
  const focusElement = useCallback(
    (element: HTMLElement | null) => {
      if (!enableFocusManagement || !element) return;
      element.focus();
      announce(
        `Focus moved to ${
          element.getAttribute('aria-label') || element.textContent || 'element'
        }`
      );
    },
    [enableFocusManagement, announce]
  );

  const focusFirstFocusable = useCallback(
    (container: HTMLElement) => {
      if (!enableFocusManagement) return;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      if (firstFocusable) {
        focusElement(firstFocusable);
      }
    },
    [enableFocusManagement, focusElement]
  );

  const focusLastFocusable = useCallback(
    (container: HTMLElement) => {
      if (!enableFocusManagement) return;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const lastFocusable = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;
      if (lastFocusable) {
        focusElement(lastFocusable);
      }
    },
    [enableFocusManagement, focusElement]
  );

  // Keyboard navigation helpers
  const createKeyboardNavigationHandler = useCallback(
    (
      onEnter?: () => void,
      onSpace?: () => void,
      onArrowUp?: () => void,
      onArrowDown?: () => void,
      onArrowLeft?: () => void,
      onArrowRight?: () => void,
      onEscape?: () => void
    ) => {
      if (!enableKeyboardNavigation) return () => {};

      return (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'Enter':
            if (onEnter) {
              event.preventDefault();
              onEnter();
            }
            break;
          case ' ':
            if (onSpace) {
              event.preventDefault();
              onSpace();
            }
            break;
          case 'ArrowUp':
            if (onArrowUp) {
              event.preventDefault();
              onArrowUp();
            }
            break;
          case 'ArrowDown':
            if (onArrowDown) {
              event.preventDefault();
              onArrowDown();
            }
            break;
          case 'ArrowLeft':
            if (onArrowLeft) {
              event.preventDefault();
              onArrowLeft();
            }
            break;
          case 'ArrowRight':
            if (onArrowRight) {
              event.preventDefault();
              onArrowRight();
            }
            break;
          case 'Escape':
            if (onEscape) {
              event.preventDefault();
              onEscape();
            }
            break;
        }
      };
    },
    [enableKeyboardNavigation]
  );

  // ARIA attributes helpers
  const getARIAProps = useCallback(
    (config: {
      label?: string;
      labelledBy?: string;
      describedBy?: string;
      expanded?: boolean;
      pressed?: boolean;
      selected?: boolean;
      disabled?: boolean;
      required?: boolean;
      invalid?: boolean;
      role?: string;
      live?: 'polite' | 'assertive' | 'off';
    }) => {
      const props: Record<string, any> = {};
      if (config.label) props['aria-label'] = config.label;
      if (config.labelledBy) props['aria-labelledby'] = config.labelledBy;
      if (config.describedBy) props['aria-describedby'] = config.describedBy;
      if (config.expanded !== undefined)
        props['aria-expanded'] = config.expanded;
      if (config.pressed !== undefined) props['aria-pressed'] = config.pressed;
      if (config.selected !== undefined)
        props['aria-selected'] = config.selected;
      if (config.disabled !== undefined)
        props['aria-disabled'] = config.disabled;
      if (config.required !== undefined)
        props['aria-required'] = config.required;
      if (config.invalid !== undefined) props['aria-invalid'] = config.invalid;
      if (config.role) props['role'] = config.role;
      if (config.live && config.live !== 'off')
        props['aria-live'] = config.live;
      return props;
    },
    []
  );

  return {
    announce,
    focusElement,
    focusFirstFocusable,
    focusLastFocusable,
    createKeyboardNavigationHandler,
    getARIAProps,
    isEnabled: {
      announceChanges,
      enableKeyboardNavigation,
      enableScreenReaderSupport,
      enableFocusManagement,
    },
  };
}

// Utility functions for common accessibility patterns
export const getElementDescription = (element: HTMLElement): string => {
  return (
    element.getAttribute('aria-label') ||
    element.textContent ||
    element.getAttribute('title') ||
    'Interactive element'
  );
};

export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'button',
    '[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  return focusableSelectors.some(
    (selector) => element.matches(selector) && !element.hasAttribute('disabled')
  );
};

export const createFocusTrap = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus the first element when trap is created
  firstFocusable?.focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};
