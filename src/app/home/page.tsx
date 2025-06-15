'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const words = ['DAD', 'BEST', 'KUALAMANA', 'WII', 'PEDOBIJA', 'ROSA', 'CALDO', 'LOVEYOU'];
const gridSize = 15;

export default function HomePage() {
  const router = useRouter();
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    generateGrid();
  }, []);

  const generateGrid = () => {
    // Initialize empty grid
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const placedWords: string[] = [];

    // Sort words by length (longest first) to optimize placement
    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    // Try to place each word
    sortedWords.forEach(word => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 200; // Increased attempts for better placement

      while (!placed && attempts < maxAttempts) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(word, row, col, direction, newGrid)) {
          placeWord(word, row, col, direction, newGrid);
          placed = true;
          placedWords.push(word);
        }
        attempts++;
      }

      if (!placed) {
        console.warn(`Could not place word: ${word}`);
      }
    });

    // Fill remaining spaces with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
  };

  const canPlaceWord = (word: string, row: number, col: number, direction: 'horizontal' | 'vertical', grid: string[][]): boolean => {
    if (direction === 'horizontal') {
      if (col + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        // Check if cell is empty or contains the same letter
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
        // Check for letters above and below
        if (row > 0 && grid[row - 1][col + i] !== '') return false;
        if (row < gridSize - 1 && grid[row + 1][col + i] !== '') return false;
      }
      // Check for letters at the ends
      if (col > 0 && grid[row][col - 1] !== '') return false;
      if (col + word.length < gridSize && grid[row][col + word.length] !== '') return false;
    } else {
      if (row + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
        // Check for letters to the left and right
        if (col > 0 && grid[row + i][col - 1] !== '') return false;
        if (col < gridSize - 1 && grid[row + i][col + 1] !== '') return false;
      }
      // Check for letters at the ends
      if (row > 0 && grid[row - 1][col] !== '') return false;
      if (row + word.length < gridSize && grid[row + word.length][col] !== '') return false;
    }
    return true;
  };

  const placeWord = (word: string, row: number, col: number, direction: 'horizontal' | 'vertical', grid: string[][]) => {
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        grid[row][col + i] = word[i];
      } else {
        grid[row + i][col] = word[i];
      }
    }
  };

  const handleTouchStart = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([[row, col]]);
  };

  const handleTouchMove = (row: number, col: number) => {
    if (!isSelecting) return;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    const [lastRow, lastCol] = lastCell;
    const rowDiff = Math.abs(row - lastRow);
    const colDiff = Math.abs(col - lastCol);

    // Only add cell if it's adjacent to the last selected cell
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 1)) {
      if (!selectedCells.some(([r, c]) => r === row && c === col)) {
        setSelectedCells(prev => [...prev, [row, col]]);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsSelecting(false);
    if (selectedCells.length > 0) {
      checkWord();
    }
  };

  const checkWord = () => {
    const selectedWord = selectedCells
      .map(([row, col]) => grid[row][col])
      .join('');

    const reverseWord = selectedWord.split('').reverse().join('');

    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords(prev => [...prev, selectedWord]);
    } else if (words.includes(reverseWord) && !foundWords.includes(reverseWord)) {
      setFoundWords(prev => [...prev, reverseWord]);
    }

    setSelectedCells([]);
  };

  const findWordCells = (word: string): [number, number][] => {
    const cells: [number, number][] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Check horizontal
        if (j + word.length <= gridSize) {
          const horizontalWord = grid[i].slice(j, j + word.length).join('');
          if (horizontalWord === word) {
            for (let k = 0; k < word.length; k++) {
              cells.push([i, j + k]);
            }
            return cells;
          }
        }
        // Check vertical
        if (i + word.length <= gridSize) {
          const verticalWord = Array.from({ length: word.length }, (_, k) => grid[i + k][j]).join('');
          if (verticalWord === word) {
            for (let k = 0; k < word.length; k++) {
              cells.push([i + k, j]);
            }
            return cells;
          }
        }
      }
    }
    return cells;
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
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-8">Word Search</h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <div className="flex justify-center mb-8">
            <div 
              className="grid gap-0.5 select-none touch-none"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: 'fit-content',
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            >
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex},${colIndex}`}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white font-bold
                      ${selectedCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'bg-yellow-500' : 'bg-blue-600/50'}
                      ${foundWords.some(word => {
                        const wordCells = findWordCells(word);
                        return wordCells.some(([r, c]: [number, number]) => r === rowIndex && c === colIndex);
                      }) ? 'bg-green-500' : ''}
                      hover:bg-blue-400/50 transition-colors`}
                    onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const element = document.elementFromPoint(touch.clientX, touch.clientY);
                      if (element) {
                        const [r, c] = element.getAttribute('data-coords')?.split(',').map(Number) || [];
                        if (r !== undefined && c !== undefined) {
                          handleTouchMove(r, c);
                        }
                      }
                    }}
                    onTouchEnd={handleTouchEnd}
                    data-coords={`${rowIndex},${colIndex}`}
                  >
                    {cell}
                  </div>
                ))
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Words to Find:</h2>
              <ul className="text-white">
                {words.map((word) => (
                  <li
                    key={word}
                    className={`${foundWords.includes(word) ? 'line-through text-gray-400' : ''}`}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Found Words:</h2>
              <ul className="text-white">
                {foundWords.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
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
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-100 transition-colors"
              >
                Continue to Sudoku
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 