import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import IndexHeader from 'components/IndexHeader';
import cookie from 'react-cookie';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import debug from 'helpers/debug';
import { isAllLoaded, loadAll } from 'redux/actions/surahs.js';

import LastVisit from 'components/Home/LastVisit';
import SurahsList from 'components/Home/SurahsList';
import QuickSurahs from 'components/Home/QuickSurahs';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';
import { surahType } from 'types';

const styles = require('./style.scss');

const Home = (props) => {
  debug('component:Index', 'Render');

  const lastVisit = cookie.load('lastVisit') || null;

  return (
    <div className="index-page">
      <Helmet title="The Noble Quran - القرآن الكريم" titleTemplate="%s" />
      <IndexHeader />
      <div className={`container ${styles.list}`}>
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            {lastVisit && <LastVisit surah={props.surahs[lastVisit.surahId]} ayah={lastVisit.ayahId}/>}
            <QuickSurahs />
            <h4 className={`text-muted ${styles.title}`}>
              <LocaleFormattedMessage id="surah.index.heading" defaultMessage="SURAHS (CHAPTERS)" />
            </h4>
            <div className="row">
              <SurahsList surahs={Object.values(props.surahs).slice(0, 38)} />
              <SurahsList surahs={Object.values(props.surahs).slice(38, 76)} />
              <SurahsList surahs={Object.values(props.surahs).slice(76, 114)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  surahs: PropTypes.objectOf(surahType).isRequired
};

const AsyncHome = asyncConnect([{
  promise({ store: { getState, dispatch } }) {
    if (!isAllLoaded(getState())) {
      return dispatch(loadAll());
    }

    return true;
  }
}])(Home);

export default connect(state => ({ surahs: state.surahs.entities }))(AsyncHome);
