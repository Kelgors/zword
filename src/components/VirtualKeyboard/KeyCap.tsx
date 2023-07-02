import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';

export type KeyType = 'backspace' | 'commit' | 'letter';
const StyledBox = styled(Button)`
  font-family: 'Roboto Mono', monospace;
  font-weight: bold;
  font-size: clamp(1rem, 7vw, 3rem);
  padding: 0.25em;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1.1;
  min-width: unset;

  border-radius: 0.2em;
  cursor: pointer;
`;
export type OnKeyDownEvent = {
  char: string;
  keyType: KeyType;
};
export type KeyCapProps = {
  className?: string;
  char: string;
  icon?: React.ReactNode;
  keyType: KeyType;
  onKeyDown?: (event: OnKeyDownEvent) => void;
  color?: ButtonProps['color'];
};

export function KeyCap(props: KeyCapProps) {
  const { char, icon, keyType, onKeyDown } = props;
  const onClick = useCallback(
    function () {
      if (typeof onKeyDown !== 'function') return;
      onKeyDown({
        char: char,
        keyType: keyType
      });
    },
    [char, keyType, onKeyDown]
  );
  return (
    <StyledBox
      className={props.className}
      onClick={onClick}
      fullWidth
      color={props.color || 'unmatched'}
      variant="contained"
    >
      {icon || char}
    </StyledBox>
  );
}
