/* global window, document */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as customPropTypes from 'customPropTypes';
import { Link } from 'react-router-dom';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Helmet from 'react-helmet';
import Loadable from 'react-loadable';

// components
import Loader from 'quran-components/lib/Loader';
import LazyLoad from 'components/LazyLoad';
import Verse from 'components/Verse';
import Container from 'components/Container';
import ComponentLoader from 'components/ComponentLoader';
import Bismillah from 'components/Bismillah';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';

// Helpers
import makeHeadTags from 'helpers/makeHeadTags';
import debug from 'helpers/debug';

import * as AudioActions from 'redux/actions/audioplayer.js';
import * as AyahActions from 'redux/actions/verses.js';
import * as OptionsActions from 'redux/actions/options.js';
import * as MediaActions from 'redux/actions/media.js';

const LoaderStyle = { position: 'relative', overflow: 'hidden' };

const PageView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "PageView" */ 'components/PageView'),
  LoadingComponent: ComponentLoader
});

const Audioplayer = Loadable({
  loader: () =>
    import(/* webpackChunkName: "Audioplayer" */ 'components/Audioplayer'),
  LoadingComponent: ComponentLoader
});
const ChapterInfoPanelContainer = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ChapterInfo" */ 'containers/ChapterInfoPanelContainer'),
  LoadingComponent: ComponentLoader
});
const TopOptions = Loadable({
  loader: () =>
    import(/* webpackChunkName: "TopOptions" */ 'components/TopOptions'),
  LoadingComponent: ComponentLoader
});

class Chapter extends Component {
  state = {
    lazyLoading: false,
    sidebarOpen: false
  };

  //
  // See utils/routeFilters, we're already making sure surah and ayah are valid on router level
  // componentWillMount() {
  //   const { match: { params }, chapter, actions } = this.props; // eslint-disable-line no-shadow
  //
  //   if (params.range && params.range.includes('-')) {
  //     const start = parseInt(params.range.split('-')[0], 10);
  //
  //     if (start > chapter.versesCount || isNaN(start)) {
  //       return actions.push.push('/error/invalid-verse-range');
  //     }
  //
  //     return false;
  //   }
  //
  //   return false;
  // }

  // componentDidMount() {
  //   const { verses, options: { audio } } = this.props;

  //   Object.values(verses).forEach((verse) => {
  //     this.props.actions.audio.load({
  //       chapterId: verse.chapterId,
  //       verseId: verse.id,
  //       verseKey: verse.verseKey,
  //       audio
  //     });
  //   });
  // }

  // // TODO: Should this belong here?
  // componentWillReceiveProps(nextProps) {
  //   if (this.props.options.audio !== nextProps.options.audio) {
  //     const { verses, options: { audio } } = nextProps;

