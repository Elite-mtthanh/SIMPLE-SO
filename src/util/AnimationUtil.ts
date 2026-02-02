import { Ref } from 'vue';

export function playEnter(
  elRef: Ref<HTMLElement | null>,
  enterClass = 'anim-enter',
  leaveClass = 'anim-leave'
) {
  const el = elRef.value;
  if (!el) return;
  el.classList.remove(enterClass, leaveClass);

  void el.offsetHeight;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add(enterClass);
    });
  });
}

export function playLeave(
  elRef: Ref<HTMLElement | null>,
  leaveClass = 'anim-leave',
  duration = 250,
  done?: () => void
) {
  const el = elRef.value;
  if (!el) {
    done?.();
    return;
  }

  el.classList.remove('anim-enter');
  el.classList.add(leaveClass);

  setTimeout(() => {
    done?.();
  }, duration);
}
