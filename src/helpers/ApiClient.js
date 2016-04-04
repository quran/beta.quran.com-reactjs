import superagent from 'superagent';
import qs from 'qs';

import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;

  if (__SERVER__) {
    return `${config.api}${adjustedPath}`;
  }

  return `/api${adjustedPath}`;
}

export default class {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { auth, params, data, arrayFormat } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(qs.stringify(params, {arrayFormat: arrayFormat || 'brackets'}));
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        if (auth) {
          request.auth(...auth);
        }


        request.end((err, { body } = {}) => {console.log(err, body)});
      })
    );
  }
}
