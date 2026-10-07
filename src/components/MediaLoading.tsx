"use client";
import { useEffect, useState } from 'react';
export default function MediaLoading({ ar = 'جارٍ تحميل الصورة', en = 'Loading image', progress, onCancel }: { ar?: string; en?: string; progress?: number; onCancel?: () => void }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setSlow(true), 10000); return () => clearTimeout(timer); }, []);
  return <span className="media-loading" role="status" aria-live="polite">
    <svg className="loading-mark" viewBox="0 0 48 32" fill="none" aria-hidden="true"><path d="M3 28V4L16 19L29 4V28M45 9A12 12 0 1 0 45 24V18H36" /></svg>
    <span lang="ar" dir="rtl">{slow ? 'التحميل يستغرق وقتاً أطول' : ar}<small lang="en" dir="ltr">{slow ? 'Still loading — your content stays available' : en}</small></span>
    {progress != null && <><progress max={100} value={progress} aria-label="Download progress"/><small dir="ltr">{Math.floor(progress)}%</small></>}
    {onCancel && <button type="button" onClick={onCancel}>إلغاء / Cancel</button>}
  </span>;
}
