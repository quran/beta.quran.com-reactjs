import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { Element } from 'react-scroll';

import { ayahType, matchType } from 'types';
import Copy from 'components/Copy';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';

import debug from 'helpers/debug';

import bindTooltip from 'utils/bindTooltip';

const styles = require('./style.scss');

/* eslint-disable no-unused-vars */
const CHAR_TYPE_WORD = 1;
const CHAR_TYPE_END = 2;
const CHAR_TYPE_PAUSE = 3;
const CHAR_TYPE_RUB = 4;
const CHAR_TYPE_SAJDAH = 5;
/* eslint-enable no-unused-vars */

export default class Ayah extends Component {
  static propTypes = {
    isSearched: PropTypes.bool,
    ayah: ayahType.isRequired,
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
    match: PropTypes.arrayOf(matchType),
    isPlaying: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    tooltip: PropTypes.string,
    currentWord: PropTypes.number, // gets passed in an integer, null by default
    isCurrentAyah: PropTypes.bool,
    currentAyah: PropTypes.string
  };

  static defaultProps = {
    currentWord: null,
    isSearched: false
  };

  componentDidMount() {
    bindTooltip();
  }

  shouldComponentUpdate(nextProps) {
    const conditions = [
      this.props.ayah !== nextProps.ayah,
      this.props.bookmarked !== nextProps.bookmarked,
      this.props.tooltip !== nextProps.tooltip,
      this.props.currentWord !== nextProps.currentWord,
      this.props.isCurrentAyah !== nextProps.isCurrentAyah
    ];

    if (this.props.match) {
      conditions.push(this.props.match.length !== nextProps.match.length);
    }

    return conditions.some(condition => condition);
  }

  handlePlay(ayah) {
    const { isPlaying, audioActions } = this.props;
    const { pause, setAyah, play } = audioActions;

    if (isPlaying) {
      pause();
    }

    setAyah(ayah);
    play();
  }

  renderTranslations() {
    const { ayah, match } = this.props;

    const array = match || ayah.content || [];

    return array.map((content, index) => {
      const arabic = new RegExp(/[\u0600-\u06FF]/);
      const character = content.text;
      const isArabic = arabic.test(character);
      const lang = (content.name || content.resource.name).replace(/\s+/g, '-').toLowerCase();

      return (
        <div
          className={`${styles.translation} ${isArabic && 'arabic'} translation`}
          key={index}
        >
          <h4 className="montserrat">{content.name || content.resource.name}</h4>
          <h2 className={`${isArabic ? 'text-right' : 'text-left'} text-translation times-new`}>
            <small
              dangerouslySetInnerHTML={{ __html: content.text }}
              className={`${styles[lang] || 'times-new'}`}
            />
          </h2>
        </div>
      );
    });
  }

