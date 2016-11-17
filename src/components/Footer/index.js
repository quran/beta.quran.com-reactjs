import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const styles = require('./style.scss');

const Footer = () => (
  <footer className={styles.footer}>
    <Grid>
      <Col md={10} mdOffset={1}>
        <Row>
          <Col md={2} sm={4} xs={12} className={styles.about}>
            <p>Navigate</p>
            <ul className={`source-sans ${styles.list}`}>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li>
                <a href="https://quran.zendesk.com/hc/en-us/articles/210090626-Development-help" target="_blank" data-metrics-event-name="Footer:Link:Developer">
                  Developers
                </a>
              </li>
            </ul>
          </Col>
          <Col md={3} sm={4} xs={12} className={styles.links}>
            <p>Useful sites</p>
            <ul className={`source-sans ${styles.list}`}>
              <li><a target="_blank" href="http://sunnah.com/" data-metrics-event-name="Footer:Link:Sunnah">Sunnah.com</a></li>
              <li><a target="_blank" href="http://salah.com/" data-metrics-event-name="Footer:Link:Salah">Salah.com</a></li>
              <li><a target="_blank" href="http://quranicaudio.com/" data-metrics-event-name="Footer:Link:QuranicAudio">QuranicAudio.com</a></li>
              <li>
                <a target="_blank" href="http://corpus.quran.com/wordbyword.jsp" data-metrics-event-name="Footer:Link:Corpus">
                  Corpus: Word by Word
                </a>
              </li>
            </ul>
          </Col>
          <Col md={3} sm={4} xs={12} className={styles.links}>
            <p>Other links</p>
            <ul className={`source-sans ${styles.list}`}>
              <li><a href="/sitemap.xml">Sitemap</a></li>
              <li>
                <Link
                  to="/36"
                  data-metrics-event-name="Footer:Link:Click"
                  data-metrics-surah-id="36"
                >
                  Surah Yasin, Yaseen (يس)
                </Link>
              </li>
              <li>
                <Link
                  to="/2/255"
                  data-metrics-event-name="Footer:Link:Click"
                  data-metrics-surah-id="2/255"
                >
                  Ayat Al-Kursi (آية الكرسي)
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4} sm={12} xs={12} className={styles.links}>
            <p className="monserrat">
              Quran.com ( also known as The Noble Quran, Al Quran, Holy Quran, Koran ){' '}
              is a pro bono project.
            </p>

            <p className="monserrat">&copy; QURAN.COM. ALL RIGHTS RESERVED 2016</p>
          </Col>
        </Row>
      </Col>
    </Grid>
  </footer>
);

export default Footer;
