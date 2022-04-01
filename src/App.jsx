import React, { useState, useEffect } from 'react'
import clsx from 'clsx';
import './App.css'

function App() {
  const [time, setTime] = useState(1800);
  const [paused, setPaused] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showCursor, setShowCursor] = useState(false);

  const pad = (n) => (Math.abs(n) < 10)? `0${Math.abs(n)}` : Math.abs(n);

  const second = parseInt(time % 60);
  const minute = parseInt((time - second) / 60);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    }
  },[]);

  const tick = () => {
    if (!editing) {
      setShowCursor(showCursor => !showCursor);
    }

    if (paused) return;

    setTime(time => time - 1);
  }

  const resetTimer = () => {
    setTime(1800);
    setPaused(true);
  }  

  const pauseTimer = () => {
    setPaused(paused => !paused);
    setEditing(false);
  } 

  const toggleEditing = () => {
    setEditing(editing => editing ? null : 'second');
  }  

  const handleCursorMove = (direction) => {
    setPaused(true);
    switch (direction) {
      case 'up':
      case 'down':
        if (!editing) {
          setEditing('second');
        }
        console.log(direction + " " + editing);
        setTime(time => time + (direction === 'up' ? 1 : -1) * (editing === 'second' ? 1 : 60));
        break;
      case 'left':
        setEditing('minute');
        break;
      case 'right':
        setEditing('second');
        break;
      default:
        break;
    }
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'F':
      case 'f':
        //toggleFullScreen();
        break;
      case 'R':
      case 'r':
        resetTimer();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        handleCursorMove(event.key.toLowerCase().replace('arrow', ''))
        break;
      case 'Enter':
        toggleEditing();
        break;
      case ' ':
        pauseTimer();
        break;
      default:
        break;
    }
  } 

  return (
    <div className="App">
 <div
          className={clsx('clock', { 'show-cursor': showCursor })}
          onDoubleClick={() => resetTimer}
        >
          <span className={clsx('time minute', { editing: editing === 'minute' })}>{pad(minute)}</span>
          :
          <span className={clsx('time second', { editing: editing === 'second' })}>{pad(second)}</span>
        </div>
        <ul className="tips">
          <li>
            <button onClick={resetTimer}>F</button>
            -
            <span className="tip">{fullscreen ? 'exit': 'enter'} fullscreen</span>
          </li>
          <li>
            <button onClick={() => handleCursorMove('left')}>←</button>
            <button onClick={() => handleCursorMove('right')}>→</button>
            <button onClick={() => handleCursorMove('up')}>↑</button>
            <button onClick={() => handleCursorMove('down')}>↓</button>
            -
            <span className="tip">edit timer</span>
          </li>
          <li>
            <button onClick={resetTimer}>R</button>
            -
            <span className="tip">reset timer</span>
          </li>
          <li>
            <button onClick={pauseTimer}>Space</button>
            -
            <span className="tip">{paused ? 'start' : 'pause'} timer</span>
          </li>
        </ul>
    </div>
  )
}

export default App
