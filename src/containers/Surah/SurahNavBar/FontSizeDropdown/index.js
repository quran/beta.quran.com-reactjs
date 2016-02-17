import React, { Component } from 'react';
import { NavItem, OverlayTrigger, Popover, Tooltip, Row, Col } from 'react-bootstrap';

import { getFontSize } from 'helpers/flowType';

const style = require('./style.scss');

export default class FontSizeDropdown extends Component {
  onSelect() {
    this.setState({
      fontSize: getFontSize()
    });
  }

  onClickArabic(incrementValue) {
    Array.from(document.querySelectorAll('[class^="font"]')).forEach(node => {
      const fontSize = parseInt(node.style.fontSize.split('px')[0], 10);

      node.style.fontSize = `${fontSize + incrementValue}px`; // eslint-disable-line no-param-reassign
      node.setAttribute('fontSizeChanged', true);
    });
  }

  onClickTranslation(incrementValue) {
    Array.from(document.querySelectorAll('[class^="translation"] small')).forEach(node => {
      const fontSize = parseInt(node.style.fontSize.split('px')[0], 10);

      node.style.fontSize = `${fontSize + incrementValue}px`; // eslint-disable-line no-param-reassign
    });
  }

  renderPopup() {
    const incrementValueArabic = 5;
    const incrementValueTranslation = 2;

    return (
      <Popover id="FontSizeDropdown" title="Font Size" className={style.popover}>
        <Row>
          <Col xs={3}>
            <a onClick={this.onClickArabic.bind(this, incrementValueArabic * -1)} className="pointer">
              <i className="ss-icon ss-hyphen" />
            </a>
          </Col>
          <Col xs={6} className="text-center">
            Arabic
          </Col>
          <Col xs={3} className="text-right">
            <a onClick={this.onClickArabic.bind(this, incrementValueArabic)} className="pointer">
              <i className="ss-icon ss-plus"/>
            </a>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs={3}>
            <a onClick={this.onClickTranslation.bind(this, incrementValueTranslation * -1)} className="pointer">
              <i className="ss-icon ss-hyphen" />
            </a>
          </Col>
          <Col xs={6} className="text-center">
            Translations
          </Col>
          <Col xs={3} className="text-right">
            <a onClick={this.onClickTranslation.bind(this, incrementValueTranslation)} className="pointer">
              <i className="ss-icon ss-plus"/>
            </a>
          </Col>
        </Row>
      </Popover>
    );
  }

  render() {
    const helperText = 'Change font size';
    const tooltip = <Tooltip id="FontSizeDropdown" className="hidden-xs hidden-sm">{helperText}</Tooltip>;

    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={this.renderPopup()} rootClose>
        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={tooltip}>
          <NavItem eventKey={1} onSelect={this.onSelect.bind(this)}>
            <small className="hidden-xs hidden-sm">A</small><span className="hidden-xs hidden-sm" style={{fontSize: '1.25em'}}>A</span>
            <span className="inline visible-sm visible-xs">
              <small>A</small><span style={{fontSize: '1.25em'}} className="margin-sm-right">A</span>
              {helperText}
            </span>
          </NavItem>
        </OverlayTrigger>
      </OverlayTrigger>
    );
  }
}
