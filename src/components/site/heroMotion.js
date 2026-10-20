/* the hero load-in: the hello first, then the rest settles in while the rings open out from the middle.
   On the desk home it starts while the site is still on the monitor ("dk:screen") and follows the intro's
   speed when it is skipped ("dk:rate"); elsewhere it plays on load. Returns a cleanup. */

const EASE = 'cubic-bezier(.22,1,.36,1)';
const RISE = [{ opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }];
const STEPS = [
  ['hello', 0, 680, RISE],
  ['role', 200, 620, RISE],
  ['q', 380, 680, RISE],
  ['a', 600, 680, RISE],
  ['line', 1000, 680, RISE],
  ['cta', 1150, 680, RISE],
  ['next', 1650, 800, [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }]],
  ['orb', 120, 1900, [{ opacity: 0, transform: 'scale(.55)' }, { opacity: 1, transform: 'none' }], 160],
  ['dot', 1000, 800, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'none' }], 160]
];

export function initHeroMotion(page) {
  const hero = page.querySelector('.oh');
  if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  let anims = [], rate = 1;

  const build = () => {
    anims.forEach(a => a.cancel());
    anims = [];
    for (const [key, delay, duration, frames, stagger = 0] of STEPS)
      (key === 'next' ? page.querySelectorAll('#work') : hero.querySelectorAll('[data-in="' + key + '"]')).forEach((el, i) => {
        const a = el.animate(frames, { delay: delay + i * stagger, duration, easing: EASE, fill: 'backwards' });
        a.pause(); a.currentTime = 0; anims.push(a);
      });
    anims.forEach(a => a.finished.then(() => a.cancel(), () => {}));
  };
  const play = () => { anims.forEach(a => { a.playbackRate = rate; a.play(); }); };
  const restart = () => { rate = 1; build(); play(); };

  const desk = page.dataset.mode && page.dataset.mode !== 'site';
  build();
  if (!desk) play();

  const onScreen = () => { if (anims.length && anims.every(a => a.playState === 'paused')) play(); else restart(); };
  const onRate = e => { rate = e.detail; anims.forEach(a => { if (a.playState !== 'finished') a.updatePlaybackRate(rate); }); };
  const onBack = () => { rate = 1; build(); };
  page.addEventListener('dk:screen', onScreen);
  page.addEventListener('dk:rate', onRate);
  page.addEventListener('dk:back', onBack);

  return () => {
    page.removeEventListener('dk:screen', onScreen);
    page.removeEventListener('dk:rate', onRate);
    page.removeEventListener('dk:back', onBack);
    anims.forEach(a => a.cancel());
  };
}
