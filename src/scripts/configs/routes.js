import * as SurahsActions from 'actions/SurahsActions';
import * as AyahsActions from 'actions/AyahsActions';
import debug from 'debug';
const debugRoutes = debug('quran-com');

export default {
  index: {
    path: '/',
    method: 'get',
    page: 'index',
    title: `The Noble Qur'an - القرآن الكريم`,
    handler: require('../routes/Index'),
    action(actionContext, currentRoute, done) {
      actionContext.executeAction(
        SurahsActions.getSurahs,
        null,
        done
      );
    }
  },
  donations: {
    path: '/donations',
    method: 'get',
    page: 'donations',
    title: 'Contributing to Quran.com',
    handler: require('../routes/Donations')
  },
  contributions: {
    path: '/contributions',
    method: 'get',
    page: 'contributions',
    title: 'Contributing to Quran.com',
    handler: require('../routes/Donations')
  },
  about: {
    path: '/about',
    method: 'get',
    page: 'about',
    title: 'About Quran.com',
    handler: require('../routes/About')
  },
  contact: {
    path: '/contact',
    method: 'get',
    page: 'contact',
    title: 'Contact Quran.com',
    handler: require('../routes/Contact')
  },
  contactus: {
    path: '/contactus',
    method: 'get',
    page: 'contact',
    title: 'Contact Quran.com',
    handler: require('../routes/Contact')
  },
  search: {
    path: '/search',
    method: 'get',
    page: 'search',
    title: 'Search',
    handler: require('../routes/Search'),
    action(actionContext, currentRoute, done) {
      actionContext.executeAction(
        AyahsActions.search,
        {
          q: currentRoute.get('query').get('q'),
          p: currentRoute.get('query').get('p') || 1
        },
        done
      );
    }
  },
  surah: {
    path: '/:surahId/:range?',
    method: 'get',
    page: 'surah',
    title: 'Surah',
    handler: require('../routes/Surah'),
    action(actionContext, currentRoute, done) {
      if (isNaN(currentRoute.get('params').get('surahId'))) {
        return done({message: 'Route not found', reason: 'wrongRoute', statusCode: 404});
      }

      let fromParam,
          toParam,
          surahId = currentRoute.get('params').get('surahId');

      actionContext.executeAction(
        SurahsActions.getSurahs,
        currentRoute.get('params').get('surahId'),
        () => {
          var range = currentRoute.get('params').get('range');
          if (range) {
            if (range.indexOf('-') > -1) {
              fromParam = range.split('-')[0];
              toParam = range.split('-')[1];
            } else {
              fromParam = range;
              // Single ayah view.
              toParam = fromParam;
            }
          }
          else {
            fromParam = 1;
            toParam = 10;
          }

          actionContext.executeAction(AyahsActions.getAyahs, {
            surahId: surahId,
            from: fromParam,
            to: toParam
          }, done);
        }
      );
    }
  }
};
