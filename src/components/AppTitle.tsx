import { Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export function AppTitle() {
  return (
    <Typography variant="h3" sx={{ py: 2 }}>
      <FormattedMessage id="app.title"></FormattedMessage>
    </Typography>
  );
}
