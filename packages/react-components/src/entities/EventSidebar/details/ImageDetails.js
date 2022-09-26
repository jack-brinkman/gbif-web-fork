
import { jsx } from '@emotion/react';
import React, { useContext, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDone } from 'react-icons/md';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Properties, Image, GalleryTiles, GalleryTile } from "../../../components";
import { Header } from './Header';
import { HyperText } from '../../../components';
import { Group } from './Groups';
const { Term, Value } = Properties;

export function ImageDetails({
  data: oldData,
  activeImage,
  setActiveImage,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const data = {
    occurrence: {
      stillImages: [
        {
          src: `https://via.placeholder.com/150x150`,
          scientificName: 'Puma concolor Linneaus',
          description: 'Observed in Denmark 19 Januar 2017'
        },
        {
          src: `https://via.placeholder.com/200x150`,
          scientificName: 'Flabellina',
          description: 'Catched in Spain 25 Febrary 2019'
        },
        {
          src: `https://via.placeholder.com/150x150`,
          scientificName: 'Puma concolor Linneaus',
          description: 'Observed in Denmark 19 Januar 2017'
        },
        {
          src: `https://via.placeholder.com/100x150`,
          scientificName: 'Flabellina',
          description: 'Catched in Spain 25 Febrary 2019'
        }
      ]
    }
  };

  useEffect(() => {
    if (data?.occurrence?.stillImages) setActiveImage(data?.occurrence?.stillImages[0]);
  }, [data]);

  if (!data?.occurrence?.stillImages) {
    return <div>no images to display</div>
  }

  return <div style={{ padding: '12px 0' }}>
    <Header data={oldData} />
    {/* {activeImage && (
      <>
        <div css={css.imageContainer({ theme })}>
          <Image src={activeImage.identifier} h="450" style={{ maxWidth: '100%', maxHeight: 450 }} />
        </div>
        <Group label="occurrenceDetails.about" defaultOpen={data?.occurrence?.stillImages?.length === 1}>
          <Properties css={css.properties}>
            {['description', 'type', 'format', 'identifier', 'created', 'creator', 'license', 'publisher', 'references', 'rightsholder']
              .filter(x => !!activeImage[x]).map(x => <React.Fragment key={x}>
                <Term>
                  <FormattedMessage id={`occurrenceFieldNames.${x}`} />
                </Term>
                <Value>
                  <HyperText text={activeImage[x]} />
                </Value>
              </React.Fragment>)}
          </Properties>
        </Group>
      </>
    )} */}
    {data?.occurrence?.stillImages?.length > 1 &&
      <Group label="eventDetails.groups.images" defaultOpen={true}>
        <GalleryTiles>
          {data.occurrence.stillImages.map((x, i) => {
            return <GalleryTile onSelect={() => setActiveImage(x)} key={i} src={x.src} height={120}>
              {x === activeImage ? <span style={{ background: 'black', color: 'white', padding: '5px 5px 2px 5px' }}>
                <MdDone />
              </span> : null}
            </GalleryTile>
          })
          }
          <div></div>
        </GalleryTiles>
      </Group>
    }
  </div>
};