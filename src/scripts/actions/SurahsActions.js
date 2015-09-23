/* eslint-disable no-extra-boolean-cast, consistent-return */
import request from 'utils/Request';

import urlSettings from 'constants/Settings';
import debug from 'utils/Debug';

export function getSurahs(actionContext, payload) {
  if (actionContext.getStore('SurahsStore').hasAllSurahs()) {
    return;
  }

  debug('ACTIONS-SURAHS');

  return request.get(urlSettings.url + 'surahs')
  .end(function(err, res) {
    console.log(err);
    debug('SURAHS RECEIVED....');

    actionContext.dispatch('surahsReceived', {surahs: res.body, surah: payload});
  });
}

export function currentSurah(actionContext, payload, done) {
  actionContext.dispatch('currentSurahChange', payload);
  done();
}

export function showInfo(actionContext) {
  actionContext.dispatch('showInfo');
}
