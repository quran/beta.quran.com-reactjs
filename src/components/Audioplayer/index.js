import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { scroller } from 'react-scroll';

// Redux
import { play, pause, repeat, toggleScroll, setCurrentFile, buildOnClient } from '../../redux/modules/audioplayer';

// Components
import Track from './Track';

// Helpers
// import debug from '../../scripts/helpers/debug';

const style = require('./style.scss');

@connect(
  state => ({
    files: state.audioplayer.files,
    currentFile: state.audioplayer.currentFile,
    surahId: state.audioplayer.surahId,
    isSupported: state.audioplayer.isSupported,
    isPlaying: state.audioplayer.isPlaying,
    isLoadedOnClient: state.audioplayer.isLoadedOnClient,
    shouldRepeat: state.audioplayer.shouldRepeat,
    shouldScroll: state.audioplayer.shouldScroll
  }),
  (dispatch) => ({
    play: bindActionCreators(play, dispatch),
    pause: bindActionCreators(pause, dispatch),
    repeat: bindActionCreators(repeat, dispatch),
    toggleScroll: bindActionCreators(toggleScroll, dispatch),
    setCurrentFile: bindActionCreators(setCurrentFile, dispatch),
    buildOnClient: bindActionCreators(buildOnClient, dispatch)
  }),
  (stateProps, dispatchProps, ownProps) => {
    if (!stateProps.isSupported) {
      return {
        ...stateProps, ...dispatchProps, ...ownProps
      };
    }

    const files = stateProps.files[stateProps.surahId];
    const ayahIds = files ? Object.keys(files) : [];

    return {
      ...stateProps, ...dispatchProps, ...ownProps,
      files,
      ayahIds
    };
  }
)
export default class Audioplayer extends Component {
  static propTypes = {
    className: PropTypes.string,
    surah: PropTypes.object.isRequired,
    files: PropTypes.object,
    currentFile: PropTypes.string,
    buildOnClient: PropTypes.func.isRequired,
    onLoadAyahs: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isLoadedOnClient: PropTypes.bool.isRequired,
    isSupported: PropTypes.bool.isRequired,
    shouldRepeat: PropTypes.bool.isRequired,
    shouldScroll: PropTypes.bool.isRequired,
    setCurrentFile: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    repeat: PropTypes.func.isRequired,
    toggleScroll: PropTypes.func.isRequired,
    ayahIds: PropTypes.array
  };

  static defaultProps = {
    className: 'col-md-3'
  };

  state = {
    isAudioLoaded: false,
    currentAudio: null,
    currentAyah: null
  };

  componentDidMount() {
    const { isLoadedOnClient, buildOnClient, surah } = this.props; // eslint-disable-line no-shadow

    if (!isLoadedOnClient && __CLIENT__) {
      return buildOnClient(surah.id);
    }
  }

  componentWillUnmount() {
    this.props.pause();
    // this.props.currentAudio.src = null;
  }

  onPreviousAyah() {
    const { play, pause, setCurrentFile, isPlaying, shouldScroll } = this.props; // eslint-disable-line no-shadow
    const prevAyah = this.getPrevious();
    const ayahNum = prevAyah.replace( /^\d:/, '' );

    if (prevAyah) {
      const wasPlaying = isPlaying;

      pause();

      setCurrentFile(prevAyah);

      if (shouldScroll) {
        scroller.scrollTo('ayah:'+ ayahNum, null, null, -120); // -120 to account for the header height
      }

      if (wasPlaying) {
        play();
      }
    }
  }

  onNextAyah() {
    const { play, pause, setCurrentFile, isPlaying, shouldScroll } = this.props; // eslint-disable-line no-shadow
    const wasPlaying = isPlaying;
    const nextAyah = this.getNext();
    const ayahNum = nextAyah.replace( /^\d:/, '' );

    pause();

    setCurrentFile(nextAyah);

    if (shouldScroll) {
      scroller.scrollTo('ayah:'+ ayahNum);
    }

    if (wasPlaying) {
      play();
    }
  }

  getCurrent() {
    const { currentFile, ayahIds } = this.props;
    const index = ayahIds.findIndex(id => id === currentFile);

    return ayahIds[index];
  }

  getPrevious() {
    const { currentFile, ayahIds } = this.props;
    const index = ayahIds.findIndex(id => id === currentFile) - 1;

    return ayahIds[index];
  }

  getNext() {
    const { currentFile, ayahIds, onLoadAyahs } = this.props;
    const index = ayahIds.findIndex(id => id === currentFile) + 1;

    if ((ayahIds.length - 3) <= index) {
      onLoadAyahs();
    }

    return ayahIds[index];
  }

  startStopPlayer(event) {
    const { isPlaying } = this.props;

    event.preventDefault();

    if (isPlaying) {
      return this.pause();
    }

    return this.play();
  }

  pause() {
    this.props.pause();
  }

