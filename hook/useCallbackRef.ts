/**
 * useCallbackRef
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/use-callback-ref/src/index.ts
 */
import { useCallback, useEffect, useRef } from "preact/hooks";

// deno-lint-ignore no-explicit-any
export function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined,
  deps: ReadonlyArray<unknown> = [],
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => callbackRef.current?.(...args)) as T, deps);
}
