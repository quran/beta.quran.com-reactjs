import React from 'react';
import Link from 'react-router/lib/Link';

class IndexHeaderNav extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false
    };
  }

  openNav(e) {
    e.preventDefault();

    this.setState({open: !this.state.open});
  }

  links() {
    let classNames = `links ${this.state.open ? 'open' : ''}`;

    if (this.props.navlink === false) {
      return (
        <ul className={classNames}>
          <li>
            <a href="http://legacy.quran.com" data-metrics-event-name="IndexHeader:Link:Legacy">Legacy Quran.com</a>
          </li>
          <li>
            <a href="https://quran.zendesk.com/hc/en-us" data-metrics-event-name="IndexHeader:Link:Contact">
              Contact us
            </a>
          </li>
        </ul>
      );
    }
    else {
      return (
        <ul className={classNames}>
          <li>
            <a href="http://legacy.quran.com" data-metrics-event-name="IndexHeader:Link:Legacy">Legacy Quran.com</a>
          </li>
          <li>
            <Link to="/donations" data-metrics-event-name="IndexHeader:Link:Contribute">
              Contribute
            </Link>
          </li>
          <li>
            <a href="https://quran.zendesk.com/hc/en-us" data-metrics-event-name="IndexHeader:Link:Contact">
              Contact us
            </a>
          </li>
        </ul>
      );
    }
  }

  render() {
    return (
      <div className="nav">
        {this.links()}
      </div>
    );
  }
}

export default IndexHeaderNav;
