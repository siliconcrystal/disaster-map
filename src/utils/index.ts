/**
 * Reverse geocode coordinates to a human-readable address via Nominatim.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh-TW`,
    { headers: { 'Accept-Language': 'zh-TW,zh;q=0.9' } },
  );
  const data = await res.json();
  if (data?.address) {
    const a = data.address;
    const parts = [
      a.state || a.county,
      a.city || a.town || a.village,
      a.suburb || a.neighbourhood,
      a.road || a.pedestrian,
      a.house_number,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join('') : data.display_name || '';
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function throttle(
  func: (...args: any[]) => void,
  limit: number = 400,
  options: { leading?: boolean; trailing?: boolean } = {
    leading: true,
    trailing: true,
  },
) {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: any[];
  let lastThis: any;

  const { leading = true, trailing = false } = options;

  return function (this: any, ...args: any[]) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);
    lastArgs = args;
    lastThis = this;

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      if (leading) func.apply(lastThis, lastArgs);
    } else if (trailing && !timeout) {
      timeout = setTimeout(() => {
        lastCall = leading ? Date.now() : 0;
        timeout = null;
        func.apply(lastThis, lastArgs);
      }, remaining);
    }
  };
}
