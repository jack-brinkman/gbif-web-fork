import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from '../../StorybookAddressBar';
import { QueryParamProvider } from 'use-query-params';

import CollectionSearch from './CollectionSearch';
import Standalone from './Standalone';

export default {
  title: 'Search/CollectionSearch',
  component: CollectionSearch
};


const labels = {
  elevation: {
    type: 'NUMBER_RANGE',
    path: 'interval.elevation'
  },
}

function getSuggests({ client, suggestStyle }) {
  return {
    // taxonKey: {
    //   //What placeholder to show
    //   placeholder: 'Search by scientific name',
    //   // how to get the list of suggestion data
    //   getSuggestions: ({ q }) => {
    //     const { promise, cancel } = client.v1Get(`/species/suggest?datasetKey=${BACKBONE_KEY}&ranklimit=30&q=${q}`);
    //     return {
    //       cancel,
    //       promise: promise.then(response => {
    //         if (response.status === 200) {
    //           response.data = response.data.filter(x => [4,5,7].indexOf(x.kingdomKey) > -1).slice(0,8);
    //         }
    //         return response;
    //       })
    //     }
    //   },
    //   // how to map the results to a single string value
    //   getValue: suggestion => suggestion.scientificName,
    //   // how to display the individual suggestions in the list
    //   render: function ScientificNameSuggestItem(suggestion) {
    //     return <div style={{ maxWidth: '100%' }}>
    //       <div style={suggestStyle}>
    //         {suggestion.scientificName}
    //       </div>
    //       {/* <div style={{ color: '#aaa', fontSize: '0.85em' }}>
    //         <Classification taxon={suggestion} />
    //       </div> */}
    //     </div>
    //   }
    // }
  };
}

const filters = {
  myCustomFilter: {
    type: 'ENUM',
    config: {
      std: {
        filterHandle: 'alternativeCode',
        id2labelHandle: 'alternativeCode',
        translations: {
          count: 'filters.basisOfRecord.count', // translation path to display names with counts. e.g. "3 scientific names"
          name: 'My custom alternative code filter',// translation path to a title for the popover and the button
          description: 'What other names are the collection known by', // translation path for the filter description
        }
      },
      specific: {
        options: ['ENUMS', 'MAKES', 'LITTLE', 'SENSE', 'HERE'],
      }
    }
  }
}


const config = { labels, getSuggests, filters, includedFilters: ['q', 'institution', 'city', 'code', 'myCustomFilter'] };

export const Example = () => <Router initialEntries={[`/collection/search`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <CollectionSearch pageLayout config={config} style={{ margin: 'auto', height: 'calc(100vh - 40px)' }} />
  </QueryParamProvider>
</Router>

Example.story = {
  name: 'Collection search',
};

export const StandaloneExample = () => <Standalone style={{ height: 'calc(100vh - 40px)' }}></Standalone>;