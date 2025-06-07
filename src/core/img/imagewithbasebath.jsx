import React from "react";
import { image_path } from "../../environment";
import PropTypes from "prop-types";

const ImageWithBasePath = ({ className, src, alt, height, width, id }) => {
  const fullSrc = `${image_path}${src}`;
  return (
    <img
      className={className}
      src={fullSrc}
      height={height}
      alt={alt}
      width={width}
      id={id}
    />
  );
};

// PropTypes for type validation
ImageWithBasePath.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
};

export default ImageWithBasePath;
