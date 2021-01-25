import { css } from '@emotion/core';
// import { focusStyle } from '../../style/shared';

export const actionBar = ({...props}) => css`
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`;

export const seperator = ({ theme, vertical }) => css`
  ${vertical ? 'height: 1px' : 'width: 1px'};
  ${vertical ? 'margin: 5px 0' : 'margin: 0 5px'};
  ${vertical ? 'border-top: 1px solid #ddd' : 'border-left: 1px solid #ddd;'};
  flex: 0 1 auto;
`;

export const spacer = ({ theme }) => css`
  flex: 1 1 auto;
`;