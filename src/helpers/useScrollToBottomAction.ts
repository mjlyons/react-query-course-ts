import * as React from "react";

export const useScrollToBottomAction = (
  container: { element: Element } | { document: Document },
  callback: () => void,
  offset: number = 0
) => {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!container) return;
    const handleScroll = () => {
      const scrollContainer: Element | null =
        "document" in container
          ? container.document.scrollingElement
          : container.element;
      if (!scrollContainer) {
        throw new Error("Scrolling container not found!");
      }
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - offset
      ) {
        callbackRef.current();
      }
    };
    ("document" in container
      ? container.document
      : container.element
    ).addEventListener("scroll", handleScroll);

    return () => {
      ("document" in container
        ? container.document
        : container.element
      ).removeEventListener("scroll", handleScroll);
    };
  }, [container, offset]);
};
