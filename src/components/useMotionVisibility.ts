'use client';
import { useEffect, useState, type RefObject } from 'react';

export default function useMotionVisibility(root: RefObject<HTMLDivElement | null>, present: boolean) {
  const [foreground, setForeground] = useState(false);
  useEffect(() => {
    const update = () => setForeground(document.visibilityState === 'visible');
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const chapters = root.current?.querySelectorAll<HTMLElement>('main > .chapter');
    if (!chapters) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting);
    }, { threshold: 0 });
    chapters.forEach(chapter => observer.observe(chapter));
    return () => observer.disconnect();
  }, [root, present]);
  return foreground;
}
