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
import { MdOutlineLayers, MdZoomIn, MdZoomOut, MdLanguage } from 'react-icons/md'
import { ViewHeader } from '../ViewHeader';
import MapComponentMB from './MapboxMap';
import MapComponentOL from './OpenlayersMap';
import * as css from './map.styles';
import env from '../../../../../.env.json';
import SiteContext from '../../../../dataManagement/SiteContext';
import { FormattedMessage } from 'react-intl';

function getMapStyles({ apiKeys = {}, language = 'en' }) {
  const natural = `styleName=natural&background=${encodeURIComponent('#e5e9cd')}&language=${language}&pixelRatio=2`;
  const light = `styleName=geyser&background=${encodeURIComponent('#f3f3f1')}&language=${language}&pixelRatio=2`;
  const dark = `styleName=tuatara&background=${encodeURIComponent('#363332')}&language=${language}&pixelRatio=2`;
  return {
    ARCTIC: {
      GBIF_NATURAL: {
        labelKey: 'map.styles.gbif_natural',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3575/gbif-raster?${natural}`,
          projection: 'EPSG_3575'
        }
      },
      GBIF_LIGHT: {
        labelKey: 'map.styles.gbif_light',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3575/gbif-raster?${light}`,
          projection: 'EPSG_3575'
        }
      },
      GBIF_DARK: {
        labelKey: 'map.styles.gbif_dark',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3575/gbif-raster?${dark}`,
          projection: 'EPSG_3575'
        }
      },
    },
    PLATE_CAREE: {
      GBIF_NATURAL: {
        labelKey: 'map.styles.gbif_natural',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/4326/gbif-raster?${natural}`,
          projection: 'EPSG_4326'
        }
      },
      GBIF_LIGHT: {
        labelKey: 'map.styles.gbif_light',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/4326/gbif-raster?${light}`,
          projection: 'EPSG_4326'
        }
      },
      GBIF_DARK: {
        labelKey: 'map.styles.gbif_dark',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/4326/gbif-raster?${dark}`,
          projection: 'EPSG_4326'
        }
      }
    },
    MERCATOR: {
      SATELLITE: {
        labelKey: 'map.styles.satellite',
        component: MapComponentMB,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3857/satellite_maptiler?maptilerApiKey=${apiKeys.maptiler}`,
          projection: 'EPSG_3857'
        }
      },
      GBIF_NATURAL2: {
        labelKey: 'map.styles.gbif_natural',
        component: MapComponentMB,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3857/gbif-raster?${natural}`,
          projection: 'EPSG_3857'
        }
      },
      GBIF_NATURAL: {
        labelKey: 'map.styles.gbif_natural',
        component: MapComponentMB,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3857/gbif-raster-hillshade?${natural}&maptilerApiKey=${apiKeys.maptiler}`,
          projection: 'EPSG_3857'
        }
      },
      GBIF_LIGHT: {
        labelKey: 'map.styles.gbif_light',
        component: MapComponentMB,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3857/gbif-raster?${light}`,
          projection: 'EPSG_3857'
        }
      },
      GBIF_DARK: {
        labelKey: 'map.styles.gbif_dark',
        component: MapComponentMB,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3857/gbif-raster?${dark}`,
          projection: 'EPSG_3857'
        }
      },
      MAPTILER_OUTDOOR: {
        labelKey: 'map.styles.outdoor',
        component: MapComponentMB,
        mapConfig: {
          basemapStyle: `https://api.maptiler.com/maps/outdoor/style.json?key=${apiKeys.maptiler}`,
          projection: 'EPSG_3857'
        } 
      },
      MAPBOX_BRIGHT: {
        labelKey: 'map.styles.gbif_light',
        alternative: 'GBIF_LIGHT',
        component: MapComponentMB,
        mapConfig: {
          basemapStyle: `https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=${apiKeys.mapbox}`,
          projection: 'EPSG_3857'
        } 
      }
    },
    ANTARCTIC: {
      GBIF_NATURAL: {
        labelKey: 'map.styles.gbif_natural',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3031/gbif-raster?${natural}`,
          projection: 'EPSG_3031'
        }
      },
      GBIF_LIGHT: {
        alternative: 'MAPBOX_BRIGHT',
        labelKey: 'map.styles.gbif_light',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3031/gbif-raster?${light}`,
          projection: 'EPSG_3031'
        }
      },
      GBIF_DARK: {
        labelKey: 'map.styles.gbif_dark',
        component: MapComponentOL,
        mapConfig: {
          basemapStyle: `${env.MAP_STYLES}/3031/gbif-raster?${dark}`,
          projection: 'EPSG_3031'
        }
      }
    }
  }
}

