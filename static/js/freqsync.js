'use strict';

// Native video controls keep this page usable without JavaScript.
// Stop offscreen playback so a long demo page does not keep decoding hidden clips.
const visibility = new IntersectionObserver(entries => {
  entries.forEach(entry => {if (!entry.isIntersecting) entry.target.pause();});
}, {threshold:0});
document.querySelectorAll('video').forEach(video => visibility.observe(video));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) document.querySelectorAll('video').forEach(video => video.pause());
});

let copyResetTimer;
document.querySelector('#copy-citation').addEventListener('click', async () => {
  const text = document.querySelector('#citation-text').textContent;
  const status = document.querySelector('#copy-status');
  const button = document.querySelector('#copy-citation');
  const label = button.querySelector('.copy-text');
  clearTimeout(copyResetTimer);
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(area); area.select();
      const copied = document.execCommand('copy'); area.remove();
      if (!copied) throw new Error('Clipboard unavailable');
    }
    status.textContent = 'Copied!';
    button.classList.add('copied');
    label.textContent = 'Copied!';
    copyResetTimer = setTimeout(() => {
      button.classList.remove('copied');
      label.textContent = 'Copy';
      status.textContent = '';
    }, 2000);
  } catch {
    button.classList.remove('copied');
    label.textContent = 'Copy';
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#citation-text'));
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'Selected. Press Ctrl/Cmd+C.';
  }
});