  play() {
    const { shouldScroll } = this.props;
    const currentAyah = this.getCurrent();
    const ayahNum = currentAyah.replace( /^\d:/, '' );

    if (shouldScroll) {
      scroller.scrollTo('ayah:'+ ayahNum);
    }

    this.props.play();
  }

  repeat(event) {
    event.preventDefault();

    this.props.repeat();
  }

  toggleScroll(event) {
    event.preventDefault();

    const { shouldScroll } = this.props;
    const currentAyah = this.getCurrent();
    const ayahNum = currentAyah.replace( /^\d:/, '' );

    if (!shouldScroll) { // we use the inverse (!) here because we're toggling, so false is true
      if (scroller.get('ayah:'+ ayahNum).getBoundingClientRect().top < 0) { // if the ayah is above our scroll offset
        scroller.scrollTo('ayah:'+ ayahNum, null, null, -120);
      } else {
        scroller.scrollTo('ayah:'+ ayahNum);
      }
    }


    this.props.toggleScroll();
  }

  renderLoader() {
    return (
      <div className="sequence">
        <div className="seq-preloader">
          <svg height="16" width="42" className="seq-preload-indicator" xmlns="http://www.w3.org/2000/svg">
            <circle className="seq-preload-circle seq-preload-circle-1" cx="6" cy="8" r="5" />
            <circle className="seq-preload-circle seq-preload-circle-2" cx="20" cy="8" r="5" />
            <circle className="seq-preload-circle seq-preload-circle-3" cx="34" cy="8" r="5" />
          </svg>
        </div>
      </div>
    );
  }

  renderPlayStopButtons() {
    const { isPlaying } = this.props;

    let icon = <i className="ss-icon ss-play" />;

    if (isPlaying) {
      icon = <i className="ss-icon ss-pause" />;
    }

    return (
      <a className={`pointer ${style.buttons}`} onClick={this.startStopPlayer.bind(this)}>
        {icon}
      </a>
    );
  }

  renderPreviousButton() {
    const { currentFile, ayahIds } = this.props;
    const index = ayahIds.findIndex(id => id === currentFile);

    return (
      <a className={`pointer ${style.buttons} ${!index ? style.disabled : ''}`} onClick={index ? this.onPreviousAyah.bind(this) : null}>
        <i className="ss-icon ss-skipback" />
      </a>
    );
  }

  renderNextButton() {
    return (
      <a className={`pointer ${style.buttons}`} onClick={this.onNextAyah.bind(this)}>
        <i className="ss-icon ss-skipforward" />
      </a>
    );
  }

  renderRepeatButton() {
    const { shouldRepeat } = this.props;

    return (
      <Col xs={2} className="text-center pull-right">
        <input type="checkbox" id="repeat" className={style.checkbox} />
        <label
          htmlFor="repeat"
          className={`pointer ${style.buttons} ${shouldRepeat ? style.repeat : ''}`}
          onClick={this.repeat.bind(this)}
        >
          <i className="ss-icon ss-repeat" />
        </label>
      </Col>
    );
  }

  renderScrollButton() {
    const { shouldScroll } = this.props;

    return (
      <Col xs={2} className="text-center pull-right">
        <input type="checkbox" id="scroll" className={style.checkbox} />
        <label
          htmlFor="scroll"
          className={`pointer ${style.buttons} ${shouldScroll ? style.scroll : ''}`}
          onClick={this.toggleScroll.bind(this)}
        >
          <i className="ss-icon ss-list" />
        </label>
      </Col>
    );
  }


  render() {
    // debug('component:Audioplayer', 'Render');

    const {
      className,
      play, // eslint-disable-line no-shadow
      pause, // eslint-disable-line no-shadow
      files,
      currentFile,
      isPlaying,
      shouldRepeat,
      isSupported,
      isLoadedOnClient
    } = this.props; // eslint-disable-line no-shadow

    if (!isSupported) {
      return (
        <li className={`${style.container} ${className}`}>
          Your browser does not support this audio.
        </li>
      );
    }

    let content = (
      <Row className={style.options}>
        <Col xs={2} className="text-center">
          {this.renderPreviousButton()}
        </Col>
        <Col xs={3} className="text-center">
          {this.renderPlayStopButtons()}
        </Col>
        <Col xs={2} className="text-center">
          {this.renderNextButton()}
        </Col>

        {this.renderRepeatButton()}

        {this.renderScrollButton()}
      </Row>
    );

    if (!currentFile) {
      return (
        <li className={`${style.container} ${className}`}>
          {this.renderLoader()}
        </li>
      );
    }

    return (
      <div className={`${style.container} ${className} navbar-item border-right`}>
        <div className={style.verse}>{currentFile.split(':')[1]}</div>
        {content}
        <div className={style.wrapper}>
          {isLoadedOnClient ?
            <Track
              file={files[currentFile]}
              isPlaying={isPlaying}
              shouldRepeat={shouldRepeat}
              onPlay={play}
              onPause={pause}
              onEnd={this.onNextAyah.bind(this)}
            /> :
            null
            }
        </div>
      </div>
    );
  }
}
