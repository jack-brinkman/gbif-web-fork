import React, { useContext } from 'react';
import * as css from '../styles';
import { Properties, Button } from '../../../components';
import { PlainTextField } from './properties';
import { Group } from './Groups';
import SiteContext from '../../../dataManagement/SiteContext';

export function Overview({ data }) {
  const siteConfig = useContext(SiteContext);
  if (!Array.isArray(siteConfig.event.overviews)) return null;

  // Try and find an overview config for this event type
  const { results } = data.results.documents;
  const overview = siteConfig.event.overviews.find(
    (config) =>
      !Array.isArray(config.eventTypes) ||
      config.eventTypes.includes(results[0].eventType.concept)
  );

  // Ensure we have a valid overview config & have been provided with data
  if (!overview || !(results && results.length > 0)) return null;
  const measurementOrFacts = (results[0].measurementOrFacts || []).filter(
    (mof) => (overview.mofs || []).includes(mof.measurementType)
  ).sort((a, b) => a.measurementType.localeCompare(b.measurementType));

  return (
    <Group label='eventDetails.groups.overview'>
      <Properties css={css.properties} breakpoint={800}>
        {measurementOrFacts.map((mof) => (
          <PlainTextField
            term={{
              simpleName: mof.measurementType,
              value: `${mof.measurementValue} ${mof.measurementUnit}${mof.measurementMethod ? ` (${mof.measurementMethod.replaceAll('% ', '')})` : ''}`,
            }}
          />
        ))}
      </Properties>
      {(overview.links || []).map(({ title, action }) => (
        <Button
          look='primaryOutline'
          style={{ marginTop: '20px', marginRight: '8px', fontSize: '11px' }}
          onClick={() => {
            if (action) action(data);
          }}
        >
          {title}
        </Button>
      ))}
    </Group>
  );
}
