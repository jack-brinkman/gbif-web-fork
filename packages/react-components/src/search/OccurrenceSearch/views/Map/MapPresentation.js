/*
Map options
it would be nice to be able to support overlays at some point. With an opacity setting I imagine
Other than that we need 4 projections
satellite map (hp participants will have to register to get a token themselves - to avoid overloading the service)
mercator maps will support both OL and MB
and some default styles for OL and MB to choose from, possibly an option to add ones own.
And probably the point overlays will have to be dependent on the basemap as well?

*/
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

const basemapOptions = {
  ol_antarctic: {
    name: 'ol_antarctic',
    projection: 'EPSG_3031',
    component: MapComponentOL
  },
  ol_arctic: {
    name: 'ol_arctic',
    projection: 'EPSG_3575',
    component: MapComponentOL,
    basemap: {
      style: 'positron'
    }
  },
  ol_mercator: {
    name: 'ol_mercator',
    projection: 'EPSG_3857',
    component: MapComponentOL,
    basemap: {
      // style: 'http://localhost:3001/map/styles/test.json'
      style: 'https://hp-search.gbif-uat.org/map/styles/hybrid.json'
    }
  },
  ol_mercator_hillshade: {
    name: 'ol_mercator_hillshade',
    projection: 'EPSG_3857',
    component: MapComponentOL,
    basemap: {
      style: 'https://hp-search.gbif-uat.org/map/styles/hillshade.json'
    }
  },
  ol_platee_caree: {
    name: 'ol_platee_caree',
    projection: 'EPSG_4326',
    component: MapComponentOL,
    basemap: {
      style: 'klokantech'
      // style: 'mapboxBright'
    }
  },
  // mb_mercator_terrain: {
  //   name: 'mb_mercator_terrain',
  //   projection: 'EPSG_3857',
  //   component: MapComponentMB,
  //   basemap: {
  //     url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
  //     attribution: 'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>'
  //   }
  // },
  mb_hillshade: {
    name: 'mb_hillshade',
    projection: 'EPSG_3857',
    component: MapComponentMB,
    basemap: {
      url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
      attribution: 'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>'
    }
  },
  mb_arcgisonline_topo: {
    name: 'mb_arcgisonline_topo',
    projection: 'EPSG_3857',
    component: MapComponentMB,
    basemap: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      // url: 'https://geoportalp-files.s3-us-east-2.amazonaws.com/vtiles/venezuela/{z}/{x}/{y}.pbf',
      attribution: 'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>'
    }
  },
  mb_mercator_satellite: {
    name: 'mb_mercator_satellite',
    projection: 'EPSG_3857',
    component: MapComponentMB,
    basemap: {
      url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=Xvg05zabkgUuQMSKiq2s',
      attribution: 'Map tiles by someone else'
    }
  }
};

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);
  const [projection, setProjection] = useState('EPSG_3857');
  const [basemap, setaBasemap] = useState(basemapOptions.ol_mercator);
  const [latestEvent, broadcastEvent] = useState();
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

  const menuOptions = menuState => values(basemapOptions).map(x => <MenuAction key={x.name} onClick={() => {
    setProjection(x.projection); 
    setMapComponent({ component: x.component });
    setaBasemap(basemapOptions[x.name]);
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
        <MapComponent.component basemap={basemap} latestEvent={latestEvent} projection={projection} defaultMapSettings={defaultMapSettings} predicateHash={predicateHash} q={q} css={css.mapComponent({ theme })} theme={theme} query={query} onMapClick={e => showList(false)} onPointClick={data => { showList(true); loadPointData(data) }} registerPredicate={registerPredicate} />
      </div>
    </div>
  </>;
}

export default Map;
