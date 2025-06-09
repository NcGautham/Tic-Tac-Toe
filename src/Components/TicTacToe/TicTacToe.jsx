import React, { useState, useEffect, useCallback } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/O.png';
import cross_icon from '../Assets/X.png';

// Sound effects
const moveSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
const drawSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3');

// Configure sounds
[moveSound, winSound, drawSound].forEach(sound => {
    sound.volume = 0.5; // Set volume to 50%
});

export const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(''));
    const [count, setCount] = useState(0);
    const [lock, setLock] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [winningLine, setWinningLine] = useState([]);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    });
    const [showWinOverlay, setShowWinOverlay] = useState(false);
    const [showDrawOverlay, setShowDrawOverlay] = useState(false);
    const [winner, setWinner] = useState('');
    const [isMuted, setIsMuted] = useState(() => {
        const savedMute = localStorage.getItem('muted');
        return savedMute === 'true';
    });

    // Apply theme and mute state on mount and when they change
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('muted', isMuted);
        [moveSound, winSound, drawSound].forEach(sound => {
            sound.muted = isMuted;
        });
    }, [isMuted]);

    // Haptic feedback function
    const vibrate = useCallback(() => {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
        vibrate();
    };

    const toggleSound = () => {
        setIsMuted(prev => !prev);
        vibrate();
    };

    const playSound = useCallback((sound) => {
        if (!isMuted) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }, [isMuted]);

    useEffect(() => {
        checkWin(board);
    }, [board]);

    const toggle = (index) => {
        if (lock || board[index]) return;

        vibrate();
        playSound(moveSound);

        const newBoard = [...board];
        if (count % 2 === 0) {
            newBoard[index] = 'x';
        } else {
            newBoard[index] = 'o';
        }

        setBoard(newBoard);
        setCount(count + 1);
    };

    const checkWin = (currentBoard) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                setLock(true);
                setWinner(currentBoard[a].toUpperCase());
                setAlertMessage(`${currentBoard[a].toUpperCase()} wins!`);
                setShowAlert(true);
                setWinningLine(combination);
                setShowWinOverlay(true);
                vibrate();
                playSound(winSound);
                return;
            }
        }

        if (currentBoard.every((box) => box)) {
            setLock(true);
            setAlertMessage("It's a draw!");
            setShowAlert(true);
            setShowDrawOverlay(true);
            playSound(drawSound);
        }
    };

    const resetGame = () => {
        vibrate();
        setBoard(Array(9).fill(''));
        setCount(0);
        setLock(false);
        setShowAlert(false);
        setAlertMessage('');
        setWinningLine([]);
        setShowWinOverlay(false);
        setShowDrawOverlay(false);
        setWinner('');
    };

    const closeAlert = () => {
        vibrate();
        setShowAlert(false);
    };

    const isWinningBox = (index) => winningLine.includes(index);

    return (
        <div className="container">
            <button 
                className="theme-toggle" 
                onClick={toggleTheme} 
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            />
            <button 
                className={`sound-toggle ${isMuted ? 'muted' : ''}`}
                onClick={toggleSound}
                aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            />
            
            <div className="Board">
                <div className="row1">
                    <div className={`boxes ${isWinningBox(0) ? 'winning' : ''}`} onClick={() => toggle(0)}>
                        {board[0] && <img src={board[0] === 'x' ? cross_icon : circle_icon} alt={board[0]} />}
                    </div>
                    <div className={`boxes ${isWinningBox(1) ? 'winning' : ''}`} onClick={() => toggle(1)}>
                        {board[1] && <img src={board[1] === 'x' ? cross_icon : circle_icon} alt={board[1]} />}
                    </div>
                    <div className={`boxes ${isWinningBox(2) ? 'winning' : ''}`} onClick={() => toggle(2)}>
                        {board[2] && <img src={board[2] === 'x' ? cross_icon : circle_icon} alt={board[2]} />}
                    </div>
                </div>
                <div className="row2">
                    <div className={`boxes ${isWinningBox(3) ? 'winning' : ''}`} onClick={() => toggle(3)}>
                        {board[3] && <img src={board[3] === 'x' ? cross_icon : circle_icon} alt={board[3]} />}
                    </div>
                    <div className={`boxes ${isWinningBox(4) ? 'winning' : ''}`} onClick={() => toggle(4)}>
                        {board[4] && <img src={board[4] === 'x' ? cross_icon : circle_icon} alt={board[4]} />}
                    </div>
                    <div className={`boxes ${isWinningBox(5) ? 'winning' : ''}`} onClick={() => toggle(5)}>
                        {board[5] && <img src={board[5] === 'x' ? cross_icon : circle_icon} alt={board[5]} />}
                    </div>
                </div>
                <div className="row3">
                    <div className={`boxes ${isWinningBox(6) ? 'winning' : ''}`} onClick={() => toggle(6)}>
                        {board[6] && <img src={board[6] === 'x' ? cross_icon : circle_icon} alt={board[6]} />}
                    </div>
                    <div className={`boxes ${isWinningBox(7) ? 'winning' : ''}`} onClick={() => toggle(7)}>
                        {board[7] && <img src={board[7] === 'x' ? cross_icon : circle_icon} alt={board[7]} />}
                    </div>
                    <div className={`boxes ${isWinningBox(8) ? 'winning' : ''}`} onClick={() => toggle(8)}>
                        {board[8] && <img src={board[8] === 'x' ? cross_icon : circle_icon} alt={board[8]} />}
                    </div>
                </div>
            </div>
            
            <button className="Reset" onClick={resetGame}>
                Reset
            </button>

            {showAlert && (
                <div className="alert-box">
                    <div className="alert-content">
                        <p>{alertMessage}</p>
                        <button className="close-btn" onClick={closeAlert}>Close</button>
                    </div>
                </div>
            )}

            <div className={`win-overlay ${showWinOverlay ? 'show' : ''}`}>
                {winner && (
                    <div className="win-overlay-content">
                        <img 
                            src={winner === 'X' ? cross_icon : circle_icon} 
                            alt={winner} 
                            className="win-icon"
                        />
                        <h2 className="win-text">{winner} Wins!</h2>
                        <button className="play-again-btn" onClick={resetGame}>
                            Play Again
                        </button>
                    </div>
                )}
            </div>

            <div className={`draw-overlay ${showDrawOverlay ? 'show' : ''}`}>
                <div className="draw-overlay-content">
                    <div className="draw-icon">🤝</div>
                    <h2 className="draw-text">It's a Draw!</h2>
                    <button className="play-again-btn" onClick={resetGame}>
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
};
