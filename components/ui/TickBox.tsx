"use client";

import { useEffect, useRef, type ChangeEvent, type ComponentPropsWithRef } from "react";

/**
 * A controlled tick box that can't look ticked without counting. A click
 * that lands before the page has started up (hydrated) flips the box in the
 * browser, but React starts with its own value and may never hear of it.
 * Once started, this waits a moment (React may replay the click itself), then
 * compares the box with React's latest value and, only if they still
 * differ, reports the change through onChange, so the early click counts.
 * Use it for every checkbox whose ticked state is held in React state.
 */
export function TickBox({ ref, ...props }: Omit<ComponentPropsWithRef<"input">, "type">) {
  const own = useRef<HTMLInputElement | null>(null);
  // The latest checked and onChange, read after the wait.
  const latest = useRef(props);
  useEffect(() => {
    latest.current = props;
  });

  useEffect(() => {
    const id = setTimeout(() => {
      const el = own.current;
      const { checked, onChange } = latest.current;
      if (el && checked !== undefined && el.checked !== checked) onChange?.({ target: el, currentTarget: el } as ChangeEvent<HTMLInputElement>);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const setRef = (el: HTMLInputElement | null) => {
    own.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };
  return <input ref={setRef} type="checkbox" {...props} />;
}
