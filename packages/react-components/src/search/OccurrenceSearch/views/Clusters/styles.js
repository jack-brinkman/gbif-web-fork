import { css } from '@emotion/react';
import { tooltip } from '../../../../style/shared';

//This media query approach isn't ideal. 
// Better would be to calculate the available space and decide based on that since the number of 
// filters applied influence the decision. But this simple approach will perform better and is used for now.
export const clusters = props => css`
  width: 100%auto;
  flex: 1 1 auto;
  background: white;
  border-radius: 4;
  border: 1px solid #e5ebed;

  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
  }

  .nodes circle {
    stroke: black	;
    stroke-width: 0px;
  }
  .node {
    font-size: 2px;
  }

  .nodeContent {
    font-size: 2px;
    text-align: center;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    height: 100%;
    flex-direction: column;
    position: relative;
  }
  .nodeContent-info {
    display: none;
  }
  .nodeContent:hover .nodeContent-info {
    display: block;
  }
`;

export const footer = ({theme}) => css`
  height: 30px;
  display: flex;
  flex-direction: row;
  padding: 0 10px;
  background: ${theme.paperBackground500};
  border-radius: 0 0 ${theme.borderRadius}px ${theme.borderRadius}px;
  border-top: 1px solid ${theme.paperBorderColor};
`;

export const footerItemBase = ({theme}) => css`
  flex: 0 0 auto;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  width: 30px;
  padding: 0;
  text-align: center;
  border: 1px solid transparent;
`;

export const footerItem = (props) => css`
  ${footerItemBase(props)};
  &:hover {
    border-color: ${props.theme.paperBorderColor};
  };
  &:active {
    background: #f0f2f3;
  }
  ${tooltip(props)}
`;

export const footerText = props => css`
  ${footerItemBase(props)};
  width: auto;
  font-size: 12px;
  text-align: center;
  flex: 1 1 auto;
`;