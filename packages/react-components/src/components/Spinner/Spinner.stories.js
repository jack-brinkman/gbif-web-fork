import React from 'react';
import { Spinner } from './Spinner';

export default {
  title: 'Components/Spinner',
  component: Spinner,
};

export const Example = () => <Spinner />;

Example.story = {
  name: 'Spinner',
};


// // OPTIONS
// const options = {
//   primary: 'primary',
//   primaryOutline: 'primaryOutline',
//   outline: 'outline',
//   danger: 'danger',
// };
// type={select('Type', options, options.primary)}

// // BOOLEAN
// boolean("loading", false)

// // TEXT
// {text('Text', 'Progress text')}