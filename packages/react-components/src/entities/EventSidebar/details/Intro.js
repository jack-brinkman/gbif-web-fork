import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import * as css from '../styles';
import { Row, Col, Switch } from "../../../components";
import { Header } from './Header';
import {Group, Groups} from './Groups';
import {Summaries} from "./Summaries";
import Map from "../../SiteSidebar/details/Map/Map";
import {useQuery} from "../../../dataManagement/api";
import { Overview } from './Overview';

export function Intro({
  data = {},
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
  const {
    data: summaryData,
    load: summaryLoad
  } = useQuery(FACET_BREAKDOWN, { lazyLoad: true, graph: 'EVENT' });

  // Extract the event object from the data
  const { event } = data;

  // Load the event summary data
  useEffect(() => {
    if (typeof event !== 'undefined' && typeof event.eventID !== 'undefined') {
      const predicate1 = {
        type: 'and',
        predicates: [
          {
            key: "eventHierarchy",
            type: "equals",
            value: event.eventID
          }
         ,{
          key:  "datasetKey",
          type: "equals",
          value: event.datasetKey
        }]
      }

      const predicate2 = {
        type: 'and',
        predicates: [
          {
            key: "eventHierarchy",
            type: "equals",
            value: event.eventID
          },
          {
            key: "measurementOrFactTypes",
            type: "isNotNull"
          }
          ,{
            key:  "datasetKey",
            type: "equals",
            value: event.datasetKey
          }]
      }
      summaryLoad({ keepDataWhileLoading: true, variables: { predicate1: predicate1, predicate2: predicate2, size: 0, from: 0 } });
    }
  }, [event]);

  if (loading || !event || !summaryData) return <h2>Loading event information...</h2>;

  const hasCoordinates = (event.decimalLatitude != null && event.decimalLongitude != null ) || event.wktConvexHull != null;

  return <Row direction="column" wrap="nowrap" style={{ maxHeight: '100%', overflow: 'hidden' }}>
    <Col style={{ padding: '12px 0', paddingBottom: 50, overflow: 'auto' }} grow>
      <Header data={data} error={error} />
      <Overview data={summaryData} />
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
          data={summaryData}
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

const FACET_BREAKDOWN = `
query list($predicate1: Predicate, $predicate2: Predicate, $offset: Int, $limit: Int){

  mofResults: eventSearch(predicate: $predicate2){
      facet {
        eventTypeHierarchyJoined {
          key
          count
        }  
      }
  }

  results: eventSearch(
    predicate:$predicate1,
    size: $limit, 
    from: $offset
    ) {
    documents(size: 1) {
      total
      results {
        datasetTitle
        datasetKey
        occurrenceCount
        eventType {
          concept
        }
        measurementOrFacts {
          measurementID
          measurementType
          measurementValue
          measurementAccuracy
          measurementUnit
          measurementDeterminedDate
          measurementDeterminedBy
          measurementMethod
          measurementRemarks
        }        
      }
    }    
    facet {
      eventHierarchy {
        count
        key
      }
      eventHierarchyJoined {
        count
        key
      }
      eventTypeHierarchy {
        count
        key
      }
      eventTypeHierarchyJoined {
        count
        key
      }
      samplingProtocol {
        count
        key
      }
      measurementOrFactTypes {
        count
        key
      }
    }       
    occurrenceFacet {
      basisOfRecord {
        count
        key
      } 
      month {
        count
        key
      }  
      year {
        count
        key
      }                  
      kingdom {
        count
        key
      }
      phylum {
        count
        key
      }               
      order {
        count
        key
      }     
      class {
        count
        key
      }    
      family {
        count
        key
      }
      genus {
        count
        key
      }
      species {
        count
        key
      }
      samplingProtocol {
        count
        key
      }  
      recordedBy {
        count      
        key
      }
      recordedById {
        count
        key
      }
      identifiedBy {
        count
        key
      }
      eventTypeHierarchy {
        key
      }  
      eventTypeHierarchyJoined {
        key
        count
      }                    
    }
  }
}
`;