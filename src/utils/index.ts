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
