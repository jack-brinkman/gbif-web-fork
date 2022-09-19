import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import { Row, Col, Switch } from "../../../components";
import { Header } from './Header';
import { Group, Groups } from './Groups';
import { Summaries } from "./Summaries";
import Map from "../../SiteSidebar/details/Map/Map";
import { Overview } from './Overview';

export function Intro({
  data,
  loading,
  error,
  setActiveEvent,
  addToSearch,
  addEventTypeToSearch,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);

  // Extract the event object from the data
  const { event } = data;

  const hasCoordinates = (event.decimalLatitude != null && event.decimalLongitude != null ) || event.wktConvexHull != null;

  return <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
    <Col style={{ padding: '12px 0', paddingBottom: 50, overflow: 'auto' }} grow>
      <Header data={data} error={error} />
      <Overview data={data} />
      <Groups
          event={event}
          showAll={showAll}
          setActiveEvent={setActiveEvent}
          addToSearch={addToSearch}
          addEventTypeToSearch={addEventTypeToSearch}
      />

      { hasCoordinates  &&
      <Group label="eventDetails.map">
        <Map
            latitude={event.decimalLatitude}
            longitude={event.decimalLongitude}
            wkt={event.wktConvexHull}
        />
      </Group>
      }
      <Summaries event={event}
          data={data}
          setActiveEvent={setActiveEvent}
          addToSearch={addToSearch}
          addEventTypeToSearch={addEventTypeToSearch}
          showAll={showAll}  />
    </Col>
    <Col css={css.controlFooter({ theme })} grow={false}>
      <Row justifyContent="flex-end" halfGutter={8}>
        <Col grow={false}>
          <FormattedMessage id={`eventDetails.showAllFields`}/>
          <Switch checked={showAll} onChange={() => setShowAll(!showAll)} direction="top" tip="Shortcut s" />
        </Col>
      </Row>
    </Col>
  </Row>
};