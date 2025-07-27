import { useEffect, useRef } from "react";

/**
 * Hook that returns two refs and triggers a callback when a user clicks
 * outside the `targetRef` but inside the `containerRef` (if defined).
 *
 * `containerRef` is optional and defaults to the entire document. If provided,
 * the click must occur inside the container but outside the target to trigger the callback.
 *
 * @param {(e: MouseEvent) => void} onClickOutside - Function to call when click occurs outside target.
 * @returns {{ targetRef: React.RefObject<HTMLElement>, containerRef: React.RefObject<HTMLElement> }}
 *
 * @example
 * const { targetRef, containerRef } = useClickedOutside(() => closeMenu());
 * return (
 *   <div ref={containerRef}>
 *     <div ref={targetRef}>This is your dropdown</div>
 *   </div>
 * )
 */
export function useClickedOutside(onClickOutside) {
  const targetRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      const targetEl = targetRef.current;
      const containerEl = containerRef.current || document;

      if (!targetEl) {
        throw new Error("useClickedOutside: targetRef must be set to a valid DOM element");
      }

      const clickedInsideTarget = targetEl.contains(event.target);
      const clickedInsideContainer = containerEl.contains(event.target);

      if (!clickedInsideTarget && clickedInsideContainer) {
        onClickOutside(event);
      }
    }

    const containerEl = containerRef.current || document;
    containerEl.addEventListener("mousedown", handleClick);

    return () => containerEl.removeEventListener("mousedown", handleClick);
  }, [onClickOutside]);

  return { targetRef, containerRef };
}
