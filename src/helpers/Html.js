/* eslint-disable global-require */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';

const Html = ({ store, component, assets }) => {
  const content = component ? ReactDOM.renderToString(component) : '';
  const head = Helmet.rewind();

  return (
    <html>
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        {head.style.toComponent()}

        {Object.keys(assets.styles).map((style, i) => (
          <link
            href={assets.styles[style]}
            key={i} media="screen, projection"
            rel="stylesheet"
            type="text/css"
          />
        ))}
        {
          Object.keys(assets.styles).length === 0 ?
            <style dangerouslySetInnerHTML={{__html: (require('../../bootstrap.config'))}} /> :
          null
        }
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{__html: content}} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-8496014-1', 'auto');
            `
          }}
          charSet="UTF-8"
        />
        <script
          dangerouslySetInnerHTML={{__html: `window.reduxData=${serialize(store.getState())};`}}
          charSet="UTF-8"
        />
        <script src="https://cdn.ravenjs.com/3.0.4/raven.min.js" />
        {Object.keys(assets.javascript).map((script, i) =>
          <script src={assets.javascript[script]} key={i} />
        )}
      </body>
    </html>
  );
};

Html.propTypes = {
  store: PropTypes.object,
  assets: PropTypes.object,
  component: PropTypes.any
};

export default Html;
