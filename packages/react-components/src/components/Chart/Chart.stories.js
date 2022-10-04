import React from 'react';
import { Chart } from './Chart';

export default {
  title: 'Components/Chart',
  component: Chart,
};

export const Example = () => {
  <Chart />
};

Example.story = {
  name: 'Chart',
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