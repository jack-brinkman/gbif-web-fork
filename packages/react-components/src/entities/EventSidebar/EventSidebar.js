import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import SiteContext from '../../dataManagement/SiteContext';
import * as css from './styles';
import { Row, Col, Tabs, Spinner } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { Intro } from './details/Intro';
import { ImageDetails } from './details/ImageDetails';
import { MdClose, MdInfo, MdImage } from "react-icons/md";
const { TabList, Tab, TapSeperator } = Tabs;

const { TabPanel } = Tabs;

export function EventSidebar({
  onCloseRequest,
  setActiveEvent,
  addToSearch,
  addEventTypeToSearch,
  eventID,
  datasetKey,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(EVENT, { lazyLoad: true, graph: 'EVENT' });
  const [activeId, setTab] = useState( 'details');
  const theme = useContext(ThemeContext);
  const siteConfig = useContext(SiteContext)

  useEffect(() => {
    if (typeof eventID !== 'undefined') {
      const predicate1 = {
        type: 'and',
        predicates: [
          {
            key: "eventHierarchy",
            type: "equals",
            value: eventID
          }
         ,{
          key:  "datasetKey",
          type: "equals",
          value: datasetKey
        }]
      }

      const predicate2 = {
        type: 'and',
        predicates: [
          {
            key: "eventHierarchy",
            type: "equals",
            value: eventID
          },
          {
            key: "measurementOrFactTypes",
            type: "isNotNull"
          }
          ,{
            key:  "datasetKey",
            type: "equals",
            value: datasetKey
          }]
      }
      load({ variables: { eventID, datasetKey, predicate1, predicate2, size: 0, from: 0 } });
    }
  }, [eventID, datasetKey]);

  useEffect(() => {
    if (!loading) {
      setTab('details');
    }
  }, [data, loading]);

  const isLoading = loading || !data;
  const showImages = !isLoading
    && data.results.occurrenceFacet.genus.length > 0
    && siteConfig.experimental?.event?.sidebar?.images?.enabled;

  return <Tabs activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerBar({ theme })}>
        <TabList style={{ paddingTop: '12px' }} vertical>
          {onCloseRequest && <>
            <Tab direction="left" onClick={onCloseRequest}>
              <MdClose />
            </Tab>
            <TapSeperator vertical />
          </>}
          <Tab tabId="details" direction="left">
            <MdInfo />
          </Tab>
          {showImages && (
            <Tab tabId="images" direction="left">
              <MdImage />
            </Tab>
          )}
        </TabList>
      </Col>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        {isLoading && <div css={css.detailDrawerLoader({ theme })}>
          <Spinner />
          <h3 style={{ marginTop: 32, marginBottom: 0 }}>Loading event information</h3>
          <p>ID: {eventID}</p>
        </div>}
        {!isLoading && (
          <>
            <TabPanel tabId='details' style={{ height: '100%' }}>
              <Intro
                  data={data}
                  loading={loading}
                  error={error}
                  setActiveEvent={setActiveEvent}
                  addToSearch={addToSearch}
                  addEventTypeToSearch={addEventTypeToSearch}
              />
            </TabPanel>
            {showImages && (
              <TabPanel tabId='images' style={{ height: '100%' }}>
                <ImageDetails
                    data={data}
                    loading={loading}
                    setActiveImage={(img) => console.log(img)}
                />
              </TabPanel>
            )}
          </>
        )}
      </Col>
    </Row>
  </Tabs>
};

const EVENT = `
query event($eventID: String, $datasetKey: String, $predicate1: Predicate, $predicate2: Predicate, $offset: Int, $limit: Int) {
  event(eventID: $eventID, datasetKey: $datasetKey) {
    eventID
    parentEventID
    eventType {
      concept
    }
    eventName
    coordinates
    countryCode
    datasetKey
    datasetTitle
    kingdoms
    phyla
    classes
    orders
    families
    genera
    year
    month
    occurrenceCount
    measurementOrFactTypes
    measurementOrFactCount
    sampleSizeUnit
    sampleSizeValue
    samplingProtocol
    eventTypeHierarchyJoined
    eventHierarchyJoined
    eventTypeHierarchy
    eventHierarchy    
    eventTypeHierarchy
    eventHierarchy
    decimalLatitude
    decimalLongitude
    locality
    stateProvince
    locationID
    wktConvexHull
    temporalCoverage {
      gte
      lte
    }
  }

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
        eventID
        parentEventID
        eventType {
          concept
        }
        eventName
        coordinates
        countryCode
        datasetKey
        datasetTitle
        kingdoms
        phyla
        classes
        orders
        families
        genera
        year
        month
        occurrenceCount
        measurementOrFactTypes
        measurementOrFactCount
        sampleSizeUnit
        sampleSizeValue
        samplingProtocol
        eventTypeHierarchyJoined
        eventHierarchyJoined
        eventTypeHierarchy
        eventHierarchy    
        eventTypeHierarchy
        eventHierarchy
        decimalLatitude
        decimalLongitude
        locality
        stateProvince
        locationID
        wktConvexHull
        temporalCoverage {
          gte
          lte
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
      catalogNumber {
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


