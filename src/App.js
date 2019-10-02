import React from 'react';
import { Helmet } from 'react-helmet';
import './App.css';

const LENGTH = () => {
  return Math.floor(9 / 958 * window.innerWidth);
};

const EMPTY = ' ';
const EMPTY_STRING = '(empty string)';
const NO_SUCH_ELEMENT_EXCEPTION = 'NoSuchElementException';
const NO_INPUT = 'Enter input first';

const isWhiteSpace = (char) => {
  return char === ' ' || char === '\n';
};

const isNewLine = (char) => {
  return char === '\n';
};

const pause = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

class CellObj {
  constructor(obj = {}) {
    this.read = obj.read || false;
    this.skipped = obj.skipped || false;
    if (obj.value && !obj.empty) {
      this.value = obj.value;
      this.empty = false;
    } else {
      this.value = EMPTY;
      this.empty = true;
    }
  }

  getColors() {
    const obj = {};
    if (this.skipped) {
      obj.backgroundColor = '#F7AEF8';
    } else if (this.read) {
      obj.backgroundColor = '#8093F1';
    } else if (this.empty) {
      obj.backgroundColor = '#4D5061';
    } else {
      obj.backgroundColor = '#677DB7';
    }
    return obj;
  }

  toString() {
    return 'CellObj { ' + this.value + ', ' + this.empty + ', ' + this.read + ' }';
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: {
        value: '',
        pointer: 0
      },
      result: '',
      currentTextArea: '',
      inProgess: false,
      displayRow: Array(LENGTH()).fill(new CellObj()),
      toString() {
        return JSON.stringify(this, null, 4);
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSendInput = this.handleSendInput.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.doNext = this.doNext.bind(this);
    this.doNextLine = this.doNextLine.bind(this);
    this.resize = this.resize.bind(this);
    this.renderRow = this.renderRow.bind(this);

    window.addEventListener('resize', this.resize);
  }

  handleChange(event) {
    this.setState({ currentTextArea: event.target.value });
  }

  handleSendInput(event) {
    const value = this.state.currentTextArea;
    this.setState({
      input: {
        value: value,
        pointer: 0
      }
    }, () => {
      const { value } = this.state.input;
      const cells = this.state.displayRow.slice();
      for (let x = 0; x < cells.length; x++) {
        cells[x] = new CellObj({ value: value[x] });
      }
      this.setState({
        displayRow: cells
      });
    });
  }

  updateDisplay(cb, event, previous, start) {
    const { pointer, value } = this.state.input;
    const cells = this.state.displayRow.slice();
    for (let x = pointer; x < pointer + cells.length; x++) {
      const obj = {};
      if (value[x])
        obj.value = value[x];
      else
        obj.empty = true;
      cells[x - pointer] = new CellObj(obj);
    }
    this.setState({
      displayRow: cells
    }, () => {
      cb(event, previous, start);
    });
  }

  doNext(event, previous, start) {
    if (!this.state.input.value) {
      this.setState({
        result: NO_INPUT
      });
      return;
    }
    if (!previous && !start) {
      if (this.state.inProgess) {
        return;
      } else {
        this.setState({
          inProgess: true,
          result: ''
        }, () => {
          this.doNext(event, previous, true);
        });
        return;
      }
    }

    const { result } = this.state;
    const { value, pointer } = this.state.input;
    if (pointer >= value.length) {
      this.setState({
        inProgess: false,
        result: result || NO_SUCH_ELEMENT_EXCEPTION
      });
      return;
    }

    const cells = this.state.displayRow.slice();
    const index = pointer % cells.length;
    const current = new CellObj(cells[index]);

    if (current.read || current.skipped) {
      this.updateDisplay(this.doNext, event, previous, start);
      return;
    }

    if (!previous) { // first call to next
      if (isWhiteSpace(current.value)) {
        current.skipped = true;
      } else {
        current.read = true;
      }
    } else {
      if (isWhiteSpace(current.value)) {
        if (isWhiteSpace(previous)) {
          current.skipped = true;
        } else {
          this.setState({
            inProgess: false,
            result: result || NO_SUCH_ELEMENT_EXCEPTION
          });
          return;
        }
      } else {
        current.read = true;
      }
    }
    cells[index] = current;

    this.setState({
      input: {
        value: value,
        pointer: pointer + 1
      },
      displayRow: cells,
      result: current.read ? result + current.value : result
    }, async () => {
      await pause(200);
      this.doNext(event, current.value);
    });
  }

  doNextLine(event, previous, start) {
    if (!this.state.input.value) {
      this.setState({
        result: NO_INPUT
      });
      return;
    }
    if (!previous && !start) {
      if (this.state.inProgess) {
        return;
      } else {
        this.setState({
          inProgess: true,
          result: ''
        }, () => {
          this.doNextLine(event, previous, true);
        });
        return;
      }
    }

    const { result } = this.state;
    const { value, pointer } = this.state.input;
    if (pointer >= value.length) {
      this.setState({
        inProgess: false,
        result: result || (pointer === value.length ? EMPTY_STRING : NO_SUCH_ELEMENT_EXCEPTION),
        input: {
          value: value,
          pointer: pointer + 1
        }
      });
      return;
    }

    const cells = this.state.displayRow.slice();
    const index = pointer % cells.length;
    const current = new CellObj(cells[index]);

    if (current.read || current.skipped) {
      this.updateDisplay(this.doNextLine, event, previous, start);
      return;
    }

    if (isNewLine(previous)) {
      this.setState({
        inProgess: false,
        result: result || EMPTY_STRING
      });
      return;
    } else if (isNewLine(current.value)) {
      current.skipped = true;
    } else {
      current.read = true;
    }
    cells[index] = current;

    this.setState({
      input: {
        value: value,
        pointer: pointer + 1
      },
      displayRow: cells,
      result: current.read ? result + current.value : result
    }, async () => {
      await pause(200);
      this.doNextLine(event, current.value);
    });
  }

  resize() {
    const { value, pointer } = this.state.input;
    const cells = this.state.displayRow.slice();
    const newCells = [];
    if (LENGTH() < cells.length) {
      for (let x = 0; x < LENGTH(); x++)
        newCells.push(new CellObj(cells[x]));
    } else {
      // alert(`${pointer} ${cells.length} ${pointer % cells.length}`);
      // let min;
      // if (pointer > cells.length)
      //   min = cells.length;

      for (let x = 0; x < pointer % cells.length; x++)
        newCells.push(new CellObj(cells[x]));
      for (let x = pointer; newCells.length < LENGTH(); x++)
        newCells.push(new CellObj({ value: value[x] }));
    }
    this.setState({
      displayRow: newCells
    });
  }

  renderRow() {
    const row = this.state.displayRow.map(obj => {
      const { value } = obj;
      const shown = value === '\n' ? '\\n' : value;
      const colors = obj.getColors();
      return <Cell value={shown} backgroundColor={colors.backgroundColor} />;
    });
    return row;
  }

  render() {
    const columnWidth = 82;
    const width = `${LENGTH() * columnWidth}px`;
    const row = this.renderRow();
    return (
      <div className="app">
        <Helmet>
          <title>{'Scanner Simulator'}</title>
        </Helmet>
        <textarea className="input-area" placeholder="Type here to test input" onChange={this.handleChange} value={this.state.currentTextArea}></textarea>
        <button className="enter" onClick={this.handleSendInput}>Enter</button>
        <br />
        <div className="row" style={{ width: width }}>
          {row}
        </div>
        <button className="next" onClick={this.doNext}>Next</button>
        <button className="nextline" onClick={this.doNextLine}>NextLine</button>
        <br />
        <div className="results">
          <span className="result-title">Result: </span>
          <span className="result">{this.state.result}</span>
        </div>
        <br />
        <ul className="color-key">
          <li className="color-empty">This color means the cell is empty</li>
          <li className="color-read">This color means the cell has been read</li>
          <li className="color-unread">This color means the cell has not been read</li>
          <li className="color-skipped">This color means the cell was skipped</li>
        </ul>
      </div>
    );
  }

  toString() {
    const ret = JSON.stringify(this.state, null, 4);
    return ret;
  }
}

class Cell extends React.Component {
  render() {
    return (
      <div className="col">
        <div className="cell" style={{ backgroundColor: this.props.backgroundColor }}>
          {this.props.value}
        </div>
      </div>
    );
  }
}

export default App;