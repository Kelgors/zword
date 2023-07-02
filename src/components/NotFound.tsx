import Typography from '@mui/material/Typography';
import { AppContainer } from './AppContainer';
import { AppTitle } from './AppTitle';

export function NotFound() {
  return (
    <AppContainer>
      <AppTitle />
      <Typography variant="h2">Not found</Typography>
    </AppContainer>
  );
}
