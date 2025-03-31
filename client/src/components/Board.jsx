import React from 'react';

const Board = ({ board, onCellClick, disabled }) => {
  console.log('Board props:', { board, disabled });
  
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 w-full">
      {board.map((cell, index) => (
        <div
          key={index}
          onClick={() => {
            console.log('Cell clicked at index:', index);
            if (!disabled) onCellClick(index);
          }}
          className={`
            aspect-square h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56
            flex items-center justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold
            bg-white border-4 border-gray-300 rounded-lg cursor-pointer shadow-md transition-all duration-200
            ${disabled ? 'cursor-not-allowed opacity-80' : cell === null ? 'hover:bg-gray-100 hover:border-blue-500 hover:scale-105 hover:shadow-lg' : ''}
            ${cell === 'X' ? 'text-blue-600 border-blue-500' : cell === 'O' ? 'text-red-600 border-red-500' : ''}
          `}
        >
          {cell}
        </div>
      ))}
    </div>
  );
};

export default Board; 