import Stack from '@mui/material/Stack';
import { FormattedMessage } from 'react-intl';
import { AppContainer } from '../../components/AppContainer';
import { AppTitle } from '../../components/AppTitle';
import { Button } from '../../components/Button';

export function HomePage() {
  return (
    <AppContainer>
      <AppTitle />
      <Stack spacing={2}>
        <Button href="/play/fr/5">
          <FormattedMessage id="home.buttons.play" />
        </Button>
        <Button href="/options" disabled>
          <FormattedMessage id="home.buttons.options" />
        </Button>
        <Button href="/credits" disabled>
          <FormattedMessage id="home.buttons.credits" />
        </Button>
      </Stack>
    </AppContainer>
  );
}
