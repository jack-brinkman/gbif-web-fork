
import { jsx } from '@emotion/react';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDone } from 'react-icons/md';
import ThemeContext from '../../../../style/themes/ThemeContext';
import env from '../../../../../.env.json';
import * as css from '../../styles';

// Local components
import { RelatedImages } from './RelatedImages';
import { Header } from '../Header';
import { Group } from '../Groups';

// Project components
import {
  Properties,
  Image,
  GalleryTiles,
  GalleryTile,
  Spinner,
  HyperText
} from "../../../../components";
const { Term, Value } = Properties;

export function ImageDetails({
  data,
  className,
  ...props
}) {
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  // Setup query loading & theming
  const theme = useContext(ThemeContext);
  const IMAGE_HEIGHT = 350;
  // console.log('oldData', data);

  // useEffect(() => {
  //   if (data?.occurrence?.stillImages) setActiveImage(data?.occurrence?.stillImages[0]);
  // }, [data]);

  // if (!data?.occurrence?.stillImages) {
  //   return <div>no images to display</div>
  // }

  // Event handler for active images
  const handleActiveImage = (image) => {
    setLoading(true);
    setActiveImage(image);
  };

  return <div style={{ padding: '12px 0' }}>
    <Header data={data} />
    {activeImage && (
      <>
        <div css={css.imageContainer({ theme })}>
          {loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: IMAGE_HEIGHT
                }}>
              <Spinner />
            </div>
          )}
          <Image
            src={activeImage.imageUrl}
            h={IMAGE_HEIGHT.toString()}
            style={{
              display: loading ? 'none' : 'block',
              maxWidth: '100%',
              maxHeight: IMAGE_HEIGHT
            }}
            onLoad={() => setLoading(false)} />
        </div>
        <Group label="occurrenceDetails.about" defaultOpen={true}>
          <Properties css={css.properties}>
            {['title', 'description', 'creator', 'dateTaken', 'format', 'license','rightsHolder']
              .filter((property) => Boolean(activeImage[property]))
              .map((property) => (
                <React.Fragment key={property}>
                  <Term>
                    <FormattedMessage id={`images.details.${property}`} />
                  </Term>
                  <Value>
                    <HyperText text={activeImage[property]} />
                  </Value>
                </React.Fragment>
              ))}
              <>
                <Term>
                  <FormattedMessage id="images.details.originalFilename" />
                </Term>
                <Value>
                  {/* Hacky fix, for now */}
                  <HyperText text={env.IMAGE_VIEW_URL.replace('{imageIdentifier}', activeImage.imageIdentifier)} />
                </Value>
              </>
          </Properties>
        </Group>
      </>
    )}
    {data?.occurrence?.stillImages?.length > 1 &&
      <Group label="eventDetails.groups.images" defaultOpen={true}>
        <GalleryTiles>
          {data.occurrence.stillImages.map((image, i) => {
            return (
              <GalleryTile
                style={{ position: 'relative' }}
                onSelect={() => handleActiveImage(image)}
                key={i}
                src={image.src}
                height={120}>
                {image.imageIdentifier === activeImage?.imageIdentifier ? (
                  <span css={css.imageSelectCheck()}>
                    <MdDone />
                  </span>
                ) : null}
              </GalleryTile>
            )
          })}
        </GalleryTiles>
      </Group>
    }
    {data?.event?.occurrenceCount === 1 && (
      <RelatedImages
        data={data}
        activeImage={activeImage}
        setActiveImage={handleActiveImage} />
    )}
  </div>
};