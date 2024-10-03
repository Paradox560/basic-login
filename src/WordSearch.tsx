import { useEffect, useState } from "react";

type Direction = 'horizontal' | 'vertical' | 'diagonal';

function generateRandomLetter(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
}

function canPlaceWord(grid: string[][], word: string, x: number, y: number, direction: Direction, width: number, height: number): boolean {
  const len = word.length;

  // Check bounds and if it overlaps correctly
  switch (direction) {
    case 'horizontal':
      if (x + len > width) return false;
      for (let i = 0; i < len; i++) {
        if (grid[y][x + i] !== '' && grid[y][x + i] !== word[i]) return false;
      }
      break;

    case 'vertical':
      if (y + len > height) return false;
      for (let i = 0; i < len; i++) {
        if (grid[y + i][x] !== '' && grid[y + i][x] !== word[i]) return false;
      }
      break;

    case 'diagonal':
      if (x + len > width || y + len > height) return false;
      for (let i = 0; i < len; i++) {
        if (grid[y + i][x + i] !== '' && grid[y + i][x + i] !== word[i]) return false;
      }
      break;
  }
  
  return true;
}

function placeWord(grid: string[][], word: string, x: number, y: number, direction: Direction): void {
  for (let i = 0; i < word.length; i++) {
    switch (direction) {
      case 'horizontal':
        grid[y][x + i] = word[i];
        break;
      case 'vertical':
        grid[y + i][x] = word[i];
        break;
      case 'diagonal':
        grid[y + i][x + i] = word[i];
        break;
    }
  }
}

function generateWordSearch(height: number, width: number, words: string[] = []): string[][] {
  const grid: string[][] = Array.from({ length: height }, () => Array(width).fill(''));
  const directions: Direction[] = ['horizontal', 'vertical', 'diagonal'];

  // Place words
  for (const word of words) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (canPlaceWord(grid, word.toUpperCase(), x, y, direction, width, height)) {
        placeWord(grid, word.toUpperCase(), x, y, direction);
        placed = true;
      }

      attempts++;
    }
  }

  // Fill empty spaces with random letters
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === '') {
        grid[y][x] = generateRandomLetter();
      }
    }
  }

  return grid;
}

interface Props {
    height: number,
    width: number,
    requiredWords: string[]
}

const WordSearch = ({ height, width, requiredWords }: Props) => {
    const [wordSearch, setWordSearch] = useState<string[][]>([]);
    
    useEffect(() => {
        const generatedGrid = generateWordSearch(height, width, requiredWords);
        setWordSearch(generatedGrid);
    }, [height, width, requiredWords]);

    function handleRefresh() {
        setWordSearch(generateWordSearch(height, width, requiredWords))
    }

    return (
        <div>
            <h3>Word Search</h3>
            <button onClick={() => handleRefresh()}>Refresh</button>
            <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                {wordSearch.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                    {row.map((letter, colIndex) => (
                        <td
                        key={colIndex}
                        style={{
                            border: '1px solid black',
                            padding: '10px',
                            textAlign: 'center',
                            fontSize: '18px',
                            fontFamily: 'monospace'
                        }}
                        >
                        {letter}
                        </td>
                    ))}
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      );
    };

export default WordSearch;