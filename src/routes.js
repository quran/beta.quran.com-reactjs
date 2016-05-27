import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';

import App from './containers/App';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute getComponent={(nextState, cb) => System.import('./containers/Home').then(module => cb(null, module))} />

      <Route path="/donations" getComponent={(nextState, cb) => System.import('./containers/Donations').then(module => cb(null, module))} />
      <Route path="/contributions" getComponent={(nextState, cb) => System.import('./containers/Donations').then(module => cb(null, module))} />

      <Route path="/about" getComponent={(nextState, cb) => System.import('./containers/About').then(module => cb(null, module))} />

      <Route path="/contact" getComponent={(nextState, cb) => System.import('./containers/Contact').then(module => cb(null, module))} />
      <Route path="/contactus" getComponent={(nextState, cb) => System.import('./containers/Contact').then(module => cb(null, module))} />

      <Route path="/search" getComponent={(nextState, cb) => System.import('./containers/Search').then(module => cb(null, module))} />

      <Route path="/:surahId(/:range)" getComponent={(nextState, cb) => System.import('./containers/Surah').then(module => cb(null, module)).catch(err => console.trace(err))} />
    </Route>
  );
}
