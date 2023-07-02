import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OnKeyDownEvent } from '../../components/VirtualKeyboard/KeyCap';
import { VirtualKeyboard } from '../../components/VirtualKeyboard/VirtualKeyboard';
import { wait } from '../../components/wait';
import { LetterGuessState, ShortLocale, WordSize, fetchDictionary, matchGuess } from '../../game/Wordle';

const WORD_SIZE = 5;

function createNewLine(): LetterGuessState[] {
  return Array.from({ length: WORD_SIZE }).map(() => {
    return {
      letter: ' ',
      state: 'unmatched'
    };
  });
}

export function PlayPage() {
  const navigate = useNavigate();
  const { wordSize, locale } = useParams();

  const [isKeyboardDisabled, setKeyboardDisabled] = useState<boolean>(false);
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>(' ');
  const [playboard, setPlayboard] = useState<LetterGuessState[][]>(() => {
    return [createNewLine()];
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
        await wait(300);

        const letterState = result[index];
        setPlayboard((prevPlayboard) => {
          const newPlayboard = structuredClone(prevPlayboard);
          newPlayboard[currentTry][index] = letterState;
          return newPlayboard;
        });
      }
      await wait(1000);
    },
    [currentTry]
  );

  const onCommitWord = useCallback(
    function () {
      // validate word exists
      if (!dictionary.includes(playboard[currentTry].map((item) => item.letter).join(''))) {
        console.log('unkown word !');
        // display "unknown word !"
        // return;
      }
      // validate word is not the same as the target word
      setKeyboardDisabled(true);
      displayResultAsync(matchGuess(targetWord, playboard[currentTry])).then(function () {
        setCurrentTry((prevCurrentTry) => prevCurrentTry + 1);
        setLetterIndex(0);
        setKeyboardDisabled(false);
        setPlayboard((prevPlayboard) => {
          return [...prevPlayboard, createNewLine()];
        });
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
    <Container maxWidth="md" sx={{ px: 0, py: 1, fontSize: 'clamp(2.5rem, 10cqi + 0.5rem, 5rem)' }}>
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'none',
          height: '40vh',
          maxWidth: '100%'
        }}
      >
        <Grid container rowSpacing={1} columnSpacing={0} flexDirection="column-reverse" justifyContent="flex-start">
          {playboard.map(function (row, i) {
            return (
              <Grid
                key={i}
                item
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
                sx={{ overflow: 'none', height: 'fit-content', width: '100%' }}
              >
                {row.map(function (letterState, j) {
                  return (
                    <Grid key={j} item xs={2}>
                      <Box
                        sx={{
                          aspectRatio: '1/1',
                          fontFamily: '"Roboto Mono", monospace',
                          fontWeight: 'bold',

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
      </Box>
      <VirtualKeyboard
        layout="azerty"
        disabled={isKeyboardDisabled}
        onKeyDown={onVirtualKeyboardKeyDown}
        letterStates={playboard.flatMap((item) => item)}
      />
    </Container>
  );
}
