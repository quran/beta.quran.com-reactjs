import cookie from 'react-cookie';
import {
  SET_OPTION,
  SET_USER_AGENT,
  FETCH_RECITERS,
  FETCH_TRANSLATIONS
} from '../constants/options.js';
import ApiClient from '../../helpers/ApiClient';

const client = new ApiClient();

export function isReadingMode(globalState) {
  return !!globalState.options.isReadingMode;
}

export function isNightMode(globalState) {
  return !!globalState.options.isNightMode;
}

export function setOption(payload) {
  const options = cookie.load('options') || {}; // protect against first timers.

  Object.keys(payload).forEach((option) => {
    options[option] = payload[option];
  });
  cookie.save('options', JSON.stringify(options));

  return {
    type: SET_OPTION,
    payload
  };
}

export function setUserAgent(userAgent) {
  return {
    type: SET_USER_AGENT,
    userAgent
  };
}

export const loadTranslations = () => ({
  types: [
    FETCH_TRANSLATIONS.ACTION,
    FETCH_TRANSLATIONS.SUCCESS,
    FETCH_TRANSLATIONS.FAILURE
  ],
  promise: client.get('/api/v3/options/translations')
});

export const loadRecitations = () => ({
  types: [
    FETCH_RECITERS.ACTION,
    FETCH_RECITERS.SUCCESS,
    FETCH_RECITERS.FAILURE
  ],
  promise: client.get('/api/v3/options/recitations')
});
