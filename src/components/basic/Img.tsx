import React from 'react';

export const Img = React.forwardRef<HTMLImageElement, React.ComponentPropsWithoutRef<'img'>>(({ className = '', ...props }, ref) =>
  <img {...props} ref={ref} className={className} />);

Img.displayName = 'Img';
