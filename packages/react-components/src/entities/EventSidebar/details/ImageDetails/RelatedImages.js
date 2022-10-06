
import { jsx } from '@emotion/react';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDone } from 'react-icons/md';
import ThemeContext from '../../../../style/themes/ThemeContext';
import * as css from '../../styles';
import { GalleryTiles, GalleryTile } from "../../../../components";
import { HyperText } from '../../../../components';
import { Group } from './Groups';

const QUERY_IMAGES = `
query images($query: String, $size: Int, $from: Int) {
  biocacheSearch(query: $query, size: $size, from: $from) {
    species
    imageMeta {
      imageIdentifier
      mimeType
      originalFileName
      sizeInBytes
      rights
      rightsHolder
      dateUploaded
      dateTaken
      imageUrl
      height
      width
      description
      title
      references
      publisher
      created
      creator
      license
      dataResourceUid
      recognisedLicence {
        acronym
        name
        url
        imageUrl
      }
    }
  }
}
`;

export function RelatedImages({
  occurrence,
  activeImage,
  setActiveImage,
  className,
  ...props
}) {

  // Setup query loading & theming
  const {
    data,
    error,
    loading,
    load
  } = useQuery(QUERY_IMAGES, { graph: 'EVENT'});
  const theme = useContext(ThemeContext);


  if (!loading && data.length === 0)
    return <div>no images to display</div>;

  return (
    <Group label="eventDetails.groups.relatedImages" defaultOpen={true}>
      <GalleryTiles>
        {!loading && data.map((image, i) => {
          return (
            <GalleryTile
              style={{ position: 'relative' }}
              onSelect={() => setActiveImage(image)}
              key={i}
              src={image.src}
              height={120}>
              {image.id === activeImage?.id ? (
                <span css={css.imageSelectCheck()}>
                  <MdDone />
                </span>
              ) : null}
            </GalleryTile>
          )
        })}
      </GalleryTiles>
    </Group>
  )
};