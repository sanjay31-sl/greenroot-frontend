import { useCallback } from 'react';

let toastEl = null;
let toastTimer = null;

export function useToast() {
  const toast = useCallback((msg, type = 'ok') => {
    if (!toastEl) toastEl = document.getElementById('toast');
    if (!toastEl) return;
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.className = `toast show ${type}`;
    toastTimer = setTimeout(() => { if (toastEl) toastEl.className = 'toast'; }, 2800);
  }, []);
  return toast;
}
