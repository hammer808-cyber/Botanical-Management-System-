import React, { useState } from 'react';
import { PLANT_PLACEHOLDER } from '../lib/plantImage';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

/**
 * Plant image with graceful degradation: if the URL 404s (stale library
 * photo, dead link), swap to the neutral botanical placeholder instead of
 * showing a broken image.
 */
export default function PlantImage({ src, alt = '', ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !src ? PLANT_PLACEHOLDER : src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
