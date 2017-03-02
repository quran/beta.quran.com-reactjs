import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { Element } from 'react-scroll';

import { verseType, matchType, surahType } from 'types';
import Share from 'components/Share';
import Copy from 'components/Copy';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';
import Translation from 'components/Translation';
import Word from 'components/Word';

import debug from 'helpers/debug';

const styles = require('./style.scss');

export default class Verse extends Component {
  static propTypes = {
    isSearched: PropTypes.bool,
    verse: verseType.isRequired,
    chapter: surahType.isRequired,
    bookmarked: PropTypes.bool, // TODO: Add this for search
    bookmarkActions: PropTypes.shape({
      isLoaded: PropTypes.func.isRequired,
      load: PropTypes.func.isRequired,
      addBookmark: PropTypes.func.isRequired,
      removeBookmark: PropTypes.func.isRequired,
    }),
    mediaActions: PropTypes.shape({
      setMedia: PropTypes.func.isRequired,
      removeMedia: PropTypes.func.isRequired,
    }),
    audioActions: PropTypes.shape({
      pause: PropTypes.func.isRequired,
      setAyah: PropTypes.func.isRequired,
      play: PropTypes.func.isRequired,
      setCurrentWord: PropTypes.func.isRequired,
    }), // not required because in search it is not.
    footNoteActions: PropTypes.shape({
      load: PropTypes.func.isRequired,
    }),
    match: PropTypes.arrayOf(matchType),
    isPlaying: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    tooltip: PropTypes.string,
    currentWord: PropTypes.number, // gets passed in an integer, null by default
    iscurrentVerse: PropTypes.bool,
    currentVerse: PropTypes.string
  };

  static defaultProps = {
    currentWord: null,
    isSearched: false
  };

  shouldComponentUpdate(nextProps) {
    const conditions = [
      this.props.verse !== nextProps.verse,
      this.props.bookmarked !== nextProps.bookmarked,
      this.props.tooltip !== nextProps.tooltip,
      this.props.currentWord !== nextProps.currentWord,
      this.props.iscurrentVerse !== nextProps.iscurrentVerse
    ];

    if (this.props.match) {
      conditions.push(this.props.match.length !== nextProps.match.length);
    }

    return conditions.some(condition => condition);
  }

  handlePlay(verse) {
    const { isPlaying, audioActions } = this.props;
    const { pause, setAyah, play } = audioActions;

    if (isPlaying) {
      pause();
    }

    setAyah(verse);
    play();
  }

  renderTranslations() {
    const { verse, footNoteActions, match } = this.props;

    const array = match || verse.translations || [];

    return array.map((translation, index) => {
      return(
        <Translation
          translation={translation}
          footNoteActions={footNoteActions}
        />
      );
    });
  }

  renderMedia() {
    const { verse, mediaActions, isSearched } = this.props;

    if (isSearched || !verse.mediaContents) return false;

    return (
      <div>
        {
          verse.mediaContents.map((content, index) => (
            <div
              className={`${styles.translation} translation`}
              key={index}
            >
              <h2 className="text-translation times-new">
                <small>
                  <a
                    tabIndex="-1"
                    className="pointer"
                    onClick={() => mediaActions.setMedia(content)}
                    data-metrics-event-name="Media Click"
                    data-metrics-media-content-url={content.url}
                    data-metrics-media-content-id={content.id}
                    data-metrics-media-content-verse-key={verse.verseKey}
                  >
                    <LocaleFormattedMessage
                      id="verse.media.lectureFrom"
                      defaultMessage="Watch lecture by {from}"
                      values={{ from: content.authorName }}
                    />
                  </a>
                </small>
              </h2>
            </div>
          ))
        }
      </div>
    );
  }

