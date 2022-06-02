
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect, useCallback } from "react";
import { DetailsDrawer, Menu, MenuAction, Button } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { useDialogState } from "reakit/Dialog";
import ListBox from './ListBox';
import { MdMoreVert, MdZoomIn, MdZoomOut } from 'react-icons/md'
import { ViewHeader } from '../ViewHeader';
import MapComponentMB from './MapboxMap';
import MapComponentOL from './OpenlayersMap';
import * as css from './map.styles';
import values from 'lodash/values';

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);
  const [projection, setProjection] = useState('EPSG_3857');
  const [latestEvent, broadcastEvent] = useState();
  const [view, setView] = useState();
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const [listVisible, showList] = useState(false);

  const items = pointData?.occurrenceSearch?.documents?.results || [];

  const [MapComponent, setMapComponent] = useState({ component: MapComponentOL });

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [items, activeId]);

  const basemapOptions = {
    OL_ANTARCTIC: {
      name: 'ol_antarctic',
      projection: 'EPSG_3031',
      component: MapComponentOL
    },
    OL_ARCTIC: {
      name: 'ol_arctic',
      projection: 'EPSG_3575',
      component: MapComponentOL
    },
    OL_MERCATOR: {
      name: 'ol_mercator',
      projection: 'EPSG_3857',
      component: MapComponentOL
    },
    OL_PLATE_CAREE: {
      name: 'ol_platee_caree',
      projection: 'EPSG_4326',
      component: MapComponentOL
    },
    MB_MERCATOR: {
      name: 'mb_mercator',
      projection: 'EPSG_3857',
      component: MapComponentMB
    }
  };

  const menuOptions = menuState => values(basemapOptions).map(x => <MenuAction key={x.name} onClick={() => {
    setProjection(x.projection); 
    setMapComponent({ component: x.component });
    menuState.hide();
  }}>
    {x.name}
  </MenuAction>);

  return <>
    <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeItem?.key}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.key} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>
    <div css={css.mapArea({ theme })}>
      <ViewHeader message="counts.nResultsWithCoordinates" loading={loading} total={total} />
      <div style={{ position: 'relative', height: '100%', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
        {listVisible && <ListBox onCloseRequest={e => showList(false)}
          labelMap={labelMap}
          onClick={({ index }) => { dialog.show(); setActive(index) }}
          data={pointData} error={pointError}
          loading={pointLoading}
          css={css.resultList({})}
        />}
        <div css={css.mapControls({ theme })}>
          <Button appearance="text" onClick={() => broadcastEvent({ type: 'ZOOM_IN' })}><MdZoomIn /></Button>
          <Button appearance="text" onClick={() => broadcastEvent({ type: 'ZOOM_OUT' })}><MdZoomOut /></Button>
          <Menu style={{ display: 'inline-block' }}
            aria-label="Custom menu"
            trigger={<Button appearance="text"><MdMoreVert /></Button>}
            items={menuOptions}
          />
        </div>
        <MapComponent.component latestEvent={latestEvent} view={view} projection={projection} defaultMapSettings={defaultMapSettings} predicateHash={predicateHash} q={q} css={css.mapComponent({ theme })} theme={theme} query={query} onMapClick={e => showList(false)} onPointClick={data => { showList(true); loadPointData(data) }} registerPredicate={registerPredicate} />
      </div>
    </div>
  </>;
}

export default Map;
