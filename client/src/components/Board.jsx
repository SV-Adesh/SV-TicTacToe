import React from 'react';

const Board = ({ board, onCellClick, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 w-full">
      {board.map((cell, index) => (
        <div
          key={index}
          onClick={() => !disabled && onCellClick(index)}
          className={`
            aspect-square h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56
            flex items-center justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold
            bg-gray-100 rounded-lg cursor-pointer shadow-md transition-all duration-200
            ${disabled ? 'cursor-not-allowed opacity-80' : cell === null ? 'hover:bg-gray-200 hover:scale-105 hover:shadow-lg' : ''}
            ${cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-red-600' : ''}
          `}
        >
          {cell}
        </div>
      ))}
    </div>
  );
};

export default Board; 