import React, { PropTypes } from 'react';
import debug from 'helpers/debug';
import Link from 'react-router/lib/Link';

import { surahType } from 'types';

const styles = require('./style.scss');

const SurahsList = (props) => {
  debug('component:Index', 'SurahsList');

  return (
    <ul className="col-md-4 list-unstyled">
      {props.surahs.map(surah => (
        <li className={`${styles.item}`} key={surah.id}>
          <Link to={`/${surah.id}`} className={`${styles.link} row`}>
            <div className="col-xs-2 text-muted">
              {surah.id}
            </div>

            <div className="col-xs-7">
              سورة {surah.nameArabic}
            </div>

            <div className={`col-xs-3 text-left ${styles.arabic}`}>
              <span className={`icon-surah${surah.id}`}>
              </span>
            </div>

            <div className={`col-md-12 col-md-push-2 ${styles.translated_name}`}>
              <span className={`text-uppercase ${surah.translatedName.languageName}`}>{surah.translatedName.name}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>);
};

SurahsList.propTypes = {
  surahs: PropTypes.arrayOf(surahType).isRequired
};

export default SurahsList;
