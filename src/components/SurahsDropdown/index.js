import React, { Component, PropTypes } from 'react';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import Col from 'react-bootstrap/lib/Col';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import LocaleFormattedMessage from 'components/LocaleFormattedMessage';
import { surahType } from 'types';

const styles = require('./style.scss');

export default class SurahsDropdown extends Component {
  static propTypes = {
    surahs: PropTypes.objectOf(surahType).isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: 'col-md-3'
  };

  shouldComponentUpdate(nextProps) {
    return this.props.surahs !== nextProps.surahs;
  }

  renderList() {
    const { surahs } = this.props;

    return Object.values(surahs).map((surah, index) => (
      <LinkContainer to={`/${surah.id}`} activeClass="active" key={`surah-${index}`}>
        <MenuItem>
          <div className="row">
            <Col xs={2} md={2}>
              <span className="surah-num">
                {surah.id}
              </span>
            </Col>
            <Col xs={7} md={7}>
              <span className="suran-name">{surah.name.simple}</span>
              <br />
              <span className="surah-meaning">{surah.name.english}</span>
            </Col>
            <Col xs={3} md={3} className={`text-right ${styles.arabicName}`}>
              {surah.name.arabic}
            </Col>
          </div>
        </MenuItem>
      </LinkContainer>
    ));
  }

  render() {
    const { className } = this.props;

    return (
      <DropdownButton
        link
        className={`${className} ${styles.dropdown}`}
        id="surahs-dropdown"
        title={<LocaleFormattedMessage id="setting.surahs" defaultMessage="Surahs" />}
      >
        {this.renderList()}
      </DropdownButton>
    );
  }
}
