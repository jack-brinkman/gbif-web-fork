
import { jsx, css } from '@emotion/react';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Prose, DataHeader as UnstyledDataHeader, ResourceSearchLink } from '../../components';
import useBelow from '../../utils/useBelow';
import * as styles from './styles';
import { MdChevronLeft } from 'react-icons/md';
import { FormattedDate as FormatDate, FormattedMessage } from 'react-intl';

const { H1 } = Prose;

export function Headline({ badge = null, ...props }) {
  const theme = useContext(ThemeContext);
  return <div>
    <H1 css={styles.headline} {...props} />
    {badge && <span css={css`
    display: inline-block;
    background: tomato;
    padding: 0.2em;
    font-size: 2em;
    border-radius: 4px;
    color: white;
    vertical-align: bottom;`}>{badge}</span>}
  </div>
}

export function HeaderWrapper({ children, ...props }) {
  return <div css={styles.headerWrapper}>
    <ContentWrapper {...props}>
      {children}
    </ContentWrapper>
  </div>
}

export function HeaderInfoWrapper({ children, ...props }) {
  return <div css={styles.summary} {...props}>
      {children}
  </div>
}

export function HeaderInfoMain({ children, ...props }) {
  return <div css={styles.summary_primary} {...props}>
      {children}
  </div>
}

export function HeaderInfoEdit({ children, ...props }) {
  return <div css={styles.summary_secondary} {...props}>
      {children}
  </div>
}

export function ContentWrapper({ children, ...props }) {
  return <div css={styles.contentWrapper} {...props}>
    {children}
  </div>
}

export function DataHeader({ searchType, messageId, ...props }) {
  return <UnstyledDataHeader
    style={{ borderBottom: '1px solid #ddd', background: 'white' }}
    left={<ResourceSearchLink type={searchType} discreet style={{ display: 'flex', alignItems: 'center' }}>
      <MdChevronLeft /> <FormattedMessage id={messageId} />
    </ResourceSearchLink>}
    {...props}
  />;
}

export function ErrorMessage(props) {
  return <div css={css`
    color: tomato; 
    margin-top: 8px;
    a {
      text-decoration: underline;
      color: inherit;
    }
    `} {...props} />
};

export function DeletedMessage({ date, ...props }) {
  if (!date) return null;
  return <ErrorMessage>
    <FormattedMessage id="phrases.deletedOnDate" values={{
      date: <FormattedDate date={date} />
    }} />
  </ErrorMessage>
}

export function FormattedDate({ date, ...props }) {
  return <FormatDate value={date}
    year="numeric"
    month="long"
    day="2-digit"
    {...props}
  />
}