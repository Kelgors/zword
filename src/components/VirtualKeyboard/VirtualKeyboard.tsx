import BackspaceIcon from '@mui/icons-material/Backspace';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { FormattedMessage } from 'react-intl';
import { LetterGuessState } from '../../game/Wordle';
import { KeyCap, KeyCapProps } from './KeyCap';

export type KeyboardLayoutType = 'azerty' | 'qwerty';

export type VirtualKeyboardProps = {
  layout: KeyboardLayoutType;
  disabled?: boolean;
  letterStates?: LetterGuessState[];
  onKeyDown?: KeyCapProps['onKeyDown'];
};
const KEYBOARD_LAYOUTS: Record<KeyboardLayoutType, string[]> = {
  azerty: ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'],
  qwerty: ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
};

export function VirtualKeyboard(props: VirtualKeyboardProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ my: 2, width: '50%' }}>
        <KeyCap
          icon={<FormattedMessage id="keyboard.return" />}
          char=""
          color="matched"
          keyType="commit"
          onKeyDown={!props.disabled ? props.onKeyDown : undefined}
        />
      </Box>
      <Stack spacing={{ xs: 0.5, md: 1 }} sx={{ width: 'fit-content' }}>
        {KEYBOARD_LAYOUTS[props.layout].map(function (row, index, rows) {
          return (
            <Stack
              key={row}
              direction="row"
              spacing={{ xs: 0.5, md: 1 }}
              sx={{ paddingLeft: `${index * 0.3}em`, width: 'fit-content' }}
            >
              {row.split('').map(function (char) {
                return (
                  <KeyCap
                    key={char}
                    keyType="letter"
                    char={char}
                    color={
                      props.letterStates?.find(function (letterState) {
                        return letterState.letter === char;
                      })?.state
                    }
                    onKeyDown={!props.disabled ? props.onKeyDown : undefined}
                  />
                );
              })}
              {index === rows.length - 1 ? (
                <KeyCap
                  icon={<BackspaceIcon sx={{ mx: { sx: 2, md: 4 } }} />}
                  char=""
                  keyType="backspace"
                  onKeyDown={!props.disabled ? props.onKeyDown : undefined}
                  color="incorrect"
                />
              ) : null}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
