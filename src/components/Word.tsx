import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import pad from 'lodash/pad';
import { buildAudioURL } from '../helpers/buildAudio';
import { WordShape } from '../shapes';
import { WORD_TYPES } from '../constants';
import {
  SetCurrentVerseKey,
  SetCurrentWord,
  Pause,
  PlayCurrentWord,
} from '../redux/actions/audioplayer';

const propTypes = {
  word: WordShape.isRequired,
  setCurrentWord: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  setCurrentVerseKey: PropTypes.func.isRequired,
  playCurrentWord: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired,
  audioPosition: PropTypes.number,
  isCurrentVersePlaying: PropTypes.bool.isRequired,
  isSearched: PropTypes.bool,
  useTextFont: PropTypes.bool, // tmp change to compare text and code based rendering
};

type DefaultProps = {
  audioPosition?: number | null;
  isSearched?: boolean;
  useTextFont?: boolean;
  currentVerse?: string | null;
};

const defaultProps: DefaultProps = {
  isSearched: false,
  useTextFont: false,
  audioPosition: null,
  currentVerse: null,
};

type Props = {
  word: WordShape;
  setCurrentWord: SetCurrentWord;
  pause: Pause;
  setCurrentVerseKey: SetCurrentVerseKey;
  playCurrentWord: PlayCurrentWord;
  tooltip: 'translation' | 'transliteration';
  audioPosition?: number;
  isCurrentVersePlaying: boolean;
  isSearched?: boolean;
  useTextFont?: boolean;
};

class Word extends Component<Props> {
  public static propTypes = propTypes;
  public static defaultProps = defaultProps;

  getTooltipTitle = () => {
    const { word, tooltip } = this.props;

    let title = '';

    if (word.charType === WORD_TYPES.CHAR_TYPE_END) {
      title = `Verse ${word.verseKey.split(':')[1]}`;
    } else if (word.charType === WORD_TYPES.CHAR_TYPE_WORD) {
      if (word[tooltip]) {
        title = (word[tooltip] || {}).text || '';
      }
    }

    return title;
  };

  handleWordPlay = () => {
    const { word } = this.props;

    if (word.audio) {
      const audio = new Audio(buildAudioURL(word.audio));
      audio.play();
    }
  };

  handleSegmentPlay = () => {
    const {
      word,
      audioPosition,
      isSearched,
      setCurrentWord,
      pause,
      setCurrentVerseKey,
      playCurrentWord,
      isCurrentVersePlaying,
    } = this.props;

    if (isSearched || !word.audio) {
      return;
    }

    if (isCurrentVersePlaying) {
      setCurrentWord(word.code);
    } else {
      pause();
      setCurrentVerseKey(word.verseKey);
      playCurrentWord({ word, position: audioPosition });
    }
  };

  render() {
    const {
      audioPosition,
      isCurrentVersePlaying,
      word,
      useTextFont,
    } = this.props;

    let text = '';

    const highlight = isCurrentVersePlaying ? 'highlight' : '';
    const className = `${useTextFont ? 'text-' : ''}${word.className} ${
      word.charType
    } ${highlight} ${word.highlight ? word.highlight : ''}`;
    const id = `word-${word.verseKey.replace(/:/, '-')}-${audioPosition}`;

    if (useTextFont) {
      if (word.charType === WORD_TYPES.CHAR_TYPE_END) {
        text = pad(word.verseKey.split(':')[1], 3, '0');
      } else if (word.textMadani) {
        text = word.textMadani;
      }
    } else {
      text = word.code;
    }

    return (
      <span>
        <Tooltip arrow title={this.getTooltipTitle()}>
          <a // eslint-disable-line
            key={word.code}
            id={id}
            onDoubleClick={this.handleSegmentPlay}
            onClick={this.handleWordPlay}
            className={`${className} pointer`}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </Tooltip>
        {word.charType === WORD_TYPES.CHAR_TYPE_WORD && (
          <small style={{ letterSpacing: -15 }}>&nbsp;</small>
        )}
      </span>
    );
  }
}

export default Word;
