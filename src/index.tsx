import * as React from 'react';
import { render } from 'react-dom';
import { Column } from './column';
import { items } from './events.data';
const App: React.FC = () => {
  return (
    <div>
      <Column events={items} />
    </div>
  );
};

render(<App />, document.getElementById('app'));
