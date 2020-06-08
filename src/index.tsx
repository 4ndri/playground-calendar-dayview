import * as React from 'react';
import { render } from 'react-dom';
import { Column } from './column';
import { getExtended } from './events.data';
const App: React.FC = () => {
  return (
    <div>
      <Column events={getExtended()} />
    </div>
  );
};

render(<App />, document.getElementById('app'));
