import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import chapters from './chapters';
import verses from './verses';
import audioplayer from './audioplayer';
import lines from './lines';
import options from './options';
import searchResults from './searchResults';
import suggestResults from './suggestResults';
import fontFaces from './fontFaces';
import auth from './auth';
import bookmarks from './bookmarks';
import media from './media';
import footNote from './footNote';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  bookmarks,
  media,
  chapters,
  verses,
  audioplayer,
  fontFaces,
  lines,
  searchResults,
  suggestResults,
  options,
  footNote
});
