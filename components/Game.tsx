
'use client';

import { useEffect, useMemo, useState } from 'react';

import MarkIcon from './Marks';

import {
  type Cell,
  type Mark,
  bestMove,
  getWinner,
  isFull,
  other,
  randomMove,
} from '@/lib/game';

type Mode = 'friend' | 'easy' | 'hard';

type GameProps = {
  selectedMark: Mark;
};

type Scores = {
  cross: number;
  circle: number;
  draws: number;
};

const NAMES: Record<Mark, string> = {
  cross: 'Cross',
  circle: 'Circle'
};

const empty = (): Cell[] => Array(9).fill(null);

export default function Game({ selectedMark }: GameProps) {

  const computerMark: Mark = other(selectedMark);

  const [mode, setMode] = useState<Mode>('friend');

  const [board, setBoard] = useState<Cell[]>(empty);

  const [starter, setStarter] = useState<Mark>(selectedMark);

  const [turn, setTurn] = useState<Mark>(selectedMark);

  const [scores, setScores] = useState<Scores>({
    cross: 0,
    circle: 0,
    draws: 0
  });

  // Check winner
  const result = useMemo(
    () => getWinner(board),
    [board]
  );

  const draw = !result && isFull(board);

  const over = Boolean(result) || draw;

  const vsComputer = mode !== 'friend';

  // Check AI turn
  const computerThinking =
    vsComputer && turn === computerMark && !over;

  // AI plays automatically
  useEffect(() => {

    if (!computerThinking) return;

    const timer = setTimeout(() => {

      const move =
        mode === 'hard'
          ? bestMove([...board], computerMark)
          : randomMove(board);

      if (move !== undefined && move !== -1) {
        play(move);
      }

    }, 500);

    return () => clearTimeout(timer);

  }, [computerThinking, board, mode]);

  // Update score and start next round
  useEffect(() => {

    if (!over) return;

    if (result) {

      setScores(previous => ({
        ...previous,
        [result.mark]: previous[result.mark] + 1
      }));

    } else {

      setScores(previous => ({
        ...previous,
        draws: previous.draws + 1
      }));

    }

    const timer = setTimeout(() => {
      nextRound();
    }, 600);

    return () => clearTimeout(timer);

  }, [over]);

  // Play move
  function play(index: number): void {

    if (board[index] !== null || over) return;

    const nextBoard = [...board];

    nextBoard[index] = turn;

    setBoard(nextBoard);

    // Switch between player and AI
    setTurn(other(turn));
  }

  // Start next round
  function nextRound(): void {

    // Change starting player every round
    const nextStarter = other(starter);

    setStarter(nextStarter);

    setTurn(nextStarter);

    setBoard(empty());
  }

  // Change game mode
  function changeMode(newMode: Mode): void {

    setMode(newMode);

    setScores({
      cross: 0,
      circle: 0,
      draws: 0
    });

    setBoard(empty());

    // Reset first player to selected mark
    setStarter(selectedMark);

    setTurn(selectedMark);
  }

  // Game status
  const status = result
    ? `${NAMES[result.mark]} wins this round`
    : draw
    ? "It's a draw"
    : computerThinking
    ? 'Computer is thinking…'
    : `${NAMES[turn]}'s turn`;

  // Player and AI labels
  const labels: Record<Mark, string> = {

    cross: vsComputer
      ? selectedMark === 'cross'
        ? 'You (Cross)'
        : 'Computer (Cross)'
      : 'Cross',

    circle: vsComputer
      ? selectedMark === 'circle'
        ? 'You (Circle)'
        : 'Computer (Circle)'
      : 'Circle'

  };

  return (

    <section className="game">

      {/* Heading */}
      <div className="heading">

        <h1 className="title">Cross Circle</h1>

        <button
          className="btn"
          onClick={() => changeMode(mode)}
        >
          Reset scores
        </button>

      </div>

      {/* Game modes */}
      <div className="modes" role="group" aria-label="Game mode">

        {(
          [
            ['friend', 'Two players'],
            ['easy', 'Computer: easy'],
            ['hard', 'Computer: hard']
          ] as [Mode, string][]
        ).map(([m, label]) => (

          <button
            key={m}
            className={`chip ${mode === m ? 'chip-on' : ''}`}
            aria-pressed={mode === m}
            onClick={() => changeMode(m)}
          >
            {label}
          </button>

        ))}

      </div>

      {/* Scores */}
      <div className="scores">

        <div className={`score ${!over && turn === 'cross' ? 'score-active' : ''}`}>

          <span className="score-mark">
            <MarkIcon mark="cross" />
          </span>

          <span className="score-label">
            {labels.cross}
          </span>

          <strong>{scores.cross}</strong>

        </div>

        <div className="score score-draw">

          <span className="score-label">Draws</span>

          <strong>{scores.draws}</strong>

        </div>

        <div className={`score ${!over && turn === 'circle' ? 'score-active' : ''}`}>

          <span className="score-mark">
            <MarkIcon mark="circle" />
          </span>

          <span className="score-label">
            {labels.circle}
          </span>

          <strong>{scores.circle}</strong>

        </div>

      </div>

      {/* Status */}
      <p className="status" role="status" aria-live="polite">
        {status}
      </p>

      {/* Game board */}
      <div className="board" role="grid" aria-label="Game board">

        {board.map((cell: Cell, index: number) => {

          const win = result?.line.includes(index) ?? false;

          return (

            <button
              key={index}
              role="gridcell"
              className={`cell ${win ? 'cell-win' : ''} ${cell ? 'cell-' + cell : ''}`}
              onClick={() => play(index)}
              disabled={
                Boolean(cell) ||
                over ||
                computerThinking ||
                (vsComputer && turn === computerMark)
              }
              aria-label={`Square ${index + 1}: ${cell ? NAMES[cell] : 'empty'}`}
            >

              {cell && <MarkIcon mark={cell} />}

            </button>

          );

        })}

      </div>

    </section>

  );
}
