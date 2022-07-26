
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo, MdClose } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { FormattedNumber } from 'react-intl';
import { Row, Col, Tabs, HyperText, Properties, DatasetKeyLink } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { Tree } from '../EventSidebar/details/Tree/Tree'

const { TabList, Tab, TabPanel, TapSeperator } = Tabs;
const { Term: T, Value: V } = Properties;

export function EventDatasetSidebar({
  onImageChange,
  onCloseRequest,
  id,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(DATASET, { lazyLoad: true, graph: 'EVENT' });
  const [activeId, setTab] = useState(defaultTab || 'details');
  const theme = useContext(ThemeContext);
  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);

  const dataset = data?.eventSearch?.documents.results?.[0]?.dataset?.value;
  const isLoading = loading || !dataset;

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
        </TabList>
      </Col>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='details'>
          <Row direction="column">
            {isLoading && <Col style={{ padding: '12px 16px', paddingBottom: 50 }} grow>
              Loading
            </Col>}
            {!isLoading && <Col style={{ padding: '12px 16px', paddingBottom: 50 }} grow>
              <h1>{dataset.title}</h1>
              <DatasetKeyLink id={id}>Dataset detail page</DatasetKeyLink>

              <section style={{ marginTop: 36 }}>
                <Properties>
                  {dataset?.contact.length > 0 && <>
                    <T>Contacts</T>
                    <V>
                      <span>{dataset?.contact.map(x => {
                        if (x.individualName) {
                          return `${x.individualName[0].givenName} ${x.individualName[0].surName}`;
                        }
                        if (x.organizationName) {
                          return x.organizationName;
                        }
                      }).join(' • ')}</span>
                    </V>
                  </>}
                  {dataset?.abstract && <>
                    <T>Abstract</T>
                    <V><HyperText text={dataset.abstract} /></V>
                  </>}
                  {dataset?.purpose && <>
                    <T>Purpose</T>
                    <V><HyperText text={dataset.purpose} /></V>
                  </>}
                  {dataset?.intellectualRights && <>
                    <T>Intellectual rights</T>
                    <V>
                      <EMLLicence intellectualRights={dataset?.intellectualRights}/>
                    </V>
                  </>}
                  {dataset?.methods.length > 0 && <>
                    <T>Methods</T>
                    {dataset.methods.map((method, i) => {
                      if (typeof method !== 'object') return <V>Unspecified</V>;
                      return <V key={i}>
                        <Properties horizontal={false}>
                          {method.methodStep && <><T>Methods steps</T>
                            {method.methodStep.map((step, j) => <V key={j}>{step.description[0].para[0]}</V>)}
                          </>}
                          {method.qualityControl && <><T>Methods steps</T>
                            {method.qualityControl.map((control, j) => <V key={j}>{control.description[0].para[0]}</V>)}
                          </>}
                        </Properties>
                      </V>
                    })}
                  </>}
                  {data.eventSearch?.stats.year?.min && <>
                    <T>Years</T>
                    <V>{data.eventSearch?.stats.year?.min} - {data.eventSearch?.stats.year?.max}</V>
                  </>}

                  <T>Occurrences</T>
                  <V><FormattedNumber value={data.eventSearch.stats.occurrenceCount.sum} /></V>

                  <T>Events</T>
                  <V><FormattedNumber value={data.eventSearch.documents.total} /></V>

                  {data.eventSearch?.cardinality.locationID > 0 && <>
                    <T>Known Locations</T>
                    <V><FormattedNumber value={data.eventSearch?.cardinality.locationID} /></V>
                  </>}

                  {data.eventSearch?.facet?.samplingProtocol?.length > 0 && <>
                    <T>Protocols</T>
                    <V>
                      <span>{data.eventSearch.facet.samplingProtocol.map(x => x.key).join(' • ')}</span>
                    </V>
                  </>}

                  {data.eventSearch?.facet?.measurementOrFactTypes?.length > 0 && <>
                    <T>Measurement types</T>
                    <V>
                      <span>{data.eventSearch.facet.measurementOrFactTypes.map(x => x.key).join(' • ')}</span>
                    </V>
                  </>}
                  {dataset?.purpose && <>
                    <T>Structure</T>
                    <V>
                      {data?.eventSearch && <Tree data={data.eventSearch.facet.eventTypeHierarchyJoined} />}
                    </V>
                  </>}
                </Properties>
              </section>
            </Col>}
          </Row>
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};

export const EMLLicence = ({intellectualRights}) =>  {
  if (intellectualRights?.ulink && intellectualRights?.ulink.length > 0){
    return intellectualRights?.ulink.citetitle;
  }
  return "";
}



const DATASET = `
query dataset($key: JSON!){
  eventSearch(predicate: {type: equals, key: "datasetKey", value: $key}) {
    documents(size: 1) {
      total
      results {
        dataset
      }
    }
    stats {
      year {
        min
        max
      }
      occurrenceCount {
        sum
      }
    }
    cardinality {
      locationID
      species
    }
    facet {
      measurementOrFactTypes {
        key
      }
      samplingProtocol {
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
    occurrenceFacet {
      family {
        key
      }
    }
  }
}
`;

