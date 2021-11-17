import { css, keyframes } from '@emotion/react';
import { tooltip } from '../../../../style/shared';

//This media query approach isn't ideal. 
// Better would be to calculate the available space and decide based on that since the number of 
// filters applied influence the decision. But this simple approach will perform better and is used for now.
export const clusters = props => css`
  width: 100%;
  flex: 1 1 auto;
  background: white;
  border-radius: 4;
  border: 1px solid #e5ebed;
  display: block;

  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
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
    z-index: 10;
  }
  .nodeContent-info {
    display: none;
  }
  .nodeContent:hover .nodeContent-info {
    display: block;
  }

  .node-circle {
    fill: rgb(82, 149, 164);
    stroke: black	;
    stroke-width: 0px;
  }

  .node-capped {
    /* stroke: rgb(82, 149, 164);
    stroke-width: 2px; */
  }

  .node-entry {
    stroke: deepskyblue;
    stroke-width: 1px;
  }

  .node-sequence {
    fill: #e9c0dc;
  }

  .node-type {
    fill: rgb(203, 56, 53);
  }

  .node-image {
    fill: rgb(44, 79, 123);
  }

  .node-specimen {
    fill: rgb(250, 185, 61);
  }

  .node-multiple-identifications + .node-overlay {
    display: block;
    fill: url(#diagonalHatch)
    /* background-image: linear-gradient(45deg, #00000000 25%, #00000088 25%, #00000088 50%, #00000000 50%, #00000000 75%, #00000088 75%, #00000088 100%);
    background-size: 10px 10px; */
  }

  .node-overlay {
    display: none;
  }

  .node-treatment {
    fill: #56bda7;
  }

  .nodeContent-wrapper {
    overflow: visible;
  }

  .node[data-highlight="false"] .nodeContent-wrapper {
    &:before {
      content: '';
      position: relative;
      display: block;
      width: 300%;
      height: 300%;
      box-sizing: border-box;
      margin-left: -100%;
      margin-top: -100%;
      border-radius: 45px;
      background-color: #01a4e9;
      animation: ${pulseRing} 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) forwards 2;//infinite;
    }
  }

  .node[data-highlight="true"] .nodeContent-wrapper {
    box-shadow: 0 0 0px 10px #91919155;
  }

  .nodeContent-wrapper {
    border-radius: 50%;
  }
  /* .nodeContent-wrapper:hover {
    box-shadow: 0 0 10px 10px #ff000055;
    border-radius: 50%;
    overflow: visible;
    background: deepskyblue;
  } */
  
`;

export const pulseRing = keyframes`
  0% {
    opacity: 1;
    transform: scale(.33);
  }
  80%, 99% {
    opacity: 0;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(.33);
  }
`;

export const footer = ({ theme }) => css`
  height: 30px;
  display: flex;
  flex-direction: row;
  padding: 0 10px;
  background: ${theme.paperBackground500};
  border-radius: 0 0 ${theme.borderRadius}px ${theme.borderRadius}px;
  border-top: 1px solid ${theme.paperBorderColor};
`;

export const footerItemBase = ({ theme }) => css`
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

export const clusterWrapper = props => css`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  svg {
    width: 100%;
    flex: 1 1 auto;
  }
`;

export const meta = props => css`
  flex: 0 0 280px;
  margin-left: 8px;
`;

export const main = props => css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
`;


export const card = props => css`
  background: white;
  border: 1px solid #eee;
`;

export const headline = props => css`
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 12px;
  h2 {
    font-size: 15px;
    flex: 1 1 auto;
    margin: 0;
    padding: 0;
  }
  div {
    flex: 0 0 auto;
  }
`;

export const contentWrapper = props => css`
  overflow: auto;
  max-height: 300px;
`;

export const content = props => css`
  margin: 12px;
  font-size: 13px;
`;

export const tooltipWrapper = props => css`
  background: #333;
  color: white;
  border-radius: 4px;
  position:absolute;
  height: auto;
  visibility:hidden;
  z-index:9999;
  padding: 8px;
  font-size: .85em;
  max-width: 250px;
  /* box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1); */
  > div {
    margin-bottom: 12px;
  }
  > div:last-of-type {
    margin-bottom: 0;
  }
`;

export const stripes = css`
  /* background: repeating-linear-gradient(
    -45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  ); */
  background-image: linear-gradient(-45deg, #00000000 25%, #00000088 25%, #00000088 50%, #00000000 50%, #00000000 75%, #00000088 75%, #00000088 100%);
  background-size: 12px 12px;
  border: 1px solid #bbb;
`;

export const legendItem = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding-bottom: 8px;
  > div:first-of-type {
    width: 30px;
    text-align: center;
    >div {
      margin: auto;
    }
  }
  > * {
    flex: 0 0 auto;
    margin-right: 12px;
  }
`;