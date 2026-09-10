'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseHorizontalScrollerOptions = {
  /** Recalculate active card when this value changes (e.g. products length). */
  deps?: unknown;
  /** Fraction of viewport width to scroll when not using card-width mode. */
  scrollFactor?: number;
  /** Max px for factor-based scroll. */
  maxScrollAmount?: number;
  /** Prefer scrolling by first child width + gap. */
  scrollByCardWidth?: boolean;
  gapPx?: number;
  trackActive?: boolean;
};

export function useHorizontalScroller({
  deps,
  scrollFactor = 0.85,
  maxScrollAmount = 340,
  scrollByCardWidth = false,
  gapPx = 16,
  trackActive = false,
}: UseHorizontalScrollerOptions = {}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!trackActive) return;

    const node = scrollerRef.current;
    if (!node) return;

    const update = () => {
      const cards = Array.from(node.children) as HTMLElement[];
      if (!cards.length) return;

      const center = node.scrollLeft + node.clientWidth / 2;
      let nearest = 0;
      let best = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const mid = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(mid - center);
        if (distance < best) {
          best = distance;
          nearest = index;
        }
      });

      setActiveIndex(nearest);
    };

    update();
    node.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      node.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [deps, trackActive]);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const node = scrollerRef.current;
      if (!node) return;

      if (scrollByCardWidth) {
        const card = node.children[0] as HTMLElement | undefined;
        const amount = card ? card.offsetWidth + gapPx : 280;
        node.scrollBy({ left: amount * direction, behavior: 'smooth' });
        return;
      }

      const amount = Math.min(node.clientWidth * scrollFactor, maxScrollAmount);
      node.scrollBy({ left: amount * direction, behavior: 'smooth' });
    },
    [gapPx, maxScrollAmount, scrollByCardWidth, scrollFactor],
  );

  return { scrollerRef, activeIndex, scrollByCard };
}
