import { useEffect, useState } from 'react';
import './App.css';
import Cell from './structs/Cell';

function App() {
  const [input, setInput] = useState('');
  const [inputPointer, setInputPointer] = useState(0);
  const [displayPointer, setDisplayPointer] = useState(0);
  const [cells, setCells] = useState(createCells());



  useEffect(() => {
    setInputPointer(0);
    setDisplayPointer(0);
    setCells(createCells());
  }, [input]);

  function createCells() {
    const maxVisible = 10;
    const ret = [];

    for (let i = displayPointer; i < displayPointer + maxVisible; i++) {
      if (i < input.length) {
        ret.push(<Cell key={i} value={input[i]} />)
      } else {
        ret.push(<Cell key={i} empty={true} />)
      }
    }

    return ret;
  }

  /**
   * @param {React.MouseEvent<HTMLButtonElement,MouseEvent>} e 
   */
  function clickEnter(e) {
    const textarea = e.currentTarget.ownerDocument.querySelector('textarea');
    setInput(textarea.value);
  }

  /**
   * @param {React.MouseEvent<HTMLButtonElement,MouseEvent>} e 
   */
  function clickNext(e) {

  }

  /**
   * @param {React.MouseEvent<HTMLButtonElement,MouseEvent>} e 
   */
  function clickNextLine(e) {

  }

  return (
    <div className="App">
      <textarea className="input-area" placeholder="Type here to test input"></textarea>
      <button className="enter" onClick={clickEnter}>Enter</button>
      <br />
      <div className="row" style={{ width: 900 }}>
        {cells}
      </div>
      <button className="next" onClick={clickNext}>Next</button>
      <button className="nextline" onClick={clickNextLine}>NextLine</button>
      <br />
      <div className="results">
        <span className="result-title">Result: </span>
        <span className="result">{ }</span>
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
