import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { ActionBar, Seperator, Spacer } from './ActionBar';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import { MdFileDownload, MdFormatQuote, MdHelp, MdApps } from 'react-icons/md';
import { VscJson } from "react-icons/vsc";
import { Tabs } from '../Tabs/Tabs';

const { TabList, Tab, TabPanel, TapSeperator, TapSpacer } = Tabs;

export default {
  title: 'Components/ActionBar',
  component: ActionBar,
};

export const Example = () => <>
  <ActionBar>
    <ActionBar>
      <MdApps />
      Occurrences
    </ActionBar>
    <Seperator />
    <div>

    <Tabs activeId='table'>
      <TabList aria-labelledby="My tabs">
        <Tab tabId="table">Table</Tab>
        <Tab tabId="map">Map</Tab>
        <Tab tabId="gallery">Gallery</Tab>
      </TabList>
    </Tabs>
    </div>
    <Spacer />
    <Seperator />
    <MdFileDownload />
    <Seperator />
    <VscJson />
    <MdFormatQuote />
    <MdHelp />
  </ActionBar>
  {/* <StyledProse source={readme}></StyledProse> */}
</>;

Example.story = {
  name: 'ActionBar',
};


// // OPTIONS
// const options = {
//   primary: 'primary',
//   primaryOutline: 'primaryOutline',
//   outline: 'outline',
//   danger: 'danger',
// };
// type={select('Type', options, options.primary)}

// // BOOLEAN
// boolean("loading", false)

// // TEXT
// {text('Text', 'ActionBar text')}