  renderText() {
    const { verse, tooltip, currentVerse, isPlaying, audioActions, isSearched } = this.props;
    // NOTE: Some 'word's are glyphs (jeem). Not words and should not be clicked for audio
    let wordAudioPosition = -1;

    const text = verse.words.map(word => ( // eslint-disable-line
      <Word
        word={word}
        key={`${word.position}-${word.code}-${word.lineNum}`}
        currentVerse={currentVerse}
        tooltip={tooltip}
        isPlaying={isPlaying}
        audioActions={audioActions}
        audioPosition={word.wordId ? wordAudioPosition += 1 : null}
        isSearched={isSearched}
      />
    ));

    return (
      <h1 className={`${styles.font} text-right text-arabic`}>
        {text}
        <p
          dir="rtl"
          lang="ar"
          className={`text-tashkeel text-p${verse.pageNumber}`}
          dangerouslySetInnerHTML={{ __html: verse.textMadani }}
        />
      </h1>
    );
  }

  renderPlayLink() {
    const { isSearched, verse, currentVerse, isPlaying } = this.props;
    const playing = verse.verseKey === currentVerse && isPlaying;

    if (!isSearched) {
      return (
        <a
          tabIndex="-1"
          onClick={() => this.handlePlay(verse.verseKey)}
          className="text-muted"
        >
          <i className={`ss-icon ${playing ? 'ss-pause' : 'ss-play'} vertical-align-middle`} />{' '}
          <LocaleFormattedMessage
            id={playing ? 'actions.pause' : 'actions.play'}
            defaultMessage={playing ? 'Pause' : 'Play'}
          />
        </a>
      );
    }

    return false;
  }

  renderCopyLink() {
    const { isSearched, verse: { textMadani } } = this.props;

    if (!isSearched) {
      return (
        <Copy text={textMadani} />
      );
    }

    return false;
  }

  renderBookmark() {
    const { verse, bookmarked, isAuthenticated, bookmarkActions, isSearched } = this.props;

    if (isSearched || !isAuthenticated) return false;

    if (bookmarked) {
      return (
        <a
          tabIndex="-1"
          onClick={() => bookmarkActions.removeBookmark(verse.verseKey)}
          className="text-muted"
        >
          <strong>
            <i className="ss-icon ss-bookmark vertical-align-middle" />{' '}
            <LocaleFormattedMessage
              id="verse.bookmarked"
              defaultMessage="Bookmarked"
            />
          </strong>
        </a>
      );
    }

    return (
      <a
        tabIndex="-1"
        onClick={() => bookmarkActions.addBookmark(verse.verseKey)}
        className="text-muted"
      >
        <i className="ss-icon ss-bookmark vertical-align-middle" />{' '}
        <LocaleFormattedMessage
          id="verse.bookmark"
          defaultMessage="Bookmark"
        />
      </a>
    );
  }

  renderAyahBadge() {
    const { isSearched } = this.props;
    const metric = isSearched ? "Verse:Searched:Link" : "Verse:Link";

    const content = (
      <h4>
        <span className={`label label-default ${styles.label}`}>
          {this.props.verse.verseKey}
        </span>
      </h4>
    );

    return (
      <Link
        to={`/${this.props.verse.chapterId}/${this.props.verse.verseNumber}`}
        data-metrics-event-name={metric}
      >
        {content}
      </Link>
    );
  }

  renderControls() {
    const { chapter, verse } = this.props;

    return (
      <div className={`col-md-1 col-sm-1 ${styles.controls}`}>
        {this.renderAyahBadge()}
        {this.renderPlayLink()}
        {this.renderCopyLink()}
        {this.renderBookmark()}
        <Share chapter={chapter} verseKey={verse.verseKey} />
      </div>
    );
  }

  render() {
    const { verse, iscurrentVerse } = this.props;
    debug('component:Verse', `Render ${this.props.verse.verseKey}`);

    return (
      <Element
        name={`verse:${verse.verseKey}`}
        className={`row ${iscurrentVerse && 'highlight'} ${styles.container}`}
      >
        {this.renderControls()}
        <div className="col-md-11 col-sm-11">
          {this.renderText()}
          {this.renderTranslations()}
          {this.renderMedia()}
        </div>
      </Element>
    );
  }
}
