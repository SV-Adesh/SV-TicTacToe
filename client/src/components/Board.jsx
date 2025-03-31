import React from 'react';

const Board = ({ board, onCellClick, disabled }) => {
  console.log('Board props:', { board, disabled });
  
  const renderCellContent = (cell, index) => {
    if (!cell) return null;
    
    return (
      <span 
        className={`${cell === 'X' ? 'text-cyan-300' : 'text-pink-300'} animate-appear text-5xl sm:text-6xl md:text-7xl`}
        style={{ textShadow: `0 0 10px ${cell === 'X' ? '#38bdf8' : '#f472b6'}` }}
      >
        {cell}
      </span>
    );
  };
  
  return (
    <div className="w-full flex justify-center items-center py-6">
      <div className="game-board grid grid-cols-3 gap-2 md:gap-3 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => {
              console.log('Cell clicked at index:', index);
              if (!disabled && cell === null) onCellClick(index);
            }}
            className={`
              game-cell aspect-square h-24 sm:h-28 md:h-32 lg:h-36
              flex items-center justify-center font-bold
              bg-gray-800/80 rounded-lg cursor-pointer shadow-2xl transition-all duration-300
              ${disabled ? 'cursor-not-allowed opacity-70' : cell === null ? 'hover:scale-105 hover:shadow-2xl hover:bg-gray-700/90' : ''}
              ${cell === 'X' ? 'border-cyan-500 border-2' : cell === 'O' ? 'border-pink-500 border-2' : 'border-gray-600 border-2'}
            `}
            data-cell-index={index}
          >
            {renderCellContent(cell, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board; 