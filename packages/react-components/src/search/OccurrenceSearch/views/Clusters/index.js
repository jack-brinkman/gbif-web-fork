import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import { useUpdateEffect } from 'react-use';
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { ClusterPresentation } from './ClusterPresentation';
import { useQueryParam, NumberParam } from 'use-query-params';
import uniqBy from 'lodash/uniqBy'

const OCCURRENCE_CLUSTERS = `
query clusters($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  occurrenceSearch(predicate: $predicate, size: $size, from: $from) {
    documents(size: $size, from: $from) {
      total
      results {
        key
        basisOfRecord
        catalogNumber
        publishingOrgKey
        publisherTitle
        stillImageCount
        datasetKey
        datasetTitle
        volatile {
          features {
            isSequenced
            isTreament
          }
        }
        related {
          occurrence {
            key
            basisOfRecord
            catalogNumber
            publishingOrgKey
            publisherTitle
            stillImageCount
            datasetKey
        		datasetTitle
            volatile {
              features {
                isSequenced
                isTreament
              }
            }
            related {
              occurrence {
                key
                basisOfRecord
                catalogNumber
                publishingOrgKey
                publisherTitle
                stillImageCount
                datasetKey
                datasetTitle
                volatile {
                  features {
                    isSequenced
                    isTreament
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

function Clusters() {
  const [from = 0, setFrom] = useQueryParam('from', NumberParam);
  const [graph, setGraph] = useState();

  const size = 30;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_CLUSTERS, { lazyLoad: true });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig),
        {
          type: 'equals',
          key: 'isInCluster',
          value: true
        }
      ].filter(x => x)
    }
    load({ keepDataWhileLoading: true, variables: { predicate, size, from } });
  }, [currentFilterContext.filterHash, rootPredicate, from]);

  useEffect(() => {
    return function cleanup() {
      setFrom();
    };
  }, []);

  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  useUpdateEffect(() => {
    setFrom(0);
  }, [currentFilterContext.filterHash]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  });

  const prev = useCallback(() => {
    setFrom(Math.max(0, from - size));
  });

  const first = useCallback(() => {
    setFrom(0);
  });

  // process and remap data to structure we can use
  useEffect(() => {
    if (data) {
      if (error) {
        console.log(error);
      }
      const graph = transformResult({ data });
      setGraph(graph);
    }
  }, [data]);

  return <>
    <ClusterPresentation
      loading={loading}
      graph={graph}
      next={next}
      prev={prev}
      first={first}
      size={size}
      from={from}
      total={data?.occurrenceSearch?.documents?.total}
    />
  </>
}

export default Clusters;


function getNodeFromOccurrence(o, isEntry) {
  return {
    name: o.key + '',
    catalogNumber: o.catalogNumber,
    type: o.basisOfRecord,
    isTreatment: o?.volatile?.features?.isTreament,
    isSequenced: o?.volatile?.features?.isSequenced,
    isEntry
  };
}

function getNodeFromDataset(o) {
  return {
    name: o.datasetKey,
    title: o.datasetTitle,
    type: 'CITATION'
  };
}

function getNodeFromPublisher(o, rootKey) {
  return {
    name: o.publishingOrgKey + `_${o.key}`,
    title: o.publisherTitle,
    type: 'PUBLISHER'
  };
}

function processOccurrence(x, rootKey, nodes, links, isEntry) {
  nodes.push(getNodeFromOccurrence(x, isEntry));

  // add publisher nodes
  // nodes.push(getNodeFromPublisher(x, rootKey));
  // links.push({ source: x.key + '', target: x.publishingOrgKey + `_${x.key}` })

  // add treatment nodes
  // if (x?.volatile?.features?.isTreament) {
  //   nodes.push(getNodeFromDataset(x));
  //   links.push({ source: x.key + '', target: x.datasetKey })
  // }
}

function processRelated({parent, related, nodes, links, rootKey}) {
  if (related && related.length > 0) {
    related.forEach(e => {
      processOccurrence(e.occurrence, rootKey, nodes, links);
      // and add link to the related
      links.push({ source: parent.key + '', target: e.occurrence.key + '' });
      const itemRelations = e.occurrence.related;
      processRelated({parent: e.occurrence, related: itemRelations, nodes, links, rootKey});
    });
  }
}

function transformResult({ data }) {
  let nodes = [];
  let links = [];
  const items = data.occurrenceSearch.documents.results;
  items.forEach(x => {
    if (x.related && x.related.length > 0) {
      processOccurrence(x, x.key, nodes, links, true);
      processRelated({parent: x, related: x.related, nodes, links, rootKey: x.key});
    }
  });

  let n = uniqBy(nodes, 'name');
  let l = uniqBy(links, x => {
    let sorted = [x.source, x.target].sort();
    let val = `${sorted[0]} - ${sorted[1]}`;
    return val;
  });
  return { nodes: n, links: l };
}