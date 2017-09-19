/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as customPropTypes from 'customPropTypes';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/lib/Navbar';
import Drawer from 'quran-components/lib/Drawer';
import Nav from 'react-bootstrap/lib/Nav';

import ComponentLoader from '../ComponentLoader';
import LocaleSwitcher from '../LocaleSwitcher';
import LocaleFormattedMessage from '../LocaleFormattedMessage';

import debug from '../../helpers/debug';

const styles = require('./style.scss');

const NavbarHeader = Navbar.Header;

const GlobalSidebar = Loadable({
  loader: () =>
    import(/* webpackChunkName: "GlobalSidebar" */ 'components/GlobalSidebar'),
  loading: ComponentLoader
});

class GlobalNav extends Component {
  state = {
    scrolled: false,
    drawerOpen: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleNavbar, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleNavbar, true);
  }

  handleNavbar = () => {
    const { isStatic } = this.props;
    const { scrolled } = this.state;

    if (window.pageYOffset > 50) {
      if (!scrolled && !isStatic) {
        this.setState({ scrolled: true });
      }
    } else if (scrolled) {
      this.setState({ scrolled: false });
    }

    return false;
  };

  handleDrawerToggle = (open) => {
    this.setState({ drawerOpen: open });
  };

  isHome() {
    return !this.props.history || this.props.history.location.pathname === '/';
  }

  renderRightControls() {
    const { user, rightControls } = this.props;

    return (
      rightControls || [
        <li>
          <a
            href="https://quranicaudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            data-metrics-event-name="Sites:Audio"
          >
            Audio
          </a>
        </li>,
        <li>
          <a
            href="http://salah.com/"
            target="_blank"
            rel="noopener noreferrer"
            data-metrics-event-name="Sites:Salah"
          >
            Salah
          </a>
        </li>,
        <li>
          <a
            href="http://sunnah.com/"
            target="_blank"
            rel="noopener noreferrer"
            data-metrics-event-name="Sites:Sunnah"
          >
            Sunnah
          </a>
        </li>,
        <LocaleSwitcher />,
        user ? (
          <li>
            <Link
              to="/profile"
              data-metrics-event-name="IndexHeader:Link:Profile"
            >
              {user.firstName || user.name}
            </Link>
          </li>
        ) : (
          <noscript />
        )
      ]
    );
  }

  render() {
    const { leftControls, isStatic } = this.props;
    debug('component:GlobalNav', 'Render');

    return (
      <Navbar
        className={`montserrat ${this.state.scrolled && styles.scrolled}`}
        fixedTop={!isStatic}
        fluid
        static={isStatic}
      >
        <Drawer
          drawerClickClose={false}
          open={this.state.drawerOpen}
          handleOpen={this.handleDrawerToggle}
          toggle={
            <button type="button" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
          }
          header={
            <NavbarHeader>
              <p className="navbar-text">
                <Link to="/">
                  <LocaleFormattedMessage
                    id="nav.title"
                    defaultMessage="Quran"
                  />
                </Link>
              </p>
            </NavbarHeader>
          }
        >
          <GlobalSidebar />
        </Drawer>
        <Nav className={styles.nav}>
          {!this.isHome() && (
            <li>
              <Link to="/">
                <i className="ss-icon ss-home" />
              </Link>
            </li>
          )}
          {this.isHome() && (
            <LocaleSwitcher className="visible-xs-inline-block" />
          )}
          {leftControls &&
            leftControls.map((control, index) =>
              React.cloneElement(control, { key: index })
            )}
        </Nav>
        <Nav pullRight className="hidden-xs hidden-sm">
          {this.renderRightControls().map((control, index) =>
            React.cloneElement(control, { key: index })
          )}
        </Nav>
      </Navbar>
    );
  }
}

GlobalNav.propTypes = {
  leftControls: PropTypes.arrayOf(PropTypes.element),
  rightControls: PropTypes.arrayOf(PropTypes.element),
  isStatic: PropTypes.bool.isRequired,
  user: customPropTypes.userType,
  location: customPropTypes.location,
  history: PropTypes.object.isRequired // eslint-disable-line
};

GlobalNav.defaultProps = {
  isStatic: false
};

export default connect(state => ({
  user: state.auth.user
}))(GlobalNav);
