import { useEventCallback } from 'rxjs-hooks';
import {
  map,
  filter,
  startWith,
  takeUntil,
  distinctUntilChanged,
  scan,
  switchMap,
} from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';

function getPosition(el: HTMLElement) {
  return el.getBoundingClientRect();
}

function isPositionEqual(pos1: DOMRect, pos2: DOMRect) {
  return pos1.left === pos2.left && pos1.top === pos2.top;
}

export default function useCellSelectEventCallback() {
  return useEventCallback(
    (event$: Observable<React.SyntheticEvent<HTMLTableElement>>) =>
      event$.pipe(
        switchMap((e) =>
          fromEvent<WindowEventMap['mousemove']>(document, 'mousemove').pipe(
            filter(
              (e) =>
                (e && e.target && (e.target as HTMLElement).nodeName === 'TD') || false,
            ),
            startWith(e),
            takeUntil(fromEvent(document, 'mouseup')),
            map((e) => getPosition(e.target as HTMLElement)),
            distinctUntilChanged((p, q) => isPositionEqual(p, q)),
            scan((acc, pos) => {
              if (acc.length === 0) {
                return [pos, pos];
              } else {
                acc[1] = pos;
                return acc;
              }
            }, [] as DOMRect[]),
          ),
        ),
        map(([pos1, pos2]) => {
          const top = Math.min(pos1.top, pos2.top);
          const left = Math.min(pos1.left, pos2.left);
          const bottom = Math.max(pos1.bottom, pos2.bottom);
          const right = Math.max(pos1.right, pos2.right);
          return [top, left, bottom - top, right - left];
        }),
      ),
    [0, 0, 0, 0],
  );
}
