/* eslint-disable no-restricted-syntax */
import { useEffect, useRef } from 'react';

type Props = {
  timeoutSeconds: number;
  handler: () => void;
};

export default function UserInteractionTimeoutHandler({
  timeoutSeconds,
  handler,
}: Props) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const events = ['scroll', 'keydown', 'click', 'touchstart'];

    let timeoutHandle: any | undefined;

    const handleInteraction = () => {
      clearTimeout(timeoutHandle);
      timeoutHandle = setTimeout(
        () => handlerRef.current(),
        timeoutSeconds * 1000
      );
    };

    for (const event of events) {
      document.body.addEventListener(event, handleInteraction);
    }

    return () => {
      for (const event of events) {
        document.body.removeEventListener(event, handleInteraction);
      }
      clearTimeout(timeoutHandle);
    };
  }, [timeoutSeconds]);

  return null;
}
