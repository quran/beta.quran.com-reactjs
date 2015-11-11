import React from 'react';
import {NavLink} from 'fluxible-router';

class NavBrand extends React.Component {
  render() {
    return (
      <div className="col-md-12 col-xs-12 navbar-brand">
        <NavLink href="/">
          <img src="https://quran-1f14.kxcdn.com/images/logo-md-w.png" alt="" className="logo" />
        </NavLink>
        <span className="title">THE NOBLE QURAN</span>
        <span className="menu visible-xs"
              onClick={this.props.showOptionsFn}>
          MENU
        </span>
      </div>
    );
  }
}

export default NavBrand;
