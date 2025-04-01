import React from 'react';
import { motion } from 'framer-motion';

const Board = ({ board, onCellClick, disabled }) => {
  console.log('Board props:', { board, disabled });
  
  const renderCellContent = (cell, index) => {
    if (!cell) return null;
    
    return (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`${cell === 'X' ? 'text-cyan-400' : 'text-pink-400'} text-5xl sm:text-6xl md:text-7xl font-bold`}
        style={{ 
          textShadow: `0 0 10px ${cell === 'X' ? '#38bdf8' : '#f472b6'}`,
        }}
      >
        {cell}
      </motion.span>
    );
  };
  
  return (
    <div className="w-full flex justify-center items-center py-6">
      <div className="game-board grid grid-cols-3 gap-3 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto bg-slate-800/50 p-3 sm:p-4 rounded-xl shadow-2xl">
        {board.map((cell, index) => (
          <motion.div
            key={index}
            whileHover={!disabled && cell === null ? { scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.9)" } : {}}
            whileTap={!disabled && cell === null ? { scale: 0.95 } : {}}
            onClick={() => {
              console.log('Cell clicked at index:', index);
              if (!disabled && cell === null) onCellClick(index);
            }}
            className={`
              game-cell aspect-square h-20 sm:h-24 md:h-28 lg:h-32
              flex items-center justify-center
              bg-slate-700/80 backdrop-blur-sm rounded-lg cursor-pointer
              transition-all duration-200 ease-out
              ${disabled ? 'cursor-not-allowed opacity-70' : cell === null ? 'hover:bg-slate-600/90' : ''}
              ${cell === 'X' ? 'bg-cyan-950/30 border-cyan-500/50 border-2' : 
                cell === 'O' ? 'bg-pink-950/30 border-pink-500/50 border-2' : 
                'border-slate-600/50 border hover:border-slate-400/50'}
              shadow-lg
            `}
            data-cell-index={index}
          >
            {renderCellContent(cell, index)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Board; 