import * as customPropTypes from 'customPropTypes';
import React from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';
import { asyncComponent } from 'react-async-component';
import Button from 'quran-components/lib/Button';
import ComponentLoader from 'components/ComponentLoader';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';
import makeHeadTags from 'helpers/makeHeadTags';

const Tafsir = asyncComponent({
  resolve: () => import(/* webpackChunkName: "Tafsir" */ 'components/Tafsir'),
  LoadingComponent: ComponentLoader,
});

const VerseTafsir = ({ verse, tafsir }) => {
  if(verse) {
    return (
      <div className="row" style={{ marginTop: 20 }}>
        <Helmet
          {...makeHeadTags({
            title: `${tafsir ? tafsir.resourceName : 'Tafsir'} of ${
              verse.verseKey
              }`,
            description: `${tafsir ? tafsir.resourceName : 'Tafsir'} of ${
              verse.verseKey
              } - ${verse.textMadani}`, // eslint-disable-line max-len
          })}
          script={[
            {
              type: 'application/ld+json',
              innerHTML: `{
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@id": "https://quran.com/",
              "name": "Quran"
            }
          },{
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@id": "https://quran.com/${verse.verseKey}",
              "name": "${verse.verseKey}"
            }
          }]
        }`,
            },
          ]}
        />

        <div className={'container-fluid'}>
          <div className="row">
            <Tafsir tafsir={tafsir} verse={verse} />

            <div className="col-md-12">
              <div className="text-center">
                <Button href={`/${verse.chapterId}/${verse.verseNumber}`}>
                  <LocaleFormattedMessage
                    id="verse.backToAyah"
                    defaultMessage="Back to Ayah"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <ComponentLoader/>
  }
};

VerseTafsir.propTypes = {
  verse: customPropTypes.verseType,
  tafsir: customPropTypes.tafsirType,
};

function mapStateToProps(state, ownProps) {
  const verseKey = `${ownProps.match.params.chapterId}:${
    ownProps.match.params.range
  }`;
  const chapterId = parseInt(ownProps.match.params.chapterId, 10);
  const tafsirId = ownProps.match.params.tafsirId;
  const verse = state.verses.entities[chapterId][verseKey];

  return {
    verse,
    tafsir: state.verses.tafsirs[`${verseKey}-${tafsirId}`],
  };
}

export default connect(mapStateToProps)(VerseTafsir);
