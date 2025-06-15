'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Sample Sudoku puzzle (0 represents empty cells)
const initialPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Solution for the puzzle
const solution = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

export default function SudokuPage() {
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPuzzle(initialPuzzle.map(row => [...row]));
  }, []);

  const handleCellClick = (row: number, col: number) => {
    // Only allow clicking on empty cells
    if (initialPuzzle[row][col] === 0) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = (number: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      const newPuzzle = puzzle.map(r => [...r]);
      newPuzzle[row][col] = number;
      setPuzzle(newPuzzle);

      // Check if puzzle is complete
      const isComplete = newPuzzle.every((r, i) => 
        r.every((cell, j) => cell === solution[i][j])
      );

      if (isComplete) {
        setIsComplete(true);
        setTimeout(() => {
          router.push('/credits');
        }, 2000);
      }
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-8">Sudoku Puzzle</h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <div className="flex justify-center mb-8">
            <div className="grid gap-0.5" style={{ 
              gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
              width: 'fit-content'
            }}>
              {puzzle.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex},${colIndex}`}
                    className={`w-10 h-10 flex items-center justify-center text-white font-bold cursor-pointer
                      ${selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex ? 'bg-yellow-500' : 'bg-blue-600/50'}
                      ${initialPuzzle[rowIndex][colIndex] !== 0 ? 'cursor-not-allowed' : 'cursor-pointer'}
                      ${(rowIndex < 3 || rowIndex > 5) && (colIndex < 3 || colIndex > 5) ? 'bg-blue-700/50' : ''}
                      ${(rowIndex >= 3 && rowIndex <= 5) && (colIndex >= 3 && colIndex <= 5) ? 'bg-blue-700/50' : ''}
                      hover:bg-blue-400/50 transition-colors`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                ))
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleNumberInput(number)}
                className="w-10 h-10 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors"
              >
                {number}
              </button>
            ))}
          </div>

          <div className="text-center text-white">
            <p className="mb-4">Fill in the numbers 1-9 in each row, column, and 3x3 box.</p>
            <p>Each number can only appear once in each row, column, and 3x3 box.</p>
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50"
          >
            <div className="bg-white rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">Puzzle Complete!</h2>
              <p className="text-xl text-gray-700">Moving to the final surprise...</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 