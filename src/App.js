import { useEffect, useRef, useState } from 'react';
import './App.css';
import Cell from './structs/Cell';
import { delay } from './util/delay';

const delayTime = 200;
const maxVisible = 10;

function App() {
  const inputPointer = useRef(0);
  const displayPointer = useRef(0);
  const isExecutingFunction = useRef(false);

  const [input, setInput] = useState([]);
  const [cells, setCells] = useState(createCells());
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    setCells(createCells());
    setResultText('');
  }, [input]);

  function copyArray(arr) {
    return arr.map(e => Object.assign({}, e));
  }

  function createInput(str) {
    const ret = [];
    for (let i = 0; i < str.length; i++) {
      ret.push({ value: str[i], read: false, skipped: false });
    }
    return ret;
  }

  function createCells() {
    const ret = [];

    for (let i = displayPointer.current; i < displayPointer.current + maxVisible; i++) {
      if (i < input.length) {
        ret.push(<Cell key={i} {...input[i]} />)
      } else {
        ret.push(<Cell key={i} empty={true} />)
      }
    }

    return ret;
  }

  function translateResult(result) {
    if (typeof result === 'undefined') {
      return 'NoSuchElementException';
    }

    if (result === '') {
      return '(empty string)';
    }

    return result;
  }

  /**
   * @param {React.MouseEvent<HTMLButtonElement,MouseEvent>} e 
   */
  function clickEnter(e) {
    const textarea = e.currentTarget.ownerDocument.querySelector('textarea');
    inputPointer.current = 0;
    displayPointer.current = 0;
    setInput(createInput(textarea.value));
  }

  async function readToken(data, pointer, consumeNewLine, predicate) {
    let ret = '';

    while (pointer < data.length && predicate(data[pointer].value)) {
      if (pointer === displayPointer.current + maxVisible) {
        displayPointer.current += maxVisible;
        setInput(copyArray(data));
        await delay(delayTime);
      }

      ret += data[pointer].value;

      data[pointer].read = true;
      setInput(copyArray(data));
      await delay(delayTime);

      pointer++;
    }

    if (consumeNewLine && pointer < data.length) {
      if (pointer === displayPointer.current + maxVisible) {
        displayPointer.current += maxVisible;
        setInput(copyArray(data));
        await delay(delayTime);
      }

      data[pointer].skipped = true;
      setInput(copyArray(data));
      await delay(delayTime);

      pointer++;
    }

    inputPointer.current = pointer;
    return ret === '' ? undefined : ret;
  }

  async function next(data, pointer) {
    function isWhitespace(e) {
      return e === ' ' || e === '\n';
    }

    while (pointer < data.length && isWhitespace(data[pointer].value)) {
      if (pointer === displayPointer.current + maxVisible) {
        displayPointer.current += maxVisible;
        setInput(copyArray(data));
        await delay(delayTime);
      }

      data[pointer].skipped = true;
      setInput(copyArray(data));
      await delay(delayTime);

      pointer++;
    }

    return await readToken(data, pointer, false, (e) => !isWhitespace(e));
  }

  async function executeNext() {
    if (!isExecutingFunction.current) {
      isExecutingFunction.current = true;
      const res = await next(copyArray(input), inputPointer.current);
      setResultText(translateResult(res));
      isExecutingFunction.current = false;
    }
  }

  async function nextLine(data, pointer) {
    return await readToken(data, pointer, true, (e) => e !== '\n');
  }

  async function executeNextLine() {
    if (!isExecutingFunction.current) {
      isExecutingFunction.current = true;
      const res = await nextLine(copyArray(input), inputPointer.current);
      setResultText(translateResult(res));
      isExecutingFunction.current = false;
    }
  }

  return (
    <div className="App">
      <textarea className="input-area" placeholder="Type here to test input"></textarea>
      <button className="enter" onClick={clickEnter}>Enter</button>
      <br />
      <div className="row" style={{ width: 900 }}>
        {cells}
      </div>
      <button className="next" onClick={executeNext}>Next</button>
      <button className="nextline" onClick={executeNextLine}>NextLine</button>
      <br />
      <div className="results">
        <span className="result-title">Result: </span>
        <span className="result">{resultText}</span>
      </div>
      <br />
      <ul className="color-key">
        <li className="color-empty">This color means the cell is empty</li>
        <li className="color-read">This color means the cell has been read</li>
        <li className="color-unread">This color means the cell has not been read</li>
        <li className="color-skipped">This color means the cell was skipped</li>
      </ul>
      <br />
      <div className="info">
        Made by <a href="https://github.com/minidomo">JB Ladera</a> with ♥
      </div>
    </div>
  );
}

export default App;
