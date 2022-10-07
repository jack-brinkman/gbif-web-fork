
import React, { useEffect, useState } from 'react';
import { MdDone } from 'react-icons/md';
import { useQuery } from '../../../../dataManagement/api';
import { Group } from '../Groups';
import { Button } from '../../../../components';
import * as css from '../../styles';

// Project components
import {
  GalleryTiles,
  GalleryTile,
} from "../../../../components";
import { image } from '../../../../components/ZoomableImage/styles';

const QUERY_IMAGES = `
query images($search: String, $size: Int, $from: Int, $sort: String, $dir: String, $facet: String, $filters: [String]) {
  result: biocacheSearch(search: $search, size: $size, from: $from, sort: $sort, dir: $dir, facet: $facet, filters: $filters) {
    total: totalRecords
    occurrences {
      species
      meta: imageMeta {
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
}
`;

export function RelatedImages({
  data: eventData,
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
  } = useQuery(QUERY_IMAGES, { lazyLoad: true, graph: 'EVENT'});

  // Component state variables
  const [offset, setOffset] = useState(0);
  const [occurrence] = eventData?.event?.occurrences;
  const [occurrences, setOccurrences] = useState([]);

  // Effect hook to store the query output in component state
  useEffect(() => {
    if (data)
      setOccurrences([
        ...occurrences,
        ...data.result.occurrences.map((occ) => occ.meta)
      ]);
  }, [data]);

  // Effect hook to automatically load the data when the offset/related occurrence changes
  useEffect(() => {
    if (occurrence.speciesKey || occurrence.genusKey) {
      load({
        keepDataWhileLoading: true,
        variables: {
          search: `lsid:${occurrence.speciesKey || occurrence.genusKey}`,
          size: 15,
          from: offset,
          sort: 'identification_qualifier_s',
          facet: 'off',
          dir: 'asc',
          filters: [
            'multimedia:"Image"',
            '-type_status:*',
            '-basis_of_record:PreservedSpecimen',
            '-identification_qualifier_s:"Uncertain"',
            'geospatial_kosher:true',
            '-user_assertions:50001',
            '-user_assertions:50005',
          ]
        }
      });
    }
  }, [occurrence, offset]);

  if (data && occurrences.length === 0)
    return <div>no images to display</div>;

  return (
    <Group
      label="eventDetails.groups.relatedImages"
      labelValues={{ taxon: occurrence.species || occurrence.genus }}
      defaultOpen={true}>
      <GalleryTiles>
        {data && occurrences.map((image) => {
          return (
            <GalleryTile
              style={{ position: 'relative' }}
              onSelect={() => setActiveImage(image)}
              key={image.imageIdentifier}
              src={image.imageUrl}
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
      {data && occurrences.length <= data.result.total - 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <Button
            disabled={loading}
            onClick={() => setOffset(offset + 15)}
            look='primaryOutline'
            style={{ fontSize: '11px' }}>
              Load More
          </Button>
        </div>
      )}
    </Group>
  )
};