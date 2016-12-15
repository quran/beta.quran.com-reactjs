import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Navbar from 'react-bootstrap/lib/Navbar';
const Header = Navbar.Header;

import LocaleFormattedMessage from 'components/LocaleFormattedMessage';

import debug from 'helpers/debug';

// const ornamentLeft = require('../../../../static/images/ornament-left.png');
// const ornamentRight = require('../../../../static/images/ornament-right.png');

const styles = require('./style.scss');

const SurahHeader = ({ surah, handleToggleSidebar, children }) => {
  debug('component:SurahHeader', 'Render');

  return (
    <Navbar className="montserrat surah" fixedTop fluid>
      <Header>
        <Row>
          <Col xs={1}>
            <button type="button" className="navbar-toggle collapsed" onClick={handleToggleSidebar}>
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </Col>
          <Col xs={10}>
            <ul className={`list-inline ${styles.container} text-center`}>
              <li className={styles.verticalAlign}>
                {
                  surah.id > 1 &&
                    <Link
                      data-metrics-event-name="Title:PreviousSurah"
                      className="navbar-text previous-chapter"
                      to={`/${surah.id - 1}`}
                    >
                      <i
                        data-metrics-event-name="Title:PreviousSurah"
                        className="ss-icon ss-navigateleft"
                      />
                      <span className="hidden-xs hidden-sm">
                        <LocaleFormattedMessage id={'surah.previous'} defaultMessage={'PREVIOUS SURAH'} />
                      </span>
                    </Link>
                }
              </li>
              <li className={styles.verticalAlign}>
                {
                  surah &&
                    <p className="navbar-text text-uppercase surah-name">
                      {surah.name.simple} ({surah.name.english}) - سورة {surah.name.arabic}
                    </p>
                }
              </li>
              <li className={styles.verticalAlign}>
                {
                  surah.id < 114 &&
                    <Link
                      data-metrics-event-name="Title:NextSurah"
                      className="navbar-text next-chapter"
                      to={`/${surah.id + 1}`}
                    >
                      <span className="hidden-xs hidden-sm">
                        <LocaleFormattedMessage id={'surah.next'} defaultMessage={'NEXT SURAH'} />
                      </span>
                      <i data-metrics-event-name="Title:NextSurah" className="ss-icon ss-navigateright" />
                    </Link>
                }
              </li>
            </ul>
          </Col>
        </Row>

      </Header>
    </Navbar>
  );
};

SurahHeader.propTypes = {
  surah: PropTypes.object.isRequired,
  handleToggleSidebar: PropTypes.func.isRequired
};

export default SurahHeader;
