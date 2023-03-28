import { RefObject, useEffect, useRef, useState } from 'react';

export const useVisibility = (
  ref: RefObject<HTMLDivElement>,
  options: { rootMargin: string } = { rootMargin: '0px' },
  { once = true, isDeferred = false }: { once: boolean; isDeferred: boolean },
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isTimeoutEnded, setIsTimeoutEnd] = useState(!isDeferred);
  const observerRef = useRef<IntersectionObserver>();
  const timerRef = useRef<number>();

  // TODO: IntersectionObserver and dnd are not correctly work with chrome, using setTimeout is resolve that
  if (isDeferred) {
    timerRef.current = window.setTimeout(() => {
      setIsTimeoutEnd(true);
    }, 0);
  }

  useEffect(() => {
    if (!isTimeoutEnded) {
      return;
    }

    observerRef.current = new window.IntersectionObserver(([entry]) => {
      if (isIntersecting !== entry.isIntersecting) {
        setIsIntersecting(entry.isIntersecting);
      }

      if (entry.target && entry.isIntersecting && once) {
        observerRef?.current?.unobserve(entry.target);
      }
    }, options);

    const nodeRef = ref.current;

    if (nodeRef) {
      observerRef.current.observe(nodeRef);

      return () => {
        observerRef?.current?.unobserve(nodeRef);
        clearTimeout(timerRef.current);
      };
    }

    return;
  }, [ref, options, once, isTimeoutEnded, isIntersecting]);

  return isIntersecting;
};
