/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import * as React from 'react';
import { render } from 'react-dom';
import Column from './column';
import ColumnPrim from './column-primitive';
import { getExtended } from './events.data';

const colsStyle = css`
  display: flex;
  flex-direction: row;
`;

const App: React.FC = () => {
  return (
    <div css={colsStyle}>
      <div><Column events={getExtended()} /></div>
      <div><ColumnPrim events={getExtended()} /></div>
      <div><Column events={getExtended()} /></div>
      <div><ColumnPrim events={getExtended()} /></div>
      <div><Column events={getExtended()} /></div>
    </div>
  );
};

render(<App />, document.getElementById('app'));
