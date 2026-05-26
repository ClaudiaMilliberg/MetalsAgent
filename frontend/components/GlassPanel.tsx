'use client';

import React from 'react';
import { GLASS, MOTION, A11Y } from '@/lib/design-system';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  blurSize?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: 'dark' | 'darker' | 'panel';
  borderStyle?: 'light' | 'lighter' | 'accent';
  shadowType?: 'inner' | 'outer' | 'both';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  animationType?: 'fade' | 'slideIn' | 'scaleIn';
  animationDuration?: 'quick' | 'normal' | 'slow';
  interactive?: boolean;
  role?: string;
  ariaLabel?: string;
}

export default function GlassPanel({
  children,
  className = '',
  blurSize = 'md',
  bgColor = 'dark',
  borderStyle = 'light',
  shadowType = 'both',
  padding = 'md',
  rounded = 'md',
  animate = false,
  animationType = 'fade',
  animationDuration = 'normal',
  interactive = false,
  role,
  ariaLabel,
}: GlassPanelProps) {
  // Padding map
  const paddingMap: Record<string, string> = {
    sm: '12px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  };

  // Border radius map
  const roundedMap: Record<string, string> = {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  };

  // Shadow combination
  let boxShadow = '';
  if (shadowType === 'inner') boxShadow = GLASS.shadow.inner;
  else if (shadowType === 'outer') boxShadow = GLASS.shadow.outer;
  else if (shadowType === 'both')
    boxShadow = `${GLASS.shadow.inner}, ${GLASS.shadow.outer}`;

  // Animation styles
  let animationStyles = '';
  if (animate) {
    const keyframesMap: Record<string, string> = {
      fade: `
        @keyframes glassIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
      slideIn: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
      scaleIn: `
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `,
    };

    const animationName = animationType === 'fade' ? 'glassIn' : animationType === 'slideIn' ? 'slideIn' : 'scaleIn';

    animationStyles = `
      ${keyframesMap[animationType]}
      animation: ${animationName} ${MOTION.duration[animationDuration]}ms ${MOTION.easing.smooth};
    `;
  }

  // Interactive hover styles
  let hoverStyles = '';
  if (interactive) {
    hoverStyles = `
      cursor: pointer;
      transition: all ${MOTION.duration.normal}ms ${MOTION.easing.smooth};

      &:hover {
        box-shadow:
          inset 0 1px 2px rgba(255, 255, 255, 0.08),
          0 12px 48px rgba(0, 0, 0, 0.4);
        background: rgba(20, 27, 35, 0.85);
        border-color: rgba(255, 255, 255, 0.15);
      }

      &:focus-visible {
        outline: none;
        box-shadow:
          ${GLASS.shadow.inner},
          ${GLASS.shadow.outer},
          0 0 0 3px rgba(59, 130, 246, 0.3);
      }
    `;
  }

  // Reduced motion fallback
  const reducedMotionStyles = `
    ${A11Y.prefersReducedMotion} {
      animation: none !important;
      transition: none !important;
    }
  `;

  const styles = `
    ${animationStyles}
    ${hoverStyles}
    ${reducedMotionStyles}
  `;

  return (
    <>
      <style>{styles}</style>
      <div
        className={className}
        role={role}
        aria-label={ariaLabel}
        style={{
          background: GLASS.bg[bgColor],
          backdropFilter: `blur(${GLASS.blur[blurSize]})`,
          border: GLASS.border[borderStyle],
          boxShadow: boxShadow,
          padding: paddingMap[padding],
          borderRadius: roundedMap[rounded],
          position: 'relative',
        }}
      >
        {children}
      </div>
    </>
  );
}