  //     Object.values(verses).forEach((verse) => {
  //       this.props.actions.audio.load({
  //         chapterId: verse.chapterId,
  //         verseId: verse.id,
  //         verseKey: verse.verseKey,
  //         audio
  //       });
  //     });
  //   }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    const conditions = [
      this.state.lazyLoading !== nextState.lazyLoading,
      this.state.sidebarOpen !== nextState.sidebarOpen,
      this.props.chapter !== nextProps.chapter,
      this.props.isEndOfSurah !== nextProps.isEndOfSurah,
      this.props.verseIds.length !== nextProps.verseIds.length,
      this.props.chapters !== nextProps.chapters,
      this.props.isLoading !== nextProps.isLoading,
      this.props.isLoaded !== nextProps.isLoaded,
      this.props.options !== nextProps.options,
      this.props.currentVerse !== nextProps.currentVerse,
      this.props.isPlaying !== nextProps.isPlaying
    ];

    return conditions.some(condition => condition);
  }

  getLast() {
    const { verseIds } = this.props;

    return [...verseIds][[...verseIds].length - 1];
  }

  getFirst() {
    const { verseIds } = this.props;

    return [...verseIds][0];
  }

  handleLazyLoadAyahs = (callback) => {
    const { verseIds, chapter, isEndOfSurah, options, actions } = this.props; // eslint-disable-line no-shadow, max-len
    const range = [this.getFirst(), this.getLast()];

    const size = 10;
    const from = range[1];
    const to = from + size;
    const paging = { offset: from, limit: to - from };

    if (!isEndOfSurah && !verseIds.has(to)) {
      actions.verse.load(chapter.chapterNumber, paging, options).then(() => {
        this.setState({ lazyLoading: false });
        return callback && callback();
      });
    }

    return false;
  };

  title() {
    const { match: { params }, chapter } = this.props;

    if (params.range) {
      return `Surah ${chapter.nameSimple} [${chapter.chapterNumber}:${
        params.range
      }]`;
    }

    return `Surah ${chapter.nameSimple} [${chapter.chapterNumber}]`;
  }

  description() {
    const { match: { params }, verses, chapter, info } = this.props;

    if (params.range) {
      if (params.range.includes('-')) {
        const [from, to] = params.range
          .split('-')
          .map(num => parseInt(num, 10));
        const array = Array(to - from).fill(from);
        const translations = array.map((fromAyah, index) => {
          const verse = verses[`${chapter.chapterNumber}:${fromAyah + index}`];

          if (verse && verse.content && verse.content[0]) {
            return verse.content[0].text;
          }

          return '';
        });

        const content = translations.join(' - ').slice(0, 250);

        return `Surat ${chapter.nameSimple} [verse ${
          params.range
        }] - ${content}`;
      }

      const verse = verses[`${chapter.chapterNumber}:${params.range}`];

      if (verse && verse.content && verse.content[0]) {
        return `Surat ${chapter.nameSimple} [verse ${params.range}] - ${
          verse.content[0].text
        }`;
      }

      return `Surat ${chapter.nameSimple} [verse ${params.range}]`;
    }

    return `${info ? info.shortText : ''} This Surah has ${
      chapter.versesCount
    } ayah and resides between pages ${chapter.pages[0]} to ${
      chapter.pages[1]
    } in the Holly Quran.`; // eslint-disable-line max-len
  }

  renderPagination() {
    const {
      isSingleAyah,
      isLoading,
      isEndOfSurah,
      chapter,
      options,
      actions
    } = this.props;
    const translations = (options.translations || []).join(',');

    // If single verse, eh. /2/30
    if (isSingleAyah) {
      const to =
        this.getFirst() + 10 > chapter.versesCount
          ? chapter.versesCount
          : this.getFirst() + 10;

      return (
        <ul className="pager">
          <li className="text-center">
            <Link
              to={`/${
                chapter.chapterNumber
              }/${this.getFirst()}-${to}?translations=${translations}`}
            >
              <LocaleFormattedMessage
                id="chapter.index.continue"
                defaultMessage="Continue"
              />
            </Link>
          </li>
        </ul>
      );
    }

    return (
      <LazyLoad
        onLazyLoad={this.handleLazyLoadAyahs}
        isEnd={isEndOfSurah && !isLoading}
        isLoading={isLoading}
        endComponent={
          <ul className="pager">
            {chapter.chapterNumber > 1 && (
              <li className="previous">
                <Link
                  to={`/${chapter.chapterNumber * 1 -
                    1}?translations=${translations}`}
                >
                  ←
                  <LocaleFormattedMessage
                    id="chapter.previous"
                    defaultMessage="Previous Surah"
                  />
                </Link>
              </li>
            )}
            <li className="text-center">
              <Link
                to={`/${chapter.chapterNumber}?translations=${translations}`}
                onClick={() =>
                  actions.verse.setCurrentVerse(
                    `${chapter.chapterNumber}:${this.getFirst()}`
                  )
                }
              >
                <LocaleFormattedMessage
                  id="chapter.goToBeginning"
                  defaultMessage="Beginning of Surah"
                />
              </Link>
            </li>
            {chapter.chapterNumber < 114 && (
              <li className="next">
                <Link
                  to={`/${chapter.chapterNumber * 1 +
                    1}?translations=${translations}`}
                >
                  <LocaleFormattedMessage
                    id="chapter.next"
                    defaultMessage="Next Surah"
                  />
                  →
                </Link>
              </li>
            )}
          </ul>
        }
        loadingComponent={
          <Loader isActive={isLoading} relative style={LoaderStyle} />
        }
      />
    );
  }

  renderVerses() {
    const {
      chapter,
      verses,
      actions,
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
        audioActions={actions.audio}
        mediaActions={actions.media}
        isPlaying={isPlaying}
        isAuthenticated={isAuthenticated}
        key={`${verse.chapterId}-${verse.id}-verse`}
        userAgent={options.userAgent}
        audio={options.audio}
      />
    ));
  }

  renderLines() {
    const { lines, options, currentVerse, isPlaying, actions } = this.props;
    const keys = Object.keys(lines);

    return (
      <PageView
        lines={lines}
        keys={keys}
        options={options}
        currentVerse={currentVerse}
        audioActions={actions.audio}
        isPlaying={isPlaying}
      />
    );
  }

  render() {
    const { chapter, verses, options, currentVerse } = this.props; // eslint-disable-line no-shadow
    debug('component:Chapter', 'Render');

    return (
      <div className="chapter-body">
        <Helmet
          {...makeHeadTags({
            title: this.title(),
            description: this.description()
          })}
          script={[
            {
              type: 'application/ld+json',
              innerHTML: `{
              "@context": "http://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@id": "https://quran.com/",
                  "name": "Quran"
                }
              },{
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@id": "https://quran.com/${chapter.chapterNumber}",
                  "name": "${chapter.nameSimple}"
                }
              }]
            }`
            }
          ]}
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
            <ChapterInfoPanelContainer chapter={chapter} />
            <div className="col-md-10 col-md-offset-1">
              {__CLIENT__ && <TopOptions chapter={chapter} />}
              <Bismillah chapter={chapter} />
              {options.isReadingMode ? this.renderLines() : this.renderVerses()}
            </div>
            <div className="col-md-10 col-md-offset-1">
              {this.renderPagination()}
            </div>
          </div>
        </Container>

        {__CLIENT__ && ( // eslint-disable-line
          <Audioplayer
            chapter={chapter}
            verses={verses}
            currentVerse={verses[currentVerse]}
            onLoadAyahs={this.handleLazyLoadAyahs}
          />
        )}
      </div>
    );
  }
}

Chapter.propTypes = {
  chapter: customPropTypes.chapterType.isRequired,
  chapters: customPropTypes.chapters.isRequired,
  actions: PropTypes.object.isRequired, // eslint-disable-line
  lines: PropTypes.object.isRequired, // eslint-disable-line
  isEndOfSurah: PropTypes.bool.isRequired,
  verseIds: PropTypes.instanceOf(Set),
  currentVerse: PropTypes.string,
  info: customPropTypes.infoType,
  isLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isSingleAyah: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool,
  options: PropTypes.object.isRequired, // eslint-disable-line
  match: PropTypes.shape({
    params: PropTypes.shape({
      chapterId: PropTypes.string.isRequired
    })
  }).isRequired,
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

  const currentVerse = state.audioplayer.currentVerse
    ? state.audioplayer.currentVerse.verseKey
    : Object.keys(verses)[0];

  return {
    chapter,
    verses,
    verseIds,
    isSingleAyah,
    currentVerse,
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

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      options: bindActionCreators(OptionsActions, dispatch),
      verse: bindActionCreators(AyahActions, dispatch),
      audio: bindActionCreators(AudioActions, dispatch),
      media: bindActionCreators(MediaActions, dispatch),
      push: bindActionCreators(push, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chapter);
