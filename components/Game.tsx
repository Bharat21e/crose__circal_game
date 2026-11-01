"use client";

import { useEffect, useMemo, useState } from "react";
import MarkIcon from "./Marks";
import {
  type Cell,
  type Mark,
  bestMove,
  getWinner,
  isFull,
  other,
  randomMove,
} from "@/lib/game";

type Mode = "friend" | "easy" | "hard";

const NAMES: Record<Mark, string> = { cross: "Cross", circle: "Circle" };
const empty = (): Cell[] => Array(9).fill(null);

export default function Game() {
  let status
  let draw
  const [mode, setMode] = useState<Mode>("friend");
  const [board, setBoard] = useState<Cell[]>(empty);
  const [turn, setTurn] = useState<Mark>("cross");
  const [starter, setStarter] = useState<Mark>("cross");
  const [scores, setScores] = useState({ cross: 0, circle: 0, draws: 0 });

  const result = useMemo(() => getWinner(board), [board]);
  draw = !result && isFull(board);
  const over = Boolean(result) || draw;
  const vsComputer = mode !== "friend";
  const computerThinking = vsComputer && turn === "circle" && !over;

  // Record the round result once.
  useEffect(() => {
    if (result) setScores((s) => ({ ...s, [result.mark]: s[result.mark] + 1 }));
    else if (draw) setScores((s) => ({ ...s, draws: s.draws + 1 }));
    setTimeout(()=>{
        nextRound()
    },500)
    
  }, [result, draw]);

  // Computer plays Circle.
  useEffect(() => {
    if (!computerThinking) return;
    const t = setTimeout(() => {
      const move = mode === "hard" ? bestMove([...board], "circle") : randomMove(board);
      play(move);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computerThinking, board, mode]);

  function play(i: number) {
    if (board[i] || over) return;
    const next = [...board];
    next[i] = turn;
    setBoard(next);
    setTurn(other(turn));
  }

  if(Boolean(status==" wins this round")||draw){
     
  }

  function nextRound() {
    const s = other(starter);
    setStarter(s);
    setTurn(s);
    setBoard(empty());
  }

  function changeMode(m: Mode) {
    setMode(m);
    setScores({ cross: 0, circle: 0, draws: 0 });
    setBoard(empty());
    setStarter("cross");
    setTurn("cross");
  }

   status = result
    ? `${NAMES[result.mark]} wins this round`
    : draw
    ? "It's a draw"
    : computerThinking
    ? "Computer is thinking…"
    : `${NAMES[turn]}'s turn`;
    

  const labels: Record<Mark, string> = {
    cross: vsComputer ? "You (Cross)" : "Cross",
    circle: vsComputer ? "Computer (Circle)" : "Circle",
  };

  return (
    <section className="game">
      <div className="heading">
         <h1 className="title">Cross Circle</h1>
        <button className="btn" onClick={() => changeMode(mode)}>
          Reset scores
        </button>
      </div>
     
      <div className="modes" role="group" aria-label="Game mode">
        {(
          [
            ["friend", "Two players"],
            ["easy", "Computer: easy"],
            ["hard", "Computer: hard"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            className={`chip ${mode === m ? "chip-on" : ""}`}
            aria-pressed={mode === m}
            onClick={() => changeMode(m)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="scores">
        <div className={`score ${!over && turn === "cross" ? "score-active" : ""}`}>
          <span className="score-mark"><MarkIcon mark="cross" /></span>
          <span className="score-label">{labels.cross}</span>
          <strong>{scores.cross}</strong>
        </div>
        <div className="score score-draw">
          <span className="score-label">Draws</span>
          <strong>{scores.draws}</strong>
        </div>
        <div className={`score ${!over && turn === "circle" ? "score-active" : ""}`}>
          <span className="score-mark"><MarkIcon mark="circle" /></span>
          <span className="score-label">{labels.circle}</span>
          <strong>{scores.circle}</strong>
        </div>
      </div>

      <p className="status" role="status" aria-live="polite">{status}</p>

      <div className="board" role="grid" aria-label="Game board">
        {board.map((cell, i) => {
          const win = result?.line.includes(i);
          return (
            <button
              key={i}
              role="gridcell"
              className={`cell ${win ? "cell-win" : ""} ${cell ? "cell-" + cell : ""}`}
              onClick={() => play(i)}
              disabled={Boolean(cell) || over || computerThinking}
              aria-label={`Square ${i + 1}: ${cell ? NAMES[cell] : "empty"}`}
            >
              {cell && <MarkIcon mark={cell} />}
            </button>
          );
        })}
      </div>

      {/* <div className="actions">
         <button className="btn btn-main" onClick={nextRound}>
          {over ? "Play next round" : "Restart round"}
        </button> 
        
       
      </div> */}
    </section>
  );
}