const defaultProjectionOptions = ['MERCATOR'];
const defaultLayerOptions = {
  ARCTIC: ['GBIF_NATURAL', 'GBIF_LIGHT', 'GBIF_DARK'],
  PLATE_CAREE: ['GBIF_NATURAL', 'GBIF_LIGHT', 'GBIF_DARK'],
  MERCATOR: ['GBIF_LIGHT', 'GBIF_DARK'],
  ANTARCTIC: ['GBIF_NATURAL', 'GBIF_LIGHT', 'GBIF_DARK']
};

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);
  const siteContext = useContext(SiteContext);
  
  const supportedProjections = siteContext?.maps?.supportedProjections || defaultProjectionOptions;
  const [projectionOptions, setProjectionOptions] = useState(supportedProjections);
  let defaultProjection = sessionStorage.getItem('defaultOccurrenceProjection') || siteContext?.maps?.defaultProjection || supportedProjections[0];
  if (!supportedProjections.includes(defaultProjection)) {
    defaultProjection = supportedProjections[0];
  }
  const [projection, setProjection] = useState(defaultProjection);

  const mapStyles = siteContext?.maps?.mapStyles || defaultLayerOptions;
  let defaultStyle = sessionStorage.getItem('defaultOccurrenceLayer') || siteContext?.maps?.defaultMapStyle || 'GBIF_LIGHT';
  if (!mapStyles?.[defaultProjection]?.includes(defaultStyle)) {
    defaultStyle = mapStyles?.[defaultProjection]?.[0];
  }
  
  const [layerOptions, setLayerOptions] = useState(mapStyles);
  const [layerId, setLayerId] = useState(defaultStyle);
  const [latestEvent, broadcastEvent] = useState();
  const [basemapOptions, setBasemapOptions] = useState();
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const [listVisible, showList] = useState(false);

  const items = pointData?.occurrenceSearch?.documents?.results || [];

  useEffect(() => {
    const mapStyles = getMapStyles({ apiKeys: siteContext.apiKeys });
    setBasemapOptions(mapStyles);
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

  const menuLayerOptions = menuState => layerOptions?.[projection].map((layerId) => <MenuAction key={layerId} onClick={() => {
    setLayerId(layerId);
    sessionStorage.setItem('defaultOccurrenceLayer', layerId);
  }}>
    <FormattedMessage id={basemapOptions?.[projection]?.[layerId]?.labelKey || 'unknown'} defaultMessage={layerId.name || 'unknown'} />
  </MenuAction>);

  const projectionMenuOptions = menuState => projectionOptions.map((proj, i) => <MenuAction key={proj} onClick={() => {
    setProjection(proj);
    sessionStorage.setItem('defaultOccurrenceProjection', proj);
  }}>
    <FormattedMessage id={`map.projections.${proj}`} defaultMessage={proj} />
  </MenuAction>);

  const fallbackLayer = layerOptions[projection][0];
  const mapConfiguration = basemapOptions?.[projection]?.[layerId] || basemapOptions?.[projection]?.[fallbackLayer];

  if (!basemapOptions || !mapConfiguration) return null;
  const MapComponent = mapConfiguration.component || MapComponentOL;

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
          {projectionOptions.length > 1 && <Menu style={{ display: 'inline-block' }}
            aria-label="Select projection"
            trigger={<Button appearance="text"><MdLanguage /></Button>}
            items={projectionMenuOptions}
          />}
          {layerOptions?.[projection]?.length > 1 && <Menu style={{ display: 'inline-block' }}
            aria-label="Select layers"
            trigger={<Button appearance="text"><MdOutlineLayers /></Button>}
            items={menuLayerOptions}
          />}
        </div>
        <MapComponent mapConfig={mapConfiguration.mapConfig} latestEvent={latestEvent} defaultMapSettings={defaultMapSettings} predicateHash={predicateHash} q={q} css={css.mapComponent({ theme })} theme={theme} query={query} onMapClick={e => showList(false)} onPointClick={data => { showList(true); loadPointData(data) }} registerPredicate={registerPredicate} />
      </div>
    </div>
  </>;
}

export default Map;
