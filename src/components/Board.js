import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import Square from './Square';
import './Board.css';

const initialBoardSetup = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

function Board() {
  const [board, setBoard] = useState(initialBoardSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [movingPiece, setMovingPiece] = useState(null);

  const handleSquareClick = (row, col) => {
    if (selectedPiece) {
      if (isValidMove(selectedPosition, { row, col }, selectedPiece)) {
        const newBoard = movePiece(board, selectedPosition, { row, col });
        setMovingPiece({ from: selectedPosition, to: { row, col } });
        setTimeout(() => {
          setBoard(newBoard);
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
          setMovingPiece(null);
        }, 300); // Temps de l'animation
      }
      setSelectedPiece(null);
      setSelectedPosition(null);
    } else {
      if (board[row][col] && isPlayerPiece(board[row][col])) {
        setSelectedPiece(board[row][col]);
        setSelectedPosition({ row, col });
      }
    }
  };

  const isPlayerPiece = (piece) => {
    return (currentPlayer === 'white' && piece === piece.toUpperCase()) ||
           (currentPlayer === 'black' && piece === piece.toLowerCase());
  };

  const isValidMove = (from, to, piece) => {
    const [fromRow, fromCol] = [from.row, from.col];
    const [toRow, toCol] = [to.row, to.col];

    if (piece.toLowerCase() === 'p') {
      const direction = piece === 'P' ? -1 : 1;
      const startRow = piece === 'P' ? 6 : 1;

      // Mouvement de pion de base
      if (fromCol === toCol && board[toRow][toCol] === null) {
        if (toRow === fromRow + direction) return true;
        if (fromRow === startRow && toRow === fromRow + 2 * direction && board[fromRow + direction][fromCol] === null) return true;
      }

      // Capture
      if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && board[toRow][toCol] !== null) {
        return true;
      }
    } else if (piece.toLowerCase() === 'r') {
      // Mouvement horizontal ou vertical
      if (fromRow === toRow || fromCol === toCol) {
        return isPathClear(from, to);
      }
    } else if (piece.toLowerCase() === 'n') {
      // Mouvement en "L" pour le Cavalier
      const rowDiff = Math.abs(fromRow - toRow);
      const colDiff = Math.abs(fromCol - toCol);
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    } else if (piece.toLowerCase() === 'b') {
      // Mouvement diagonal
      if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
        return isPathClear(from, to);
      }
    } else if (piece.toLowerCase() === 'q') {
      // Mouvement de la Dame (combinaison de la Tour et du Fou)
      return (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) && isPathClear(from, to);
    } else if (piece.toLowerCase() === 'k') {
      // Mouvement d'un Roi (1 case dans toutes les directions)
      const rowDiff = Math.abs(fromRow - toRow);
      const colDiff = Math.abs(fromCol - toCol);
      return (rowDiff <= 1 && colDiff <= 1);
    }

    return false;
  };

  const isPathClear = (from, to) => {
    const [fromRow, fromCol] = [from.row, from.col];
    const [toRow, toCol] = [to.row, to.col];
    const rowStep = toRow === fromRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colStep = toCol === fromCol ? 0 : (toCol > fromCol ? 1 : -1);
    let row = fromRow + rowStep;
    let col = fromCol + colStep;
    while (row !== toRow || col !== toCol) {
      if (board[row][col] !== null) return false;
      row += rowStep;
      col += colStep;
    }
    return true;
  };


  const movePiece = (board, from, to) => {
    const newBoard = board.map(row => row.slice());
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;
    return newBoard;
  };

  return (
    <div className="board-container">
      <div className="turn-indicator">
        {`C'est le tour des ${currentPlayer === 'white' ? 'blancs' : 'noirs'}`}
      </div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((piece, colIndex) => {
              const piecePosition = { row: rowIndex, col: colIndex };
              const isMoving = movingPiece && (movingPiece.from.row === rowIndex && movingPiece.from.col === colIndex);

              return (
                <Square
                  key={colIndex}
                  piece={piece}
                  isMoving={isMoving}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  position={piecePosition}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
