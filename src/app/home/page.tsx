'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const words = ['DAD', 'BEST', 'KUALAMANA', 'WII', 'PEDOBIJA', 'ROSA', 'CALDO', 'LOVEYOU'];
const GRID_SIZE = 15;

function generateGrid() {
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const placedWords: string[] = [];
  
  // Sort words by length (longest first) to optimize placement
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  // Place words in the grid
  sortedWords.forEach(word => {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 200; // Increased attempts

    while (!placed && attempts < maxAttempts) {
      const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlaceWord(grid, word, row, col, direction)) {
        placeWord(grid, word, row, col, direction);
        placed = true;
        placedWords.push(word);
      }
      attempts++;
    }

    if (!placed) {
      console.warn(`Failed to place word: ${word}`);
    }
  });

  // Verify all words are placed
  const missingWords = words.filter(word => !placedWords.includes(word));
  if (missingWords.length > 0) {
    console.error('Missing words:', missingWords);
    // If any words are missing, regenerate the grid
    return generateGrid();
  }

  // Fill remaining spaces with random letters
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return grid;
}

function canPlaceWord(grid: string[][], word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
  // Check if word fits within grid bounds
  if (direction === 'horizontal' && col + word.length > GRID_SIZE) return false;
  if (direction === 'vertical' && row + word.length > GRID_SIZE) return false;

  // Check if space is available and doesn't conflict with existing letters
  for (let i = 0; i < word.length; i++) {
    const currentRow = direction === 'horizontal' ? row : row + i;
    const currentCol = direction === 'horizontal' ? col + i : col;
    
    // Check if the cell is empty or contains the same letter
    if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== word[i]) {
      return false;
    }

    // For horizontal words, check cells above and below
    if (direction === 'horizontal') {
      if (row > 0 && grid[row - 1][currentCol] !== '') return false;
      if (row < GRID_SIZE - 1 && grid[row + 1][currentCol] !== '') return false;
    }
    // For vertical words, check cells to the left and right
    else {
      if (col > 0 && grid[currentRow][col - 1] !== '') return false;
      if (col < GRID_SIZE - 1 && grid[currentRow][col + 1] !== '') return false;
    }
  }

  return true;
}

function placeWord(grid: string[][], word: string, row: number, col: number, direction: 'horizontal' | 'vertical') {
  for (let i = 0; i < word.length; i++) {
    if (direction === 'horizontal') {
      grid[row][col + i] = word[i];
    } else {
      grid[row + i][col] = word[i];
    }
  }
}

export default function HomePage() {
  const router = useRouter();
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setGrid(generateGrid());
  }, []);

  const handleMouseDown = (row: number, col: number) => {
    setSelectedCells([[row, col]]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (selectedCells.length === 0) return;

    const [startRow, startCol] = selectedCells[0];
    const newSelectedCells: [number, number][] = [[startRow, startCol]];
    
    const rowDiff = row - startRow;
    const colDiff = col - startCol;

    // Handle diagonal selection
    if (Math.abs(rowDiff) === Math.abs(colDiff)) {
      const steps = Math.abs(rowDiff);
      const rowStep = rowDiff / steps;
      const colStep = colDiff / steps;
      
      for (let i = 1; i <= steps; i++) {
        const newRow = startRow + (i * rowStep);
        const newCol = startCol + (i * colStep);
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
          newSelectedCells.push([newRow, newCol]);
        }
      }
    }
    // Handle vertical selection
    else if (colDiff === 0) {
      const steps = Math.abs(rowDiff);
      const step = rowDiff / steps;
      for (let i = 1; i <= steps; i++) {
        const newRow = startRow + (i * step);
        if (newRow >= 0 && newRow < GRID_SIZE) {
          newSelectedCells.push([newRow, startCol]);
        }
      }
    }
    // Handle horizontal selection
    else if (rowDiff === 0) {
      const steps = Math.abs(colDiff);
      const step = colDiff / steps;
      for (let i = 1; i <= steps; i++) {
        const newCol = startCol + (i * step);
        if (newCol >= 0 && newCol < GRID_SIZE) {
          newSelectedCells.push([startRow, newCol]);
        }
      }
    }

    setSelectedCells(newSelectedCells);
  };

  const handleMouseUp = () => {
    if (selectedCells.length > 0) {
      const selectedWord = selectedCells
        .map(([row, col]) => grid[row][col])
        .join('');
      
      const reversedWord = selectedWord.split('').reverse().join('');
      
      if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        setFoundWords([...foundWords, selectedWord]);
      } else if (words.includes(reversedWord) && !foundWords.includes(reversedWord)) {
        setFoundWords([...foundWords, reversedWord]);
      }
      
      setSelectedCells([]);
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
        <h1 className="text-4xl font-bold text-white text-center mb-8">Word Search</h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <div className="flex justify-center mb-8">
            <div className="grid gap-1" style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: 'fit-content'
            }}>
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex},${colIndex}`}
                    className={`w-10 h-10 flex items-center justify-center text-white font-bold cursor-pointer
                      ${selectedCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'bg-yellow-500' : 'bg-blue-600/50'}
                      hover:bg-blue-400/50 transition-colors`}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    {cell}
                  </div>
                ))
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Words to Find:</h2>
              <div className="space-y-2">
                {words.map((word, index) => (
                  <p
                    key={word}
                    className={`text-white ${foundWords.includes(word) ? 'line-through opacity-50' : ''}`}
                  >
                    {index + 1}. {word}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Found Words:</h2>
              <div className="space-y-2">
                {foundWords.map((word, index) => (
                  <p key={word} className="text-white">
                    {index + 1}. {word}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {foundWords.length === words.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => router.push('/crossword')}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                Continue to Zudoku
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 