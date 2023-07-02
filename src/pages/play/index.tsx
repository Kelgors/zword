import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppTitle } from '../../components/AppTitle';
import { OnKeyDownEvent } from '../../components/VirtualKeyboard/KeyCap';
import { VirtualKeyboard } from '../../components/VirtualKeyboard/VirtualKeyboard';
import { wait } from '../../components/wait';
import { LetterGuessState, ShortLocale, WordSize, fetchDictionary, matchGuess } from '../../game/Wordle';

const WORD_SIZE = 5;
const TRY_COUNT = 5;

export function PlayPage() {
  const navigate = useNavigate();
  const { wordSize, locale } = useParams();

  const [isKeyboardDisabled, setKeyboardDisabled] = useState<boolean>(false);
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>(' ');
  const [playboard, setPlayboard] = useState<LetterGuessState[][]>(() => {
    return Array.from({ length: TRY_COUNT }).map(() => {
      return Array.from({ length: WORD_SIZE }).map(() => {
        return {
          letter: ' ',
          state: 'unmatched'
        };
      });
    });
  });
  const [letterIndex, setLetterIndex] = useState(0);
  const [currentTry, setCurrentTry] = useState(0);

  useEffect(
    function () {
      if (!locale || !wordSize) return;
      const controller = new AbortController();
      fetchDictionary(locale as ShortLocale, parseInt(wordSize, 10) as WordSize, {
        signal: controller.signal
      })
        .then(function (dictionary) {
          if (controller.signal.aborted) return;
          setDictionary(dictionary);
          setTargetWord(
            dictionary[Math.floor(Math.random() * (dictionary.length - 1) /* dont take the last empty entry */)]
          );
        })
        .catch((err) => (err?.name !== 'AbortError' ? console.warn(err) : undefined));
      return () => controller.abort();
    },
    [locale, wordSize]
  );

  const displayResultAsync = useCallback(
    async function (result: LetterGuessState[]) {
      for (let index = 0; index < result.length; index++) {
        await wait(200);

        const letterState = result[index];
        setPlayboard((prevPlayboard) => {
          const newPlayboard = structuredClone(prevPlayboard);
          newPlayboard[currentTry][index] = letterState;
          return newPlayboard;
        });
      }
    },
    [currentTry]
  );

  const onCommitWord = useCallback(
    function () {
      // validate word exists
      if (!dictionary.includes(targetWord)) {
        // display "unknown word !"
        return;
      }
      // validate word is not the same as the target word
      setKeyboardDisabled(true);
      displayResultAsync(matchGuess(targetWord, playboard[currentTry])).then(function () {
        setCurrentTry((prevCurrentTry) => prevCurrentTry + 1);
        setLetterIndex(0);
        setKeyboardDisabled(false);
      });
    },
    [currentTry, dictionary, displayResultAsync, playboard, targetWord]
  );

  const onVirtualKeyboardKeyDown = useCallback(
    function (event: OnKeyDownEvent) {
      if (event.keyType === 'commit' && letterIndex === WORD_SIZE) {
        onCommitWord();
        return;
      }
      if (event.keyType === 'backspace' && letterIndex > 0) {
        setPlayboard((prevPlayboard) => {
          const newPlayboard = structuredClone(prevPlayboard);
          newPlayboard[currentTry][letterIndex - 1].letter = ' ';
          return newPlayboard;
        });
        setLetterIndex((prevLetterIndex) => prevLetterIndex - 1);
        return;
      }
      if (event.keyType !== 'letter') return;
      if (letterIndex >= WORD_SIZE) return;
      const newLetter = event.char;
      setPlayboard((prevPlayboard) => {
        const newPlayboard = structuredClone(prevPlayboard);
        newPlayboard[currentTry][letterIndex].letter = newLetter;
        return newPlayboard;
      });
      setLetterIndex((prevLetterIndex) => prevLetterIndex + 1);
    },
    [currentTry, letterIndex, onCommitWord]
  );

  return (
    <Container maxWidth="md" sx={{ p: 0 }}>
      <AppTitle />
      <Alert severity="error">
        <AlertTitle>{targetWord}</AlertTitle>
      </Alert>
      <Grid container spacing={1}>
        {playboard.map(function (row, i) {
          return (
            <Grid item container spacing={1} xs={12} key={i} sx={{ justifyContent: 'center', alignItems: 'center' }}>
              {row.map(function (letterState, j) {
                return (
                  <Grid item xs={2} key={j}>
                    <Box
                      sx={{
                        aspectRatio: '1/1',
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: 'bold',
                        fontSize: 'clamp(2.5rem, 10cqi + 0.5rem, 5rem)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        lineHeight: '1.1',
                        backgroundColor: `${letterState.state}.main`,
                        color: `${letterState.state}.contrastText`
                      }}
                    >
                      {letterState.letter}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          );
        })}
      </Grid>
      <VirtualKeyboard
        layout="azerty"
        disabled={isKeyboardDisabled}
        onKeyDown={onVirtualKeyboardKeyDown}
        letterStates={playboard.flatMap((item) => item)}
      />
    </Container>
  );
}
