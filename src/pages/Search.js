import React, { useEffect } from 'react';
import { trackBehavior } from '../api';

const IDX_URL = 'https://matrix.recolorado.com/Matrix/public/IDX.aspx?idx=b094320f';

const SearchPage = () => {
  useEffect(() => {
    trackBehavior('PAGE_VIEW', { page: 'Search' });
  }, []);

  return (
    <div style={{ paddingTop: 70, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <iframe
        src={IDX_URL}
        title="Colorado MLS Property Search"
        style={{ flex: 1, display: 'block', border: 'none', width: '100%', height: '100%' }}
        frameBorder="0"
        scrolling="yes"
        allowFullScreen
      />
    </div>
  );
};

export default SearchPage;
