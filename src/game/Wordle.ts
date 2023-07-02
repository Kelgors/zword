export type LetterGuessState = {
  letter: string;
  state: 'matched' | 'incorrect' | 'misplaced' | 'unmatched';
};

export type ShortLocale = 'fr';
export type WordSize = 5;

export function fetchDictionary(
  shortLocale: ShortLocale,
  wordSize: WordSize,
  fetchOptions?: RequestInit
): Promise<string[]> {
  return fetch(`/dictionnaries/${shortLocale}/${wordSize}.txt`, fetchOptions)
    .then((response) => response.text())
    .then((text) => text.split('\n'));
}

export function matchGuess(word: string, guess: LetterGuessState[]): LetterGuessState[] {
  if (guess.length !== word.length) {
    throw new Error('Guess must be same length as word');
  }
  return guess.map(({ letter }, index) => {
    const solutionLetter = word.charAt(index);
    if (solutionLetter === letter) {
      return {
        letter,
        state: 'matched'
      };
    }
    if (word.includes(letter)) {
      return {
        letter,
        state: 'misplaced'
      };
    }
    return {
      letter,
      state: 'incorrect'
    };
  });
}

export function getColorFromState(state: LetterGuessState['state'] | undefined): string | undefined {
  switch (state) {
    case 'matched':
      return 'green';
    case 'misplaced':
      return 'gold';
    case 'incorrect':
      return 'red';
    case 'unmatched':
    default:
      return undefined;
  }
}
