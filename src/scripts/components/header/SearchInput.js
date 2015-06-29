import React from 'react';
import {navigateAction} from 'fluxible-router';
import classNames from 'classnames';

class SearchInput extends React.Component {
  constructor(props, context) {
    super(props, context);
  };

  search(e) {
    if (e.keyCode === 13 || e.type === 'click') {
      let searching = e.target.value,
          ayah, pattern, surah;

      pattern = new RegExp(/\d[\.,\:,\,]\d/);

      if (pattern.test(searching)) {
        surah = searching.split(/[\.,\:,\,]/)[0];
        ayah = parseInt(searching.split(/[\.,\:,\,]/)[1]);

        this.context.executeAction(navigateAction, {
          url: '/' + surah + '/' + ayah + '-' + (ayah + 10)
        });
      } else {
        this.context.executeAction(navigateAction, {
          url: `/search?q=${searching}`
        });
      }
    }

    // This checks to see if the user is typing Arabic
    // and adjusts the text-align. 
    var classes = document.getElementsByClassName("SearchMeat");
    classes[0].addEventListener("keydown",function(){
      var arabic = new RegExp(/[\u0600-\u06FF]/);
      var character = this.value;
      var flag = arabic.test(character);
      if(flag){
        this.style.textAlign='right';
      } else {
        this.style.textAlign='left';
      }
    });
  };

  render() {
    var className = classNames({
      'right-inner-addon': true,
    }) + ' ' + this.props.className;

    return (
      <div className={className}>
        <i className="ss-icon ss-search" onClick={this.search.bind(this)} />
        <input type="text"
               placeholder="Search"
               className="SearchMeat"
               onKeyUp={this.search.bind(this)} />
      </div>
    );
  }
}

SearchInput.contextTypes = {
  executeAction: React.PropTypes.func.isRequired
};

SearchInput.displayName = 'SearchInput';

export default SearchInput;
