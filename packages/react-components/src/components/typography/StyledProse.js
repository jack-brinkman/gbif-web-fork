import React from 'react';
import { Markdown } from './Markdown';
import { Prose } from './Prose';

export const StyledProse = ({source, children, ...props}) => <Prose style={{padding: 24, background: 'white', overflow: 'hidden'}} {...props}><Markdown source={source} /> {children}</Prose>;
