
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect, useCallback } from "react";
import { DetailsDrawer, Menu, MenuAction, Button } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { useDialogState } from "reakit/Dialog";
import ListBox from './ListBox';
import { MdMoreVert, MdZoomIn, MdZoomOut } from 'react-icons/md'
import { ViewHeader } from '../ViewHeader';
// import MapComponent from './MapboxMap';
import MapComponent from './OpenlayersMap';
import * as css from './map.styles';

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);
  const [projection, setProjection] = useState('EPSG_3857');
  const [view, setView] = useState();
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const [listVisible, showList] = useState(false);

  const items = pointData?.occurrenceSearch?.documents?.results || [];

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [items, activeId]);

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
        <div style={{ position: 'absolute', right: 12, top: 12, zIndex: 100 }}>
          <Button appearance="text" style={{ background: 'white' }}><MdZoomIn style={{ fontSize: 24, color: theme.color800 }} /></Button>
          <Button appearance="text" style={{ background: 'white' }}><MdZoomOut style={{ fontSize: 24, color: theme.color800 }} /></Button>
          <Menu style={{display: 'inline-block'}}
            aria-label="Custom menu"
            trigger={<Button appearance="text" style={{ background: 'white' }}><MdMoreVert style={{ fontSize: 24, color: theme.color800 }} /></Button>}
            items={menuState => [
              <MenuAction key="About" onClick={() => { setProjection('EPSG_3031'); menuState.hide() }}>
                Antarctic
              </MenuAction>,
              <MenuAction key="About" onClick={() => { setProjection('EPSG_3575'); menuState.hide() }}>
                Arctic
              </MenuAction>,
              <MenuAction key="About" onClick={() => { setProjection('EPSG_3857'); menuState.hide() }}>
                Mercator
              </MenuAction>,
              <MenuAction key="About" onClick={() => { setProjection('EPSG_4326'); menuState.hide() }}>
                Plate Carrée
              </MenuAction>
            ]}
          />
        </div>
        <MapComponent view={view} projection={projection} defaultMapSettings={defaultMapSettings} predicateHash={predicateHash} q={q} css={css.mapComponent({ theme })} theme={theme} query={query} onMapClick={e => showList(false)} onPointClick={data => { showList(true); loadPointData(data) }} registerPredicate={registerPredicate} />
      </div>
    </div>
  </>;
}

export default Map;