  renderMedia() {
    const { ayah, mediaActions, isSearched } = this.props;

    if (isSearched || !ayah.mediaContent) return false;

    return (
      <div>
        {
          ayah.mediaContent.map((content, index) => (
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
                    data-metrics-media-content-ayah-key={ayah.ayahKey}
                  >
                    <LocaleFormattedMessage
                      id="ayah.media.lectureFrom"
                      defaultMessage="Watch lecture by {from}"
                      values={{ from: content.resource.name }}
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
    const { ayah, audioActions, tooltip, isSearched } = this.props;

    if (!ayah.words[0].code) {
      return false;
    }

    // position is important as it will differentiate between words and symbols, see 2:25:13
    let position = -1;
    const text = ayah.words.map((word, index) => {
      let id = null;
      const isLast = ayah.words.length === index + 1;
      const className = `${word.className} ${word.highlight ? word.highlight : ''}`;

      if (word.charTypeId === CHAR_TYPE_WORD) {
        position += 1;
        id = `word-${word.ayahKey.replace(/:/, '-')}-${position}`;
      } else {
        id = `${word.className}-${word.codeDec}`; // just don't include id
      }

      if (word.translation || word.transliteration) {
        const tooltipContent = word[tooltip];

        return (
          <b // eslint-disable-line
            key={word.code}
            id={id}
            rel="tooltip"
            onClick={event =>
              !isSearched &&
              audioActions.setCurrentWord &&
              audioActions.setCurrentWord(event.target.dataset.key)
            }
            data-key={`${word.ayahKey}:${position}`}
            className={`${className}`}
            title={tooltipContent}
            dangerouslySetInnerHTML={{ __html: word.code }}
          />
        );
      }
      const label = isLast ? { title: `Verse ${ayah.ayahNum}` } : {};
      return (
        <b // eslint-disable-line
          id={id}
          onClick={event =>
            !isSearched &&
            audioActions.setCurrentWord &&
            audioActions.setCurrentWord(event.target.dataset.key)
          }
          data-key={`${word.ayahKey}:${position}`}
          rel="tooltip"
          className={`${className} ${isLast} pointer`}
          key={word.code}
          dangerouslySetInnerHTML={{ __html: word.code }}
          {...label}
        />
      );
    });

    return (
      <h1 className={`${styles.font} text-right text-arabic`}>
        {text}
        <p
          dir="rtl"
          lang="ar"
          className={`text-tashkeel text-p${ayah.pageNum}`}
          dangerouslySetInnerHTML={{ __html: ayah.textTashkeel }}
        />
      </h1>
    );
  }

  renderPlayLink() {
    const { isSearched, ayah, currentAyah, isPlaying } = this.props;
    const playing = ayah.ayahKey === currentAyah && isPlaying;

    if (!isSearched) {
      return (
        <a
          tabIndex="-1"
          onClick={() => this.handlePlay(ayah.ayahKey)}
          className="text-muted"
        >
          <i className={`ss-icon ${playing ? 'ss-pause' : 'ss-play'}`} />
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
    const { isSearched, ayah: { textTashkeel } } = this.props;

    if (!isSearched) {
      return (
        <Copy text={textTashkeel} />
      );
    }

    return false;
  }

  renderBookmark() {
    const { ayah, bookmarked, isAuthenticated, bookmarkActions, isSearched } = this.props;

    if (isSearched || !isAuthenticated) return false;

    if (bookmarked) {
      return (
        <a
          tabIndex="-1"
          onClick={() => bookmarkActions.removeBookmark(ayah.ayahKey)}
          className="text-muted"
        >
          <strong><i className="ss-icon ss-bookmark" />
            <LocaleFormattedMessage
              id="ayah.bookmarked"
              defaultMessage="Bookmarked"
            />
          </strong>
        </a>
      );
    }

    return (
      <a
        tabIndex="-1"
        onClick={() => bookmarkActions.addBookmark(ayah.ayahKey)}
        className="text-muted"
      >
        <i className="ss-icon ss-bookmark" />
        <LocaleFormattedMessage
          id="ayah.bookmark"
          defaultMessage="Bookmark"
        />
      </a>
    );
  }

  renderAyahBadge() {
    const { isSearched } = this.props;
    const content = (
      <h4>
        <span className={`label label-default ${styles.label}`}>
          {this.props.ayah.surahId}:{this.props.ayah.ayahNum}
        </span>
      </h4>
    );

    if (isSearched) {
      return (
        <Link
          to={`/${this.props.ayah.surahId}/${this.props.ayah.ayahNum}`}
          data-metrics-event-name="Ayah:Searched:Link"
        >
          {content}
        </Link>
      );
    }

    return (
      <Link
        to={`/${this.props.ayah.surahId}:${this.props.ayah.ayahNum}`}
        data-metrics-event-name="Ayah:Link"
      >
        {content}
      </Link>
    );
  }

  renderControls() {
    return (
      <div className={`col-md-1 col-sm-1 ${styles.controls}`}>
        {this.renderAyahBadge()}
        {this.renderPlayLink()}
        {this.renderCopyLink()}
        {this.renderBookmark()}
      </div>
    );
  }

  render() {
    const { ayah, isCurrentAyah } = this.props;
    debug('component:Ayah', `Render ${this.props.ayah.ayahNum}`);

    return (
      <Element
        name={`ayah:${ayah.ayahKey}`}
        className={`row ${isCurrentAyah && 'highlight'} ${styles.container}`}
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
