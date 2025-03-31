import React from 'react';

const Board = ({ board, onCellClick, disabled }) => {
  console.log('Board props:', { board, disabled });
  
  const renderCellContent = (cell, index) => {
    if (!cell) return null;
    
    return (
      <span 
        className={`${cell === 'X' ? 'text-blue-500' : 'text-pink-500'} animate-appear`}
        style={{ textShadow: `0 0 10px ${cell === 'X' ? '#3b82f6' : '#ec4899'}` }}
      >
        {cell}
      </span>
    );
  };
  
  return (
    <div className="w-full flex justify-center items-center py-8">
      <div className="game-board grid grid-cols-3 gap-3 md:gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => {
              console.log('Cell clicked at index:', index);
              if (!disabled && cell === null) onCellClick(index);
            }}
            className={`
              game-cell aspect-square h-20 sm:h-24 md:h-28 lg:h-32
              flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold
              bg-white/20 backdrop-blur-sm rounded-xl cursor-pointer shadow-xl transition-all duration-300
              ${disabled ? 'cursor-not-allowed opacity-70' : cell === null ? 'hover:scale-105 hover:shadow-2xl hover:bg-white/30' : ''}
              ${cell === 'X' ? 'border-blue-400 border-4' : cell === 'O' ? 'border-pink-400 border-4' : 'border-white/30 border-2'}
            `}
          >
            {renderCellContent(cell, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board; 