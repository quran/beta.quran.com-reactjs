import React from 'react';
import AudioplayerStore from 'stores/AudioplayerStore';
import AudioplayerTrack from './AudioplayerTrack';
import VersesDropdown from './VersesDropdown';
import * as AyahsActions from 'actions/AyahsActions';
import {connectToStores} from 'fluxible/addons';
import SurahsStore from 'stores/SurahsStore';
import AyahsStore from 'stores/AyahsStore';
import * as AudioplayerActions from 'actions/AudioplayerActions';
import classNames from 'classnames';
import debug from 'utils/Debug';

class Audioplayer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      playing: false,
      shouldRepeat: false,
      progress: 0,
      currentTime: 0,
      currentAudio: null,
      currentAyah: null,
      isAudioLoaded: false
    };
  }

  componentDidMount() {
    if (this.props.ayahs.length > 0 && typeof window !== 'undefined') {
      this.setupAudio();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.currentAyah !== this.props.currentAyah) {
      if (prevProps.currentAyah === undefined && this.props.currentAyah) {
        return this.setupAudio();
      }

      if (prevProps.currentAyah.ayah !== this.props.currentAyah.ayah) {
        if (this.props.currentAudio) {
          prevProps.currentAudio.pause();
        }
        return this.setupAudio();
      }
    }


    if (!prevProps.currentAyah) {
      // When navigating from the index page, there is no ayah set and therefore,
      // should bootstrap it!
      // This could be used as a backup for bootstrapping from the component

      // if (!this.props.currentAyah && this.props.ayahs.length > 0) {
      //   this.context.executeAction(AudioplayerActions.changeAyah, {
      //     ayah: 1,
      //     shouldPlay: false
      //   });
      //   return;
      // }
      return null;
    }
  }

  loader() {
    return (
      <div className="sequence">
        <div className="seq-preloader">
          <svg height="16" width="42" className="seq-preload-indicator" xmlns="http://www.w3.org/2000/svg">
            <circle className="seq-preload-circle seq-preload-circle-1" cx="6" cy="8" r="5">
            </circle>
            <circle className="seq-preload-circle seq-preload-circle-2" cx="20" cy="8" r="5">
            </circle>
            <circle className="seq-preload-circle seq-preload-circle-3" cx="34" cy="8" r="5">
            </circle>
          </svg>
        </div>
      </div>
    );
  }

  changeOffset(fraction) {
    this.setState({
      progress: fraction * 100,
      currentTime: fraction * this.state.currentAudio.duration
    });

    this.state.currentAudio.currentTime = fraction *
      this.state.currentAudio.duration;
  }

  setupAudio() {
    if (this.state.playing) {
      this.pause();
    }

    this.props.currentAudio.addEventListener('loadeddata', () => {
      // Default current time to zero. This will change
      this.props.currentAudio.currentTime = 0;

      this.setState({isAudioLoaded: true});
    });

    this.props.currentAudio.addEventListener('timeupdate', () => {
      let progress = (this.props.currentAudio.currentTime /
        this.props.currentAudio.duration * 100);
      this.setState({
          progress: progress
      });
    }, false);

    this.props.currentAudio.addEventListener('ended', () => {
      if (this.props.ayahs.length === 1) {
        this.setState({
          shouldRepeat: false,
          playing: false
        });
      } else if (this.state.shouldRepeat === true) {
        this.context.executeAction(AudioplayerActions.changeAyah, {
          ayah: this.props.currentAyah.ayah,
          shouldPlay: true
        });
      } else {
        this.props.currentAudio.pause();
        this.context.executeAction(AudioplayerActions.changeAyah, {
          ayah: this.props.currentAyah.ayah + 1,
          shouldPlay: true
        });
      }
    }, false);

    this.props.currentAudio.addEventListener('play', () => {
      let currentTime = (
        this.state.progress / 100 * this.props.currentAudio.duration
      );

      this.setState({
        currentTime: currentTime
      });
    }, false);

    if (this.context.getStore(AudioplayerStore).getShouldPlay()) {
      this.play();
    }
  }

  loadRestOfAudio() {
    // The AyahsStore only builds the audio for the first 2 ayahs to conserve
    // bandwidth on the servers. Only when we need all the audios should it load
    // the remaining.
    var audiosPresent = this.props.ayahs.every((ayah) => {
      return !!ayah.scopedAudio;
    });

    if (!audiosPresent) {
      this.context.executeAction(AyahsActions.buildAllAudio);
    }
  }

  startStopPlayer(e) {
    e.preventDefault();
    console.log('Audio was playing:', this.state.playing);

    if (this.state.playing) {
      this.pause();
    }
    else {
      this.play();
    }
  }

  pause() {
    this.setState({
        playing: false
    });
    this.props.currentAudio.pause();
  }

  play() {
    this.setState({
      playing: true
    });

    this.loadRestOfAudio();

    this.props.currentAudio.play();
  }

  repeatSwitch() {
    this.setState({
      shouldRepeat: !this.state.shouldRepeat
    });
  }

  forwardAyah(e) {
    e.preventDefault();
    let wasPlaying = this.state.playing;

    this.pause();

    // This was causing errors when listening viewing single ayah.
    if(this.props.ayahs.length != 1){
      this.context.executeAction(AudioplayerActions.changeAyah, {
        ayah: this.props.currentAyah.ayah + 1,
        shouldPlay: wasPlaying
      });
    } 
  }

  // UI components
  playStopButtons() {
    var icon;
    if (this.state.playing) {
      icon = <i className="ss-icon ss-pause" />;
    }
    else {
      icon = <i className="ss-icon ss-play" />;
    }

    return (
      <li className="audioplayer-controls">
        <a className="buttons" onClick={this.startStopPlayer.bind(this)} href>
          {icon}
        </a>
      </li>
    );
  }

  forwardButton() {
    return (
      <li className="text-center audioplayer-controls">
        <a className="buttons" onClick={this.forwardAyah.bind(this)}>
          <i className="ss-icon ss-skipforward" />
        </a>
      </li>
    );
  }

  repeatButton() {
    var classes = classNames({
        repeat: this.state.shouldRepeat
    });

    return (
      <li className="text-center audioplayer-repeat">
        <a>
          <input type="checkbox" id="repeat" />
          <label htmlFor="repeat"
                 onClick={this.repeatSwitch}
                 className={classes}>
            <i className="ss-icon ss-repeat" />
          </label>
        </a>
      </li>
    );
  }

  render() {
    debug('Component-Audioplayer');

    var currentAyahId = this.props.currentAyah ? this.props.currentAyah.ayah : '';
    var content;

    if (this.state.isAudioLoaded) {
      content = (
        <ul className="list-inline audioplayer-options">
        <VersesDropdown ayahs={this.props.surah ? this.props.surah.ayat : 1}
                        currentAyah={currentAyahId}/>
       {this.playStopButtons()}
       {this.forwardButton()}
       {this.repeatButton()}
     </ul>
     );
    }
    else {
      content = (
        <ul className="list-inline audioplayer-options">
          {this.loader()}
        </ul>
      );
    }

    return (
      <div className="audioplayer col-md-3 border-right">
          {content}
        <div className="audioplayer-wrapper">
          <AudioplayerTrack progress={this.state.progress}
                            changeOffset={this.changeOffset}/>
        </div>
      </div>
    );
  }

}

Audioplayer.contextTypes = {
  getStore: React.PropTypes.func.isRequired,
  executeAction: React.PropTypes.func.isRequired
};

Audioplayer = connectToStores(Audioplayer, [SurahsStore, AyahsStore, AudioplayerStore], function(stores, props) {
  return {
    surah: stores.SurahsStore.getSurah(),
    ayahs: stores.AyahsStore.getAyahs(),
    currentAudio: stores.AudioplayerStore.getCurrentAudio(),
    currentAyah: stores.AudioplayerStore.getCurrentAyah()
  };
});

export default Audioplayer;
