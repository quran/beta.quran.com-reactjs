import sitemap from 'sitemap';

import ApiClient from 'helpers/ApiClient';

export default (server) => {
  server.get('/sitemap.xml', (req, res) => {
    const client = new ApiClient(req);
    const urls = [];

    client.get('/api/v3/chapters').then((response) => {
      response.chapters.forEach((chapter) => {
        Array(chapter.verses_count).fill().forEach((_, index) => {
          const verseId = index + 1;

          urls.push({
            url: `/${chapter.id}/${verseId}`,
            changefreq: 'weekly',
            priority: 1
          });

          urls.push({
            url: `/${chapter.id}/${verseId}-${verseId + 9}`,
            changefreq: 'weekly',
            priority: 1
          });
        });

        urls.push({
          url: `/${chapter.id}`,
          changefreq: 'weekly',
          priority: 1
        });

        urls.push({
          url: `/${chapter.id}/info`,
          changefreq: 'weekly',
          priority: 1
        });

        urls.push({
          url: `/${chapter.id}/info/ur`,
          changefreq: 'weekly',
          priority: 1
        });

        urls.push({
          url: `/${chapter.id}/info/ml`,
          changefreq: 'weekly',
          priority: 1
        });

        urls.push({
          url: `/${chapter.id}/info/ta`,
          changefreq: 'weekly',
          priority: 1
        });

        urls.push({
          url: `/${chapter.id}/info/en`,
          changefreq: 'weekly',
          priority: 1
        });
      });

      const xml = sitemap.createSitemap({
        hostname: 'https://quran.com',
        cacheTime: 600000,  // 600 sec cache period
        urls: [
          ...urls,
          { url: '/about', changefreq: 'monthly', priority: 0.3 },
          { url: '/contactus', changefreq: 'monthly', priority: 0.3 },
          { url: '/contact', changefreq: 'monthly', priority: 0.3 },
          { url: '/donations', changefreq: 'monthly', priority: 0.3 },
          { url: '/contributions', changefreq: 'monthly', priority: 0.3 },

          { url: '/search', changefreq: 'weekly', priority: 0.8 }
        ]
      });

      res.header('Content-Type', 'application/xml');
      res.send(xml.toString());
    }).catch(err => console.trace(err)); // eslint-disable-line
  });
};
