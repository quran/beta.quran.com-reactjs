/* eslint-disable no-extra-boolean-cast, consistent-return */

import BaseStore from 'fluxible/addons/BaseStore';
import * as Font from 'utils/FontFace';
import debug from 'utils/Debug';

class AyahsStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.ayahs = [];
    this.readingMode = false;
    this.searchStats = {};
  }

  getAyahs() {
    return this.ayahs;
  }

  getLast() {
    if (this.ayahs.length) {
      return this.ayahs[this.ayahs.length - 1].ayah;
    }
    else {
      return 10;
    }
  }

  getLength() {
    return this.ayahs.length;
  }

  getSearchStats() {
    return this.searchStats;
  }

  isEmpty() {
    return this.ayahs.length === 0;
  }

  getFirstAndLast() {
    return [
      this.ayahs[0].ayah,
      this.ayahs[this.ayahs.length - 1].ayah
    ];
  }

  isReadingMode() {
    return this.readingMode;
  }

  getFontSize() {
    return this.fontSize;
  }

  // @TODO: build audio once the audioplayer is interacted with to save on memory and load.
  buildAudio(ayahs) {
    if (!~~ayahs.length) {
      return;
    }

    var firefox = /firefox/i,
        opera = /opera/i,
        chrome = /chrome/i,
        errorMessage = 'The current reciter does not have audio that suits' +
                        ' your browser. Either select another reciter or try' +
                        ' on another browser.',
        hasErrored = false;

    var throwError = function() {
      if (!hasErrored) {
        console.error('Not working');
        hasErrored = true;
      }
    };

    return ayahs.map(ayah => {
      if (hasErrored) {
        return ayah;
      }

      if(!ayah.audio) {
        return ayah;
      }

      if (typeof window === 'undefined') {
        if (!this.audioUserAgent) {
          throw new Error('WHAT!?! userAgent me please');
        }
        if (this.audioUserAgent.isOpera || this.audioUserAgent.isFirefox) {
          if (ayah.audio.ogg.url) {
            ayah.scopedAudio = new Audio(ayah.audio.ogg.url);
          } else {
            throwError();
          }
        } else {
          if (ayah.audio.mp3.url) {
            ayah.scopedAudio = new Audio(ayah.audio.mp3.url);
          }
          else if (ayah.audio.ogg.url) {
            if (this.audioUserAgent.isChrome) {
              ayah.scopedAudio = new Audio(ayah.audio.ogg.url);
            }
            else {
              throwError();
            }
          }
          else {
            throwError();
          }
        }
      }
      else {
        if (opera.test(window.navigator.userAgent) ||
            firefox.test(window.navigator.userAgent)) {
          if (ayah.audio.ogg.url) {
            ayah.scopedAudio = new Audio(ayah.audio.ogg.url);
          }
          else {
            throwError();
          }
        }
        else {
          if (ayah.audio.mp3.url) {
            ayah.scopedAudio = new Audio(ayah.audio.mp3.url);
          }
          else if (ayah.audio.ogg.url) {
            if (chrome.test(window.navigator.userAgent)) {
              ayah.scopedAudio = new Audio(ayah.audio.ogg.url);
            }
            else {
              throwError();
            }
          }
          else {
            throwError();
          }
        }
      }

      return ayah;
    });
  }

  dehydrate() {
    return {
      ayahs: this.ayahs,
      searchStats: this.searchStats
    };
  }

  rehydrate(state) {
    this.ayahs = state.ayahs;
    this.searchStats = state.searchStats;

    if (!!~~state.ayahs.length) {
      // Fixed the audio breaking if a single ayah was passed because
      // This was automatially setting buildAudio to 2 ayah.
      if(this.ayahs.length == 1){
        this.buildAudio([this.ayahs[0], this.ayahs[0]]);
      } else {
         this.buildAudio([this.ayahs[0], this.ayahs[1]]);
      }
    }
  }
}

AyahsStore.handlers = {
  ayahsReceived(payload) {
    debug('STORES-AYAHS RECEIVED');
    if (this.ayahs.length > 0) {
      if (payload.ayahs[0].ayah === this.ayahs[this.ayahs.length - 1].ayah + 1) {
        console.log('Ayahs: Lazy load');
        Font.createFontFaces(payload.ayahs);
        this.ayahs = this.ayahs.concat(payload.ayahs);

        // @TODO: Figure out why this was not here before...
        this.buildAudio(payload.ayahs);
      }
      else {
        if (this.ayahs[0].surah_id !== payload.ayahs[0].surah_id) {
          console.log('Ayahs: New surah');
        }
        else {
          console.error(
            'Failed to concat the ayahs',
            payload.ayahs[0].ayah,
            this.ayahs[this.ayahs.length - 1].ayah
          );
        }
        // Assuming this happens on new page
        Font.createFontFaces(payload.ayahs);
        this.ayahs = payload.ayahs;
        this.buildAudio([this.ayahs[0], this.ayahs[1]]);
      }
    }
    else {
      this.ayahs = payload.ayahs;

      if (typeof window !== 'undefined') {
        Font.createFontFaces(payload.ayahs);
        this.buildAudio([this.ayahs[0], this.ayahs[1]]);
      }
    }

    this.emitChange();
  },

  buildAllAudio(payload) {
    // The AyahsStore only builds the audio for the first 2 ayahs to conserve
    // bandwidth on the servers. Only when we need all the audios should it load
    // the remaining.
    this.buildAudio(this.ayahs);
  },

  ayahsUpdated(payload) {
    this.ayahs = payload.ayahs.map((ayah, index) => {
      return Object.assign(this.ayahs[index], ayah);
    });

    if (!!~payload.difference.indexOf('audio')) {
      this.buildAudio(this.ayahs);
    }

    this.emitChange();
  },

  userAgentReceived(payload) {
    this.audioUserAgent = payload;
    this.emitChange();
  },

  'NAVIGATE_START': function() {
    this.ayahs = [];
    this.emitChange();
  },

  searchReceived(payload) {
    debug('STORES-SEARCH RECEIVED');
    if (typeof window !== 'undefined') {
      Font.createFontFaces(payload.results);
    }

    this.ayahs = payload.results;
    this.searchStats = {
      query: payload.query,
      hits: payload.hits,
      page: payload.page,
      size: payload.size,
      took: payload.took,
      total: payload.total
    };

    this.emitChange();
  },

  toggleReadingMode() {
    this.readingMode = !this.readingMode;
    this.emitChange();
  }
};

AyahsStore.storeName = 'AyahsStore';

export default AyahsStore;
