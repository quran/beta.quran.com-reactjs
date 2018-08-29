import cookie from 'react-cookie';

import { SET_OPTION, SET_USER_AGENT } from '../constants/settings';
import { SettingsShape } from '../../shapes';

const options = cookie.load('options') || {};

export const INITIAL_STATE: SettingsShape = {
  isReadingMode: options.isReadingMode || false,
  isNightMode: options.isNightMode || false,
  isShowingChapterInfo: options.isShowingChapterInfo || false,
  audio: options.audio || 7, // Mishari Rashid al-`Afasy
  translations: options.translations || [102], // Clear Quran with footnotes
  tooltip: options.tooltip || 'translation',
  fontSize: options.fontSize || {
    arabic: 3.5,
    translation: 2,
  },
  userAgent: undefined,
};

export default (state = INITIAL_STATE, action: $TsFixMe) => {
  switch (action.type) {
    case SET_OPTION: {
      const { payload } = action;

      return {
        ...state,
        ...payload,
      };
    }
    case SET_USER_AGENT: {
      const { payload } = action;

      return {
        ...state,
        userAgent: payload,
      };
    }
    default:
      return state;
  }
};
