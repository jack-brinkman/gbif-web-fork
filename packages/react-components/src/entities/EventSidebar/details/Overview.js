import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import { Properties, Button } from '../../../components';
import { MdInfoOutline } from 'react-icons/md'
import { PlainTextField } from './properties';
import { Group } from './Groups';
import SiteContext from '../../../dataManagement/SiteContext';
import * as styles from '../styles';

const info = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 14px;
`;

export function Overview({ data }) {
  const [error, setError] = useState(null);

  const siteConfig = useContext(SiteContext);
  if (!Array.isArray(siteConfig.event?.sidebar?.overviews)) return null;

  // Try and find an overview config for this event type
  const { results } = data.results.documents;
  const overview = siteConfig.event.sidebar.overviews.find(
    (config) =>
      !Array.isArray(config.eventTypes) ||
      config.eventTypes.includes(results[0].eventType.concept)
  );

  // Ensure we have a valid overview config & have been provided with data
  if (!overview || !(results && results.length > 0)) return null;

  // Map each MoF value to the provided config
  const items = (results[0].measurementOrFacts || []);
  const mofs = items.reduce((prev, cur) => {
    const mof = (overview.mofs || []).find((item) => item.type === cur.measurementType);
    return mof ? 
    [
      ...prev,
      { simpleName: cur[mof.key].replace('% ', ''),
        value:
          `${cur[mof.value]}${mof.unit ? `${cur.measurementUnit !== '%' ? ' ' : ''}${cur.measurementUnit}` : ''}`
      }
    ] : prev;
  }, []).sort((a, b) => a.simpleName.localeCompare(b.simpleName));

  return (
    <Group label='eventDetails.groups.overview'>
      <Properties css={styles.properties} breakpoint={800}>
        {mofs.map((mof) => (
          <PlainTextField term={mof} />
        ))}
      </Properties>
      {(overview.links || []).map((link) => {
        const { title, visible, action } = link(data);
        if (visible) {
          return (
            <Button
              look='primaryOutline'
              style={{ marginTop: '20px', marginRight: '8px', fontSize: '11px' }}
              onClick={() => {
                if (action) {
                  setError(null);
                  action(setError);
                }
              }}
            >
              {title}
            </Button>
          );
        }
      })}
      {error && (
        <div css={info}>
          <MdInfoOutline size={20} style={{ marginRight: '8px' }} />
          <p style={{ fontSize: '13px', margin: '0px' }}>{error}</p>
        </div>
      )}
    </Group>
  );
}
