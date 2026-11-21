// Mark where a link landed: blink the element 0.5s after the smooth scroll to it stops
// (scroll counts as stopped once it hasn't moved for 100ms). The .blink animation lives in global.css.
export const blinkWhenScrolled = (el: Element) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let lastY = scrollY;
  let stillSince = performance.now();
  const waitForStop = (now: number) => {
    if (scrollY !== lastY) {
      lastY = scrollY;
      stillSince = now;
    }
    if (now - stillSince < 100) {
      requestAnimationFrame(waitForStop);
      return;
    }
    setTimeout(() => {
      el.classList.remove('blink');
      void (el as HTMLElement).offsetWidth; // restart the animation when the same link is clicked again
      el.classList.add('blink');
    }, 400);
  };
  requestAnimationFrame(waitForStop);
};
