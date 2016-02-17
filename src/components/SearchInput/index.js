import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

const style = require('./style.scss');

@connect(null, { push })
export default class SearchInput extends Component {
  static propTypes = {
    push: PropTypes.func,
    className: PropTypes.string,
    isInNavbar: PropTypes.bool,
    value: PropTypes.string
  };

  static defaultProps = {
    value: ''
  };

  search(event) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.type === 'click') {
      const searchValue = ReactDOM.findDOMNode(this).querySelector('input').value;
      const pattern = new RegExp(/\d[\.,\:,\,]\d/);
      let ayah;
      let surah;

      if (pattern.test(searchValue)) {
        surah = searchValue.split(/[\.,\:,\,]/)[0];
        ayah = parseInt(searchValue.split(/[\.,\:,\,]/)[1], 10);

        this.props.push(`/${surah}/${ayah}-${ayah + 10}`);
      } else {
        this.props.push(`/search`, {q: searchValue});
      }
    }

    // This checks to see if the user is typing Arabic
    // and adjusts the text-align.
    const arabic = new RegExp(/[\u0600-\u06FF]/);

    if (arabic.test(event.target.value)) {
      event.target.style.textAlign = 'right';
    } else {
      event.target.style.textAlign = 'left';
    }
  }

  render() {
    const { className, isInNavbar, value } = this.props;

    return (
      <div className={`right-inner-addon ${className} ${style.searchInput} ${isInNavbar ? style.isInNavbar : ''}`}>
        <i className={`ss-icon ss-search ${style.icon} text-center`} onClick={this.search.bind(this)} />
        <input
          type="text"
          placeholder="Search"
          defaultValue={value}
          onKeyUp={this.search.bind(this)}
        />
      </div>
    );
  }
}
