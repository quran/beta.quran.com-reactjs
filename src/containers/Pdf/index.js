import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as customPropTypes from 'customPropTypes';
// redux
import { connect } from 'react-redux';

import Helmet from 'react-helmet';

// components
import Container from 'components/Container';
import Verse from 'components/Verse';
import Bismillah from 'components/Bismillah';

// Helpers
import debug from 'helpers/debug';

class Pdf extends Component {
  hasVerses() {
    return Object.keys(this.props.verses).length;
  }

  renderVerses() {
    const {
      chapter,
      verses,
      options,
      isPlaying,
      isAuthenticated,
      currentVerse
    } = this.props; // eslint-disable-line no-shadow

    return Object.values(verses).map(verse => (
      <Verse
        verse={verse}
        chapter={chapter}
        currentVerse={currentVerse}
        iscurrentVerse={isPlaying && verse.verseKey === currentVerse}
        tooltip={options.tooltip}
        isPlaying={isPlaying}
        isAuthenticated={isAuthenticated}
        key={`${verse.chapterId}-${verse.id}-verse`}
        userAgent={options.userAgent}
        audio={options.audio}
        isPdf
      />
    ));
  }

  render() {
    const { chapter, options } = this.props; // eslint-disable-line no-shadow
    debug('component:Surah', 'Render');

    if (!this.hasVerses()) {
      return (
        <Container style={{ margin: '50px auto' }}>
          {this.renderNoAyah()}
        </Container>
      );
    }

    return (
      <div className="chapter-body">
        <Helmet
          style={[
            {
              cssText: `.text-arabic{font-size: ${
                options.fontSize.arabic
              }rem;} .text-translation{font-size: ${
                options.fontSize.translation
              }rem;}` // eslint-disable-line max-len
            }
          ]}
        />
        <Container className="container-fluid">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <Bismillah chapter={chapter} />
              {options.isReadingMode ? this.renderLines() : this.renderVerses()}
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

Pdf.propTypes = {
  chapter: customPropTypes.surahType.isRequired,
  lines: PropTypes.object.isRequired, // eslint-disable-line
  currentVerse: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired, // eslint-disable-line
  verses: customPropTypes.verses,
  isPlaying: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
  const chapterId = parseInt(ownProps.match.params.chapterId, 10);
  const chapter = state.chapters.entities[chapterId];
  const verses = state.verses.entities[chapterId];
  const verseArray = verses
    ? Object.keys(verses).map(key => parseInt(key.split(':')[1], 10))
    : [];
  const verseIds = new Set(verseArray);
  const lastAyahInArray = verseArray.slice(-1)[0];
  const isSingleAyah =
    !!ownProps.match.params.range && !ownProps.match.params.range.includes('-');
  const currentVerse = state.audioplayer.currentVerse || Object.keys(verses)[0];

  return {
    chapter,
    verses,
    verseIds,
    isSingleAyah,
    currentVerse,
    info: state.chapters.infos[ownProps.match.params.chapterId],
    isStarted: state.audioplayer.isStarted,
    isPlaying: state.audioplayer.isPlaying,
    currentWord: state.verses.currentWord,
    isEndOfSurah: lastAyahInArray === chapter.versesCount,
    chapters: state.chapters.entities,
    isLoading: state.verses.loading,
    isLoaded: state.verses.loaded,
    lines: state.lines.lines,
    options: state.options
  };
}

export default connect(mapStateToProps)(Pdf);
