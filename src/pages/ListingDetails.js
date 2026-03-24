import React, { useEffect, useRef } from 'react';
import { trackBehavior } from '../api';

const ListingDetails = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    trackBehavior('PAGE_VIEW', { page: 'ListingDetails' });
  }, []);

  useEffect(() => {
    if (window.MBB && typeof window.MBB.loaded === 'function') {
      window.MBB.loaded();
    }
  }, []);

  return (
    <div ref={containerRef} style={{ paddingTop: 70, minHeight: '100vh' }}>
      <bb-widget data-type="SearchDetails"></bb-widget>
    </div>
  );
};

export default ListingDetails;
