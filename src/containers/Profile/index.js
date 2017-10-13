import React, { Component } from 'react';
import * as customPropTypes from 'customPropTypes';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import Image from 'react-bootstrap/lib/Image';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

const styles = require('./style.scss');

// eslint-disable-next-line
class Profile extends Component {
  render() {
    const { user, bookmarks } = this.props;

    return (
      <div className="min-container">
        <Helmet title="The Noble Quran - القرآن الكريم" titleTemplate="%s" />
        <div className={styles.header} />
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <Image
                src={`${user.image}?type=large`}
                circle
                className={styles.image}
              />
              <h2>
                {user.name}
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <Tabs
                bsStyle="pills"
                defaultActiveKey={1}
                className={styles.tabs}
                id="tabs"
              >
                <Tab eventKey={1} title="Bookmarks">
                  <ul className="list-group">
                    {Object.values(bookmarks).map(bookmark =>
                      <Link
                        to={bookmark.verseKey.split(':').join('/')}
                        className="list-group-item"
                      >
                        {bookmark.verseKey}
                      </Link>
                    )}
                  </ul>
                </Tab>
                <Tab eventKey={2} title="Notes">
                  Notes...
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  user: customPropTypes.userType.isRequired,
  bookmarks: customPropTypes.bookmarkType.isRequired
};

export default connect(state => ({
  user: state.auth.user,
  bookmarks: state.bookmarks.entities
}))(Profile);
