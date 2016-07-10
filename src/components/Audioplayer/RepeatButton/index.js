import React, { Component, PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import SwitchToggle from 'components/SwitchToggle';

const style = require('../style.scss');

export default class RepeatButton extends Component {
  static propTypes = {
    surah: PropTypes.object.isRequired,
    repeat: PropTypes.shape({
      from: PropTypes.number.isRequired,
      to: PropTypes.number.isRequired,
      times: PropTypes.number
    }).isRequired,
    setRepeat: PropTypes.func.isRequired,
    current: PropTypes.number.isRequired
  };

  state = {
    nav: 1
  };

  handleToggle = () => {
    const { repeat, setRepeat, current } = this.props;

    if (repeat.from) {
      return setRepeat({});
    }

    return setRepeat({
      from: current,
      to: current
    });
  }

  handleNavChange = (nav) => {
    const { setRepeat, current } = this.props;

    this.setState({ nav });

    if (nav === 1) {
      // Should set single ayah
      return setRepeat({
        from: current,
        to: current
      });
    }

    return setRepeat({
      from: current,
      to: current + 3
    });
  }

  renderRangeAyahs() {
    const { surah, repeat, setRepeat } = this.props;
    const array = Array(surah.ayat).join().split(',');

    return (
      <Col md={12} style={{paddingTop: 15}}>
        <ul className="list-inline">
          <li>
            <select
              className="form-control"
              value={repeat.from}
              onChange={(event) => setRepeat({
                ...repeat,
                from: parseInt(event.target.value, 10),
                to: parseInt(event.target.value, 10)
              })}
            >
              {
                array.map((ayah, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))
              }
            </select>
          </li>
          <li> - </li>
          <li>
            <select
              className="form-control"
              value={repeat.to}
              onChange={(event) => setRepeat({ ...repeat, to: parseInt(event.target.value, 10)})}
            >
              {
                array.map((ayah, index) => (
                  <option key={index} value={repeat.from ? index + 1 + repeat.from : index + 1}>
                    {repeat.from ? index + 1 + repeat.from : index + 1}
                  </option>
                ))
              }
            </select>
          </li>
        </ul>
      </Col>
    );
  }

  renderSingleAyah() {
    const { current } = this.props;

    return (
      <Col md={12}>
        <h5>
          Repeating Ayah: {current}
        </h5>
      </Col>
    );
  }

  renderOptions() {
    const { repeat } = this.props;

    return (
      <Row className={!repeat.from && style.disabled}>
        <Col md={12}>
          <Nav
            bsStyle="pills"
            activeKey={this.state.nav}
            onSelect={this.handleNavChange}
          >
            <NavItem eventKey={1} title="Single Ayah" className={style.pill}>
              Single Ayah
            </NavItem>
            <NavItem eventKey={2} title="Range" className={style.pill}>
              Range
            </NavItem>
          </Nav>
        </Col>
      </Row>
    );
  }

  render() {
    const { repeat } = this.props;

    const popover = (
      <Popover
        id="FontSizeDropdown"
        className={style.popover}
        title={
          <Row>
            <Col md={12} className="text-center">
              Toggle repeat{'  '}
              <SwitchToggle
                checked={!!repeat.from}
                onToggle={this.handleToggle}
                id="repeat-toggle"
                flat
              />
            </Col>
          </Row>
        }
      >
        {this.renderOptions()}
        <Row>
          {this.state.nav === 1 ? this.renderSingleAyah() : this.renderRangeAyahs()}
        </Row>
      </Popover>
    );

    return (
      <div className="text-center">
        <OverlayTrigger
          overlay={popover}
          placement="bottom"
          trigger="click"
          rootClose
        >
          <i
            className={`pointer ss-icon ss-repeat ${style.buttons} ${repeat.from && style.repeat}`}
          />
        </OverlayTrigger>
      </div>
    );
  }
}
