import React, { useEffect, useRef, useState } from 'react';
import { isFinePointer, prefersReducedMotion } from '../hooks/useInteractiveEnhancements';

type CursorVariant = 'default' | 'link' | 'button' | 'image' | 'stage' | 'lightbox';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const check = () => setEnabled(isFinePointer() && !prefersReducedMotion());
    check();

    const mqPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    mqPointer.addEventListener('change', check);
    mqMotion.addEventListener('change', check);

    return () => {
      mqPointer.removeEventListener('change', check);
      mqMotion.removeEventListener('change', check);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.classList.remove('has-custom-cursor');
      return;
    }

    root.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let targetX = -100;
    let targetY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let visible = false;
    let pressed = false;
    let currentVariant: CursorVariant = 'default';
    let rafId = 0;

    const setVisibility = (v: boolean) => {
      visible = v;
      dot.style.opacity = v ? '1' : '0';
      ring.style.opacity = v ? '1' : '0';
    };

    const detectVariant = (target: EventTarget | null): CursorVariant => {
      if (!(target instanceof Element)) return 'default';
      if (target.closest('.lb')) {
        if (target.closest('button, a, [role="button"]')) return 'button';
        return 'lightbox';
      }
      if (target.closest('.tilt, .sheet, .portrait img')) return 'image';
      if (target.closest('button, .btn, .lamp')) return 'button';
      if (target.closest('a, [role="button"]')) return 'link';
      if (target.closest('#stage')) return 'stage';
      return 'default';
    };

    const applyState = (variant: CursorVariant, isPressed: boolean) => {
      ring.dataset.variant = variant;
      ring.dataset.pressed = isPressed ? '1' : '0';
      dot.dataset.variant = variant;
      dot.dataset.pressed = isPressed ? '1' : '0';

      if (variant === 'image') {
        label.textContent = 'View';
      } else if (variant === 'stage') {
        label.textContent = 'Drag';
      } else {
        label.textContent = '';
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        dotX = targetX;
        dotY = targetY;
        ringX = targetX;
        ringY = targetY;
        setVisibility(true);
      }
      const next = detectVariant(e.target);
      if (next !== currentVariant) {
        currentVariant = next;
        applyState(currentVariant, pressed);
      }
    };

    const onPointerDown = () => {
      pressed = true;
      applyState(currentVariant, true);
    };

    const onPointerUp = () => {
      pressed = false;
      applyState(currentVariant, false);
    };

    const onMouseLeave = () => {
      setVisibility(false);
    };

    const onMouseEnter = () => {
      if (targetX >= 0 && targetY >= 0) setVisibility(true);
    };

    const refreshVariantAtPointer = () => {
      if (targetX < 0 || targetY < 0) return;
      const el = document.elementFromPoint(targetX, targetY);
      const next = detectVariant(el);
      if (next !== currentVariant) {
        currentVariant = next;
        applyState(currentVariant, pressed);
      }
    };

    const observer = new MutationObserver(() => {
      requestAnimationFrame(refreshVariantAtPointer);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-lightbox'] });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const loop = () => {
      dotX += (targetX - dotX) * 0.48;
      dotY += (targetY - dotY) * 0.48;
      ringX += (targetX - ringX) * 0.17;
      ringY += (targetY - ringY) * 0.17;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      root.classList.remove('has-custom-cursor');
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" data-variant="default" data-pressed="0">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" data-variant="default" data-pressed="0" />
    </div>
  );
};
