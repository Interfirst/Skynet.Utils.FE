/* eslint-disable no-redeclare */
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * @desc useState alternative when we planned to use setState after async actions/calls
 */
export function useAsyncState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
export function useAsyncState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
];
export function useAsyncState(initialState?: any) {
  type State = typeof initialState;

  const [state, setState] = useState(initialState);

  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const enhancedSetState = useCallback((newState: State) => {
    if (!isMountedRef.current) {
      return;
    }

    setState(newState);
  }, []);

  return useMemo(() => [state, enhancedSetState] as const, [enhancedSetState, state]);
}
