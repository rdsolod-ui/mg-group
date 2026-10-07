export type GeoPoint = { lat: number; lng: number };
// Approximate Osennyaya 23 address reference from Moscow's official register:
// https://www.mos.ru/upload/documents/files/9349/1_Prilojenie2_ReestrMNO.pdf
export const moscowHub: GeoPoint = { lat: 55.76648, lng: 37.40348 };
export const earthRadiusKm = 6371.0088;
const rad = Math.PI / 180;
export function distanceKm(a: GeoPoint, b: GeoPoint) {
  const dLat = (b.lat-a.lat)*rad, dLon = (b.lng-a.lng)*rad;
  const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLon/2)**2;
  return earthRadiusKm*2*Math.atan2(Math.sqrt(Math.min(1,h)),Math.sqrt(Math.max(0,1-h)));
}
export function globePoint(p: GeoPoint, r=1): [number,number,number] {
  return [r*Math.cos(p.lat*rad)*Math.cos(p.lng*rad), r*Math.sin(p.lat*rad), -r*Math.cos(p.lat*rad)*Math.sin(p.lng*rad)];
}
export function routePoint(a: GeoPoint,b: GeoPoint,t:number): [number,number,number] {
  const av=globePoint(a),bv=globePoint(b);
  const angle=Math.acos(Math.max(-1,Math.min(1,av.reduce((s,v,i)=>s+v*bv[i],0))));
  const sin=Math.sin(angle),wa=angle<1e-8?1-t:Math.sin((1-t)*angle)/sin,wb=angle<1e-8?t:Math.sin(t*angle)/sin;
  const height=1.009+Math.min(.24,angle*.22)*Math.sin(Math.PI*t);
  return av.map((v,i)=>(v*wa+bv[i]*wb)*height) as [number,number,number];
}
export const formatKm=(value:number)=>Math.round(value).toLocaleString('en-US').replaceAll(',',' ');
