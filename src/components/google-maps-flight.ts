// Browser key must be restricted to this site's referrers and the Maps JavaScript API.
// It is injected at build time, never stored in source control.
export const mapsConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
export type Camera = { center: { lat: number; lng: number; altitude: number }; range: number; tilt: number; heading: number; altitudeMode?: string };
export type MapElement = HTMLElement & Camera & {
  flyCameraTo(options: { endCamera: Camera; durationMillis: number }): void;
  stopCameraAnimation(): void;
};
type MapsLibrary = { Map3DElement: new (options: Camera & { mode: string; gestureHandling: string; defaultUIHidden: boolean }) => MapElement };
type MapsWindow = Window & { google?: { maps: { importLibrary(name: string): Promise<MapsLibrary> } }; __mgMapsReady?: () => void };
let loading: Promise<MapsLibrary> | undefined;
export function loadGoogleMaps(): Promise<MapsLibrary> {
  if (loading) return loading;
  const w = window as MapsWindow;
  if (w.google?.maps.importLibrary) return w.google.maps.importLibrary('maps3d');
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return Promise.reject(new Error('Google Maps is not configured'));
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    const fail = () => { clearTimeout(timeout); delete w.__mgMapsReady; script.remove(); reject(new Error('Google Maps did not load')); };
    const timeout = setTimeout(fail, 15000);
    w.__mgMapsReady = () => { clearTimeout(timeout); delete w.__mgMapsReady; resolve(); };
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&libraries=maps3d&loading=async&language=en&callback=__mgMapsReady`;
    script.onerror = fail;
    document.head.append(script);
  }).then(() => {
    if (!w.google?.maps.importLibrary) throw new Error('Google Maps unavailable');
    return w.google.maps.importLibrary('maps3d');
  }).catch(error => { loading = undefined; throw error; });
  return loading;
}
