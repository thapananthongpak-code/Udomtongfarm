import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

/**
 * Asks before a form with changes that are not saved is left: by a link, the back button,
 * or closing the tab. `allowLeave` is called just before leaving on purpose, once the changes are saved.
 */
export function useUnsavedChanges(dirty: boolean, message: string) {
  const allowed = useRef(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty &&
      !allowed.current &&
      currentLocation.pathname + currentLocation.search !== nextLocation.pathname + nextLocation.search,
  );

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (window.confirm(message)) blocker.proceed();
    else blocker.reset();
  }, [blocker, message]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (allowed.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return {
    allowLeave: () => {
      allowed.current = true;
    },
  };
}
