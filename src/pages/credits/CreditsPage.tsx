import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import { AppContainer } from '../../components/AppContainer';
import { AppTitle } from '../../components/AppTitle';
import { Button } from '../../components/Button';

export function CreditsPage() {
  return (
    <AppContainer>
      <AppTitle />
      <Stack spacing={1}>
        <Typography>
          <FormattedMessage
            id="credits.created-by"
            values={{
              link: () => (
                <Link target="_blank" href="https://www.kelgors.me/">
                  Kelgors
                </Link>
              )
            }}
          />
        </Typography>
        <Typography>
          <FormattedMessage
            id="credits.sources"
            values={{
              link: () => (
                <Link target="_blank" href="https://github.com/Kelgors/wordle/">
                  Github
                </Link>
              )
            }}
          />
        </Typography>
      </Stack>
      <Button sx={{ my: 3 }} href="/">
        <FormattedMessage id="back" />
      </Button>
    </AppContainer>
  );
}
