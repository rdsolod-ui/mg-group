"use client";
import { useSyncExternalStore } from 'react';
type Connection = EventTarget & { saveData?: boolean; effectiveType?: string; downlink?: number };
let mode = 'auto';
const listeners = new Set<() => void>();
const connection = () => (navigator as Navigator & { connection?: Connection }).connection;
const notify = () => listeners.forEach(listener => listener());
function snapshot() {
  const c = connection();
  const slow = c?.saveData || /^(slow-2g|2g|3g)$/.test(c?.effectiveType || '') || (c?.downlink != null && c.downlink < 1.6);
  return `${mode}|${mode === 'economy' || slow ? 1 : 0}|${navigator.onLine ? 1 : 0}`;
}
function subscribe(listener: () => void) {
  if (!listeners.size) {
    try { mode = localStorage.getItem('mg-data-mode') === 'economy' ? 'economy' : 'auto'; } catch { /* Storage is optional. */ }
    window.addEventListener('online', notify); window.addEventListener('offline', notify);
    connection()?.addEventListener('change', notify);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.removeEventListener('online', notify); window.removeEventListener('offline', notify);
      connection()?.removeEventListener('change', notify);
    }
  };
}
export function useNetwork() {
  const value = useSyncExternalStore(subscribe, snapshot, () => 'auto|0|1');
  const [preference, economy, online] = value.split('|');
  return { preference, economy: economy === '1', online: online === '1' };
}
export default function NetworkPreferences() {
  const network = useNetwork();
  return <div className="network-preferences" data-media-controls>
    <label htmlFor="mg-data-mode"><span lang="ar" dir="rtl">استخدام البيانات</span><span lang="en">Data usage</span></label>
    <select id="mg-data-mode" value={network.preference} onChange={event => {
      mode = event.target.value;
      try { localStorage.setItem('mg-data-mode', mode); } catch { /* Still works for this visit. */ }
      notify();
    }}><option value="auto">تلقائي / Auto</option><option value="economy">توفير البيانات / Save data</option></select>
    <p lang="ar" dir="rtl">{!network.online ? 'لا يوجد اتصال. المحتوى المحمّل متاح.' : network.economy ? 'صور خفيفة وفيديو بجودة اقتصادية.' : 'تتكيف جودة الوسائط مع الاتصال.'}<span lang="en" dir="ltr">{!network.online ? 'Offline. Loaded content remains available.' : network.economy ? 'Lighter images and economy video.' : 'Media quality adapts to your connection.'}</span></p>
  </div>;
}
