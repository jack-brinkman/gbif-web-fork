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
import { MdOutlineLayers, MdZoomIn, MdZoomOut } from 'react-icons/md'
import { ViewHeader } from '../ViewHeader';
import MapComponentMB from './MapboxMap';
import MapComponentOL from './OpenlayersMap';
import * as css from './map.styles';
import values from 'lodash/values';
import env from '../../../../../.env.json';

const basemapOptions = {
  ol_antarctic: {
    name: 'ol_antarctic',
    component: MapComponentOL,
    mapConfig: {
      basemapStyle: `${env.MAP_STYLES}/3031.json`,
      projection: 'EPSG_3031'
    }
  },
  ol_arctic: {
    name: 'ol_arctic',
    component: MapComponentOL,
    mapConfig: {
      basemapStyle: `positron`,
      projection: 'EPSG_3575'
    }
  },
  ol_mercator: {
    name: 'ol_mercator',
    component: MapComponentOL,
    mapConfig: {
      basemapStyle: `https://api.maptiler.com/maps/basic-2154/style.json?key=Xvg05zabkgUuQMSKiq2s`,
      projection: 'EPSG_3857'
    }
  },
  ol_mercator_hillshade: {
    name: 'ol_mercator_hillshade',
    component: MapComponentOL,
    mapConfig: {
      // basemapStyle: `${env.MAP_STYLES}/hillshade.json`,
      basemapStyle: `https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=pk.eyJ1IjoiZ2JpZiIsImEiOiJja3VmZm50Z3kxcm1vMnBtdnBmeGd5cm9hIn0.M2z2n9QP9fRHZUCw9vbgOA`,
      projection: 'EPSG_3857'
    }
  },
  ol_platee_caree: {
    name: 'ol_platee_caree',
    component: MapComponentOL,
    mapConfig: {
      basemapStyle: `${env.MAP_STYLES}/4326.json`,
      projection: 'EPSG_4326'
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
    component: MapComponentMB,
    // basemap: {
    //   url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
    //   attribution: 'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>'
    // },
    mapConfig: {
      basemapStyle: `${env.MAP_STYLES}/hillshade.json`,
      projection: 'EPSG_3857'
    }
  },
  mb_darkMatter: {
    name: 'mb_darkMatter',
    component: MapComponentMB,
    // basemap: {
    //   url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    //   // url: 'https://geoportalp-files.s3-us-east-2.amazonaws.com/vtiles/venezuela/{z}/{x}/{y}.pbf',
    //   attribution: 'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>'
    // },
    mapConfig: {
      basemapStyle: `https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=pk.eyJ1IjoiZ2JpZiIsImEiOiJja3VmZm50Z3kxcm1vMnBtdnBmeGd5cm9hIn0.M2z2n9QP9fRHZUCw9vbgOA`,
      // basemapStyle: `${env.MAP_STYLES}/darkMatter.json`,
      projection: 'EPSG_3857'
    }
  },
  mb_satellite: {
    name: 'mb_satellite',
    projection: 'EPSG_3857',
    component: MapComponentMB,
    basemap: {
      url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=Xvg05zabkgUuQMSKiq2s',
      attribution: 'Map tiles by someone else'
    },
    mapConfig: {
      basemapStyle: `${env.MAP_STYLES}/bingSatellite.json`,
      projection: 'EPSG_3857'
    }
  }
};

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);
  const [projection, setProjection] = useState('EPSG_3031');
  const [config, setConfig] = useState(basemapOptions.ol_antarctic);
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
    setConfig(x);
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
            trigger={<Button appearance="text"><MdOutlineLayers /></Button>}
            items={menuOptions}
          />
        </div>
        <MapComponent.component mapConfig={config.mapConfig} latestEvent={latestEvent} projection={projection} defaultMapSettings={defaultMapSettings} predicateHash={predicateHash} q={q} css={css.mapComponent({ theme })} theme={theme} query={query} onMapClick={e => showList(false)} onPointClick={data => { showList(true); loadPointData(data) }} registerPredicate={registerPredicate} />
      </div>
    </div>
  </>;
}

export default Map;
