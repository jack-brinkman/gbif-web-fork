import { jsx } from '@emotion/react';
import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
// import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { DetailsDrawer, Button } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { ViewHeader } from '../ViewHeader';
import { MdChevronRight, MdChevronLeft, MdFirstPage } from "react-icons/md";
// import { useUrlState } from '../../../../dataManagement/state/useUrlState';
import { useQueryParam, NumberParam } from 'use-query-params';
import ThemeContext from '../../../../style/themes/ThemeContext';
import * as d3 from 'd3';
import test, { highlightNode } from './test';

import * as css from './styles';

export const ClusterPresentation = ({ first, prev, next, size, from, data, graph, total, loading }) => {
  const theme = useContext(ThemeContext);
  const intl = useIntl();
  const [activeKey, setActiveKey] = useQueryParam('entity', NumberParam);
  const ref = useRef(null);
  const [activeCluster, setActiveCluster] = useState();
  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.occurrenceSearch?.documents?.results || [];

  const page = 1 + Math.floor(from / size);
  const totalPages = Math.ceil(total / size);

  useEffect(() => {
    if (activeKey) {
      dialog.show();
      const clusterKey = graph.nodes.find(x => x.name === '' + activeKey).rootKey;
      const cluster = graph.clusterMap[clusterKey];
      setActiveCluster(cluster);
      highlightNode({
        element: ref.current,
        key: activeKey
      });
    } else {
      dialog.hide();
      // setActiveCluster();
      highlightNode({
        element: ref.current
      });
    }
  }, [activeKey]);

  useUpdateEffect(() => {
    if (!dialog.visible) {
      setActiveKey();
    }
  }, [dialog.visible]);

  const nextItem = useCallback(() => {
    if (!activeCluster) return;
    const clusterNodes = activeCluster.clusterNodes;
    const activeIndex = clusterNodes.findIndex(x => x === activeKey);
    const next = activeIndex === clusterNodes.length - 1 ? 0 : activeIndex + 1;
    if (clusterNodes[next]) {
      setActiveKey(clusterNodes[next]);
    }
  }, [activeKey, activeCluster]);

  const previousItem = useCallback(() => {
    if (!activeCluster) return;
    const clusterNodes = activeCluster.clusterNodes;
    const activeIndex = clusterNodes.findIndex(x => x === activeKey);
    const prev = activeIndex === 0 ? clusterNodes.length - 1 : activeIndex - 1;
    if (clusterNodes[prev]) {
      setActiveKey(clusterNodes[prev]);
    }
  }, [activeKey, activeCluster]);

  useEffect(() => {
    // d3.select(ref.current)
    //  .append('p')
    //  .text('Hello from D3');
    if (ref && ref.current && graph) {
      test({
        element: ref.current,
        nodes_data: graph.nodes,
        links_data: graph.links,
        onNodeClick: ({ key }) => {
          setActiveKey(key);
        }
      })
    }
  }, [ref, graph]);

  return <>
    {dialog.visible && <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeKey}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeKey} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>}
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      <ViewHeader loading={loading} total={total} />
      <div css={css.main}>
        <div css={css.clusterWrapper}>
          <div id="tooltip" css={css.tooltip2}>
            <div id="container">
              <div id="series">about this node</div>
            </div>
          </div>
          <svg height="500" css={css.clusters} ref={ref} style={{ pointerEvents: loading ? 'none' : null, filter: loading ? 'grayscale(8)' : null, opacity: loading ? 0.5 : 1 }}></svg>
          {next && <div css={css.footer({ theme })}>
            {first && page > 2 && <Button appearance="text" css={css.footerItem({ theme })} direction="right" tip={intl.formatMessage({ id: 'pagination.first' })} onClick={first}>
              <MdFirstPage />
            </Button>}
            {prev && page > 1 && <Button appearance="text" css={css.footerItem({ theme })} direction="right" tip={intl.formatMessage({ id: 'pagination.previous' })} onClick={prev}>
              <MdChevronLeft />
            </Button>}
            {total > 0 && <span css={css.footerText({ theme })}>
              <FormattedMessage
                id='pagination.pageXofY'
                defaultMessage={'Loading'}
                values={{ current: <FormattedNumber value={page} />, total: <FormattedNumber value={totalPages} /> }}
              />
            </span>}
            {next && page < totalPages && <Button appearance="text" css={css.footerItem({ theme })} direction="left" tip={intl.formatMessage({ id: 'pagination.next' })} onClick={next}>
              <MdChevronRight />
            </Button>}
          </div>}
        </div>
        <div css={css.meta}>
          <InfoCard headline="About" collapsible>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </InfoCard>
          <InfoCard headline="Legend" style={{marginTop: 8}}>
            <div>
              <input type="checkbox" /> something
            </div>
            <div>
              <input type="checkbox" /> something
            </div>
            <div>
              <input type="checkbox" /> something
            </div>
          </InfoCard>
        </div>
      </div>
      {/* <pre>{JSON.stringify(graph, null, 2)}</pre> */}
    </div>
  </>
}

function InfoCard({ headline, children, style, props }) {
  return <div css={css.card} style={style}>
    <div css={css.headline}>
      <h2>{ headline }</h2>
      <div>v</div>
    </div>
    <div css={css.contentWrapper}>
      <div css={css.content}>
        {children}
      </div>
    </div>
  </div>;
}