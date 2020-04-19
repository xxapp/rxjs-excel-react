import { useEventCallback } from 'rxjs-hooks';
import { filter, bufferCount, map, mergeAll } from 'rxjs/operators';
import { Observable, scheduled, asapScheduler } from 'rxjs';

export default function useCellActiveEventCallback() {
  return useEventCallback(
    (
      events$: Observable<{
        id: string;
        type: 'click' | 'keydown' | 'blur';
      }>,
    ) => {
      const doubleClick$ = events$.pipe(
        filter(({ type }) => type === 'click'),
        map(({ id }) => id),
        bufferCount(2, 1),
      );

      const keyDown$ = events$.pipe(
        filter(({ type }) => type === 'keydown'),
        map(({ id }) => [id, id]),
      );

      return scheduled([doubleClick$, keyDown$], asapScheduler)
        .pipe(mergeAll())
        .pipe(map(([prevId, id]) => (prevId === id ? id : null)));
    },
    null,
  );
}
