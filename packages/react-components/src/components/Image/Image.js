import React from 'react';
import PropTypes from 'prop-types';

export const getImageSrc = ({ src, w='', h='' }) => `https://api.gbif.org/v1/image/unsafe/${w}x${h}/${encodeURIComponent(src)}`;

export const Image = React.forwardRef(({
  src,
  w = '',
  h = '',
  onLoad = null,
  ...props
}, ref) => {
  return (
    <img
      src={getImageSrc({src, w, h, onLoad})}
      onLoad={(e) => { if (onLoad) onLoad(e) }}
      ref={ref}
      {...props}
    />
  )
});

Image.propTypes = {
  src: PropTypes.string.isRequired,
  w: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  h: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Image.getImageSrc = getImageSrc;
