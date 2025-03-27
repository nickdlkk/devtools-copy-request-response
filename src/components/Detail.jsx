import React from 'react';
import { observer } from 'mobx-react';
import navigationStore from '../stores/NavigationStore';

const Detail = () => {
  return (
    <div>
      <button 
        style={{ position: 'absolute', top: '10px', left: '10px' }}
        onClick={() => navigationStore.navigateTo('home')}
      >
        Back
      </button>
      <h1>Detail Page</h1>
      <p>This is the detail page content.</p>
    </div>
  );
};

export default observer(Detail); 