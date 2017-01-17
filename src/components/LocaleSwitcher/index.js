/* global window */
import React, { Component } from 'react';
import cookie from 'react-cookie';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';
import { locales, defaultLocale } from '../../config';

export default class LocaleSwitcher extends Component {
  state = {
    currentLocale: defaultLocale,
  };

  componentDidMount() {
    if (__CLIENT__) {
      // TODO: This should be passed in as a prop!
      this.setState({ currentLocale: cookie.load('currentLocale') || defaultLocale }); // eslint-disable-line
    }
  }

  handleLocaleClick(locale, e) {
    e.preventDefault();
    const expireDate = new Date();
    expireDate.setYear(expireDate.getFullYear() + 1);

    this.setState({ currentLocale: locale });

    cookie.save('currentLocale', locale, {
      path: '/',
      expires: new Date(expireDate),
    });

    window.location.reload();
  }

  renderList() {
    const keys = Object.keys(locales);

    return keys.map(key => (
      <MenuItem
        key={key}
        className={key === this.state.currentLocale && 'active'} // NOTE: if you use key `active` it will make all dropdown active
        onClick={() => this.handleLocaleClick(key)}
        href={`?local=${key}`}
      >
        {locales[key]}
      </MenuItem>
    ));
  }

  render() {
    return (
      <NavDropdown
        active={false}
        id="site-language-dropdown"
        title={<LocaleFormattedMessage id="local.siteLocale" defaultMessage="Site language " />}
      >
        {this.renderList()}
      </NavDropdown>
    );
  }
}
