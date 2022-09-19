
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import styles from './styles';

export function Spinner({
  className,
  percent,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'spinner', {/*modifiers goes here*/ }, className);
  return <div css={styles.spinner({ theme })} {...props}></div>
};

Spinner.propTypes = {
  as: PropTypes.element
};
