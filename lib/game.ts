export type Mark = "cross" | "circle";
export type Cell = Mark | null;

export const LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function getWinner(board: Cell[]): { mark: Mark; line: number[] } | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a] as Mark, line };
    }
  }
  return null;
}

export const isFull = (board: Cell[]) => board.every(Boolean);

export const other = (m: Mark): Mark => (m === "cross" ? "circle" : "cross");

function minimax(board: Cell[], turn: Mark, me: Mark, depth: number): number {
  const w = getWinner(board);
  if (w) return w.mark === me ? 10 - depth : depth - 10;
  if (isFull(board)) return 0;

  let best = turn === me ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = turn;
    const score = minimax(board, other(turn), me, depth + 1);
    board[i] = null;
    best = turn === me ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

/** Unbeatable: picks the best square for `me`. */
export function bestMove(board: Cell[], me: Mark): number {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = me;
    const score = minimax(board, other(me), me, 1);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }
  return move;
}

/** Easy: random square. */
export function randomMove(board: Cell[]): number {
  const free = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
  return free[Math.floor(Math.random() * free.length)];
}
