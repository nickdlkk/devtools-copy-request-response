import React from 'react';
import { observer } from 'mobx-react';
import navigationStore from './stores/NavigationStore';
import Home from './components/Home';
import Detail from './components/Detail';

const App: React.FC = () => {
    return (
        <div>
            <h1>Mini Fiddler</h1>
            <p>App component is working!</p>
            <div style={{ padding: '20px' }}>
                {navigationStore.currentPage === 'home' && <Home />}
                {navigationStore.currentPage === 'detail' && <Detail />}
            </div>
        </div>
    );
};

export default observer(App); 