import React from 'react';
import './Square.css';

const pieceUnicode = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
};

function Square({ piece, onClick }) {
  return (
    <div className="square" onClick={onClick}>
      {piece && <span>{pieceUnicode[piece]}</span>}
    </div>
  );
}


export default Square;
