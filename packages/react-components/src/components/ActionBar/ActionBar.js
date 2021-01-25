/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';

export function ActionBar({
  as: Div = 'div',
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'actionBar', {/*modifiers goes here*/}, className);
  return <Div css={styles.actionBar({theme})} {...props} />
};

ActionBar.propTypes = {
  as: PropTypes.element
};

export const Seperator = props => {
  const theme = useContext(ThemeContext);
  return <div css={styles.seperator({ theme })} {...props}>&nbsp;</div>
}

export const Spacer = props => {
  const theme = useContext(ThemeContext);
  return <div css={styles.spacer({ theme })} {...props}></div>
}