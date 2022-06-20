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
import SiteContext from '../../../../dataManagement/SiteContext';
import { FormattedMessage } from 'react-intl';

function getMapLayers({ apiKeys }) {
  return {
    ol_antarctic: {
      name: 'ol_antarctic',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `positron`,
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
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `https://api.maptiler.com/maps/outdoor/style.json?key=${apiKeys.maptilerApiKey}`,
        // basemapStyle: `https://api.maptiler.com/maps/basic/style.json?key=sdf`,
        projection: 'EPSG_3857'
      }
    },
    ol_positron: {
      name: 'ol_positron',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `positron`,
        projection: 'EPSG_3857'
      }
    },
    mb_positron: {
      name: 'mb_positron',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `positron`,
        projection: 'EPSG_3857'
      }
    },
    ol_mercator_hillshade: {
      name: 'ol_mercator_hillshade',
      component: MapComponentOL,
      mapConfig: {
        // basemapStyle: `https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=${apiKeys.mapboxApiKey}`,
        basemapStyle: `${env.MAP_STYLES}/hillshade`,
        projection: 'EPSG_3857'
      }
    },
    ol_platee_caree: {
      name: 'ol_platee_caree',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/4326`,
        projection: 'EPSG_4326'
      }
    },
    mb_hillshade: {
      name: 'mb_hillshade',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/hillshade`,
        projection: 'EPSG_3857'
      }
    },
    mb_darkMatter: {
      name: 'mb_darkMatter',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=${apiKeys.mapboxApiKey}`,
        projection: 'EPSG_3857'
      }
    },
    SATELLITE_BING_MB: {
      name: 'SATELLITE_MB',
      labelTranslation: 'map.styles.satellite_mb',
      projection: 'EPSG_3857',
      component: MapComponentMB,
      mapConfig: {
        // basemapStyle: `${env.MAP_STYLES}/bingSatellite.json`,
        basemapStyle: `${env.MAP_STYLES}/bing-satellite?maptilerApiKey=${apiKeys.maptilerApiKey}`,
        projection: 'EPSG_3857'
      }
    },
    SATELLITE_MAPTILER_MB: {
      name: 'SATELLITE_MB',
      labelTranslation: 'map.styles.satellite_maptiler_mb',
      projection: 'EPSG_3857',
      component: MapComponentMB,
      mapConfig: {
        // basemapStyle: `${env.MAP_STYLES}/bingSatellite.json`,
        basemapStyle: `${env.MAP_STYLES}/maptiler-satellite?maptilerApiKey=${apiKeys.maptilerApiKey}`,
        projection: 'EPSG_3857'
      }
    }
  }
};

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);
  const siteContext = useContext(SiteContext);
  const [config, setConfig] = useState();
  const [latestEvent, broadcastEvent] = useState();
  const [basemapOptions, setBasemapOptions] = useState();
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const [listVisible, showList] = useState(false);

  const items = pointData?.occurrenceSearch?.documents?.results || [];

  const [MapComponent, setMapComponent] = useState(config);

  useEffect(() => {
    const mapOptions = getMapLayers({apiKeys: siteContext.apiKeys});
    console.log(mapOptions);
    setBasemapOptions(mapOptions);
    setConfig(mapOptions.SATELLITE_BING_MB);
    setMapComponent(mapOptions.SATELLITE_BING_MB);
  },
    [siteContext],
  );

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
    setMapComponent({ component: x.component });
    setConfig(x);
    menuState.hide();
  }}>
    <FormattedMessage id={x.labelTranslation || 'unknown'} defaultMessage={x.name} />
  </MenuAction>);
  
  console.log('test');
  if (!basemapOptions || !MapComponent || !config) return null;
  console.log('after test');

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
        <MapComponent.component mapConfig={config.mapConfig} latestEvent={latestEvent} defaultMapSettings={defaultMapSettings} predicateHash={predicateHash} q={q} css={css.mapComponent({ theme })} theme={theme} query={query} onMapClick={e => showList(false)} onPointClick={data => { showList(true); loadPointData(data) }} registerPredicate={registerPredicate} />
      </div>
    </div>
  </>;
}

export default Map;
