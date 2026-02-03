import { Ref } from 'vue';

/**
 * Play enter animation on the element
 * @param elRef reference to the element
 * @param enterClass CSS class for the enter animation
 * @param leaveClass CSS class for the leave animation
 */
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


/**
 * Play leave animation on the element
 * @param elRef reference to the element
 * @param leaveClass CSS class for the leave animation
 * @param duration duration of the animation in milliseconds
 * @param done callback function to be called when the animation is finished
 */
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
