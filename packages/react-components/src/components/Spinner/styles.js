import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const spinner = ({ theme }) => css`
@keyframes s2 {to{transform: rotate(1turn)}}
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 6px solid;
  border-color: #E4E4ED;
  border-right-color: ${theme.progressBar};
  animation: s2 0.8s infinite linear;
`;

export default {
  spinner
}