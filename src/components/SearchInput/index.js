import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'react-metrics';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import SearchAutocomplete from '../SearchAutocomplete';

import debug from '../../helpers/debug';

@connect(null, { push })
export default class SearchInput extends Component {
  static contextTypes = {
    metrics: PropTypes.metrics
  };

  state = {
    value: '',
    showAutocomplete: false
  };

  search(e) {
    if (e.key === 'Enter' || e.keyCode === 13 || e.type === 'click') {
      let inputEl = ReactDOM.findDOMNode(this).querySelector('input'),
        searching = inputEl.value.trim(),
        ayah, pattern, surah;

      // prevent search function while search input field is empty
      if (searching === '') {
        // reset input to display "Search" placeholder text
        inputEl.value = '';
        return;
      }

      const shortcutSearch = /\d[\.,\:,\,,\\,//]/g;
      const splitSearch = /[\.,\:,\,,\\,//]/g;

      pattern = new RegExp(shortcutSearch);

      if (pattern.test(searching)) {
        surah = parseInt(searching.split(splitSearch)[0]);
        ayah = parseInt(searching.split(splitSearch)[1]);

        if (isNaN(ayah)) {
          ayah = 1;
        }

        this.context.metrics.track('Search', {action: 'surah', label: `/${surah}/${ayah}-${(ayah + 10)}`});
        this.props.push(`/${surah}/${ayah}-${(ayah + 10)}`);
      } else {
        this.context.metrics.track('Search', {action: 'query', label: searching});
        this.props.push(`/search?q=${searching}`);
      }
    }

    // This checks to see if the user is typing Arabic
    // and adjusts the text-align.
    var arabic = new RegExp(/[\u0600-\u06FF]/);
    if (arabic.test(e.target.value)) {
      e.target.style.textAlign = 'right';
    }
    else {
      e.target.style.textAlign = 'left';
    }

    if (this.input) {
      this.setState({ value: this.input.value.trim() });
    }
  }

  render() {
    const { showAutocomplete } = this.state;
    const { className } = this.props;

    debug('component:SearchInput', 'Render');

    return (
      <div className={`right-inner-addon searchinput ${className}`}>
        <i className="ss-icon ss-search" onClick={this.search.bind(this)} />
        <input
          type="search"
          placeholder="Search"
          ref="search"
          onFocus={() => this.setState({showAutocomplete: true})}
          onKeyUp={this.search.bind(this)}
          ref={(ref) => this.input = ref}
        />
        {
          showAutocomplete &&
          <SearchAutocomplete value={this.state.value} input={this.input}/>
        }
      </div>
    );
  }
}
