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
    <div className="game-board grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
      {board.map((cell, index) => (
        <div
          key={index}
          onClick={() => {
            console.log('Cell clicked at index:', index);
            if (!disabled && cell === null) onCellClick(index);
          }}
          className={`
            game-cell aspect-square h-24 sm:h-28 md:h-36 lg:h-44 xl:h-52
            flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold
            glass rounded-2xl cursor-pointer shadow-xl transition-all duration-300
            ${disabled ? 'cursor-not-allowed opacity-70' : cell === null ? 'hover:scale-105 hover:shadow-2xl' : ''}
            ${cell === 'X' ? 'border-blue-400 border-4' : cell === 'O' ? 'border-pink-400 border-4' : 'border-transparent border-4'}
          `}
          style={{
            transform: `${cell ? 'scale(1)' : 'scale(0.97)'}`,
          }}
        >
          {renderCellContent(cell, index)}
        </div>
      ))}
    </div>
  );
};

export default Board; 