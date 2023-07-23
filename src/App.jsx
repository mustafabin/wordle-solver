import { useState, useEffect } from "react"
import "./App.scss"

function App() {
  const [goodWords, setGoodWords] = useState("") // User's good words input
  const [misplacedWords, setMisplacedWords] = useState("") // User's misplaced words input
  const [incorrectWords, setIncorrectWords] = useState("") // User's incorrect words input
  const [answer, setAnswer] = useState("") // The calculated answer or next best guess
  const [possibleWords, setPossibleWords] = useState([])

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt"
    )
      .then((res) => res.text())
      .then((data) => setPossibleWords(data.split('\n')))
  }, [])


const solveWordle = () => {
  // Split the user's good words input and remove any whitespace
  const goodWordsArray = goodWords.toLowerCase().split('-').filter(word => word.trim() !== '');

  // Convert misplacedWords and incorrectWords to lowercase arrays
  const misplacedWordsArray = misplacedWords.toLowerCase().split('-').filter(word => word.trim() !== '');
  const incorrectWordsArray = incorrectWords.toLowerCase().split('-').filter(word => word.trim() !== '');

  // Initialize a variable to store the best score found so far
  let bestScore = 0;

  // Initialize a variable to store the best possible answer
  let bestAnswer = "";

  // Iterate through all the possible words and calculate a score for each
  possibleWords.forEach(word => {
    // Calculate the score for the current word
    const score = calculateWordScore(word, goodWordsArray, misplacedWordsArray, incorrectWordsArray);

    // Update the bestAnswer and bestScore if the current word has a higher score
    if (score > bestScore) {
      bestAnswer = word;
      bestScore = score;
    }
  });

  // Set the best possible answer (next best guess) as the state
  setAnswer(bestAnswer);
};

// Helper function to calculate the score for a word based on the user's inputs
const calculateWordScore = (word, goodWordsArray, misplacedWordsArray, incorrectWordsArray) => {
  let score = 0;

  // Check for correct letters in the correct position
  for (let i = 0; i < word.length; i++) {
    if (goodWordsArray[i] === word[i]) {
      score += 5;
    }
  }

  // Check for correct letters in the incorrect position
  for (let i = 0; i < word.length; i++) {
    if (goodWordsArray.includes(word[i]) && goodWordsArray[i] !== word[i]) {
      score += 1;
    }
  }

  // Deduct points for misplaced words
  misplacedWordsArray.forEach(misplacedWord => {
    if (word.includes(misplacedWord)) {
      score -= 1;
    }
  });

  // Deduct points for incorrect words
  incorrectWordsArray.forEach(incorrectWord => {
    if (word === incorrectWord) {
      score -= 10;
    }
  });

  return score;
};

  return (
    <div className='Main'>
      <h4>Got tired of losing so im making a wordle bot</h4>
      <p>Good words {"( separate by dashes )"}</p>
      <input value={goodWords} onChange={(e) => setGoodWords(e.target.value)} />
      <p>Misplaced Words</p>
      <input value={misplacedWords} onChange={(e) => setMisplacedWords(e.target.value)} />
      <p>Incorrect Words</p>
      <input value={incorrectWords} onChange={(e) => setIncorrectWords(e.target.value)} />
      <button onClick={solveWordle}>Solve Wordle</button>
      <h1>Answer or next best guess: {answer}</h1>
    </div>
  )
}

export default App
