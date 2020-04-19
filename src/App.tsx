import React from 'react';
import { useObservable } from 'rxjs-hooks';
import { of } from 'rxjs';
import './App.css';
import useCellSelectEventCallback from './hooks/useCellSelectEventCallback';
import useCellActiveEventCallback from './hooks/useCellActiveEventCallback';

const ROW_COUNT = 20,
  COLUMN_COUNT = 10;
const data = Array(ROW_COUNT)
  .fill('')
  .map(() => Array(COLUMN_COUNT).fill(''));

function App() {
  const [rowCount, columnCount] = useObservable(() => of([ROW_COUNT, COLUMN_COUNT]), [
    0,
    0,
  ]);

  const [handleMouseDown, [top, left, height, width]] = useCellSelectEventCallback();

  const [handleCellEvent, activeCellId] = useCellActiveEventCallback();

  const [, setState] = React.useState(0);

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

  return (
    <div className="App">
      <table
        id="main_table"
        className="main-table"
        cellSpacing={0}
        onDragStart={() => false}
        onMouseDown={handleMouseDown}
      >
        <tbody>
          {Array(rowCount)
            .fill(true)
            .map((n, rowIndex) => (
              <tr key={rowIndex}>
                {Array(columnCount)
                  .fill(true)
                  .map((m, columnIndex) => {
                    const id = `cell-${rowIndex}-${columnIndex}`;
                    const isActive = id === activeCellId;
                    return (
                      <td
                        key={columnIndex}
                        tabIndex={0}
                        onClick={() => handleCellEvent({ id, type: 'click' })}
                        onKeyDown={() => handleCellEvent({ id, type: 'keydown' })}
                      >
                        {!isActive && <span>{data[rowIndex][columnIndex]}</span>}
                        {isActive && (
                          <input
                            className="cell-input"
                            type="text"
                            onBlur={() => handleCellEvent({ id, type: 'blur' })}
                            defaultValue={data[rowIndex][columnIndex]}
                            onChange={(e) => {
                              data[rowIndex][columnIndex] = e.target.value;
                              setState(0);
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
              </tr>
            ))}
        </tbody>
      </table>
      <div
        id="selection"
        className="selection"
        style={{
          top: top + scrollTop - 2,
          left: left + scrollLeft - 2,
          height: height + 3,
          width: width + 3,
        }}
      ></div>
    </div>
  );
}

export default App;
