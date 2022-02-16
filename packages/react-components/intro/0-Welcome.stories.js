import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { StyledProse } from '../src/components/typography/StyledProse';
import DocsWrapper from '../src/components/DocsWrapper';
import { Button } from '../src/components';
import readme from './README.md';

export const Welcome = () => <DocsWrapper style={{padding: '20px 50px'}}>
  <StyledProse source={readme}>
    <Button onClick={linkTo('Search/OccurrenceSearch')}>Explore &apos;Occurrence search&apos;</Button>
  </StyledProse>
</DocsWrapper>

export default {
  title: 'Welcome',
  component: Welcome,
};

Welcome.story = {
  name: 'Welcome',
};
