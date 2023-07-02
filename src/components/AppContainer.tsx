import Container from '@mui/material/Container';
import { PropsWithChildren } from 'react';

export function AppContainer(props: PropsWithChildren<{}>) {
  return <Container maxWidth="sm">{props.children}</Container>;
}
