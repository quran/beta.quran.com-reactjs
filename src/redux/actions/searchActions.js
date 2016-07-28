import { ayahsSchema } from '../schemas';
import { arrayOf } from 'normalizr';

import {
  SEARCH,
  SEARCH_SUCCESS,
  SEARCH_FAIL
  } from '../constants/searchActionTypes.js';

export function search(params) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    schema: {results: arrayOf({ayah: ayahsSchema})},
    promise: (client) => client.get('/v2/search', { params }),
    params
  };
}

export function isQueried() {
  return false;
}
