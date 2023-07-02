import MuiButton, { ButtonProps } from '@mui/material/Button';
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

const LinkBehavior = React.forwardRef<any, Omit<RouterLinkProps, 'to'> & { href: string }>((props, ref) => (
  <RouterLink ref={ref} to={props.href} {...props} />
));

export function Button(props: ButtonProps) {
  return <MuiButton variant="outlined" {...props} LinkComponent={LinkBehavior} />;
}
