import React, { Component, PropTypes } from 'react';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';

const style = require('./style.scss');

const compareAlphabetically = property =>
  (previous, next) => {
    const previousText = previous[property].toUpperCase();
    const nextText = next[property].toUpperCase();

    if (previousText < nextText) {
      return -1;
    }

    if (previousText > nextText) {
      return 1;
    }

    return 0;
  };

// To save API calls.
export const slugs = [
  {
    language: 'ar',
    name: 'ابن كثير',
    cardinality: 'n_ayah',
    slug: 'resource_id_14',
    id: 13,
    type: 'tafsir'
  },
  {
    language: 'en',
    name: 'Dr. Ghali',
    cardinality: '1_ayah',
    slug: 'dr_ghali',
    id: 16,
    type: 'translation'
  },
  {
    language: 'en',
    name: 'Muhsin Khan',
    cardinality: '1_ayah',
    slug: 'muhsin_khan',
    id: 17,
    type: 'translation'
  },
  {
    language: 'en',
    name: 'Pickthall',
    cardinality: '1_ayah',
    slug: 'pickthall',
    id: 18,
    type: 'translation'
  },
  {
    language: 'en',
    name: 'Sahih International',
    cardinality: '1_ayah',
    slug: 'sahih_international',
    id: 19,
    type: 'translation'
  },
  {
    language: 'en',
    name: 'Shakir',
    cardinality: '1_ayah',
    slug: 'shakir',
    id: 20,
    type: 'translation'
  },
  {
    language: 'en',
    name: 'Yusuf Ali',
    cardinality: '1_ayah',
    slug: 'yusuf_ali',
    id: 21,
    type: 'translation'
  },
  {
    language: 'az',
    name: 'Azerbaijani',
    cardinality: '1_ayah',
    slug: 'azerbaijani',
    id: 22,
    type: 'translation'
  },
  {
    language: 'bn',
    name: 'Bangla',
    cardinality: '1_ayah',
    slug: 'bangla',
    id: 23,
    type: 'translation'
  },
  {
    language: 'bs',
    name: 'Bosnian',
    cardinality: '1_ayah',
    slug: 'bosnian',
    id: 24,
    type: 'translation'
  },
  {
    language: 'cs',
    name: 'Czech',
    cardinality: '1_ayah',
    slug: 'czech',
    id: 25,
    type: 'translation'
  },
  {
    language: 'de',
    name: 'German',
    cardinality: '1_ayah',
    slug: 'german',
    id: 26,
    type: 'translation'
  },
  {
    language: 'es',
    name: 'Spanish',
    cardinality: '1_ayah',
    slug: 'spanish',
    id: 27,
    type: 'translation'
  },
  {
    language: 'fa',
    name: 'Farsi',
    cardinality: '1_ayah',
    slug: 'farsi',
    id: 28,
    type: 'translation'
  },
  {
    language: 'fi',
    name: 'Finnish',
    cardinality: '1_ayah',
    slug: 'finnish',
    id: 29,
    type: 'translation'
  },
  {
    language: 'fr',
    name: 'French',
    cardinality: '1_ayah',
    slug: 'french',
    id: 30,
    type: 'translation'
  },
  {
    language: 'ha',
    name: 'Hausa',
    cardinality: '1_ayah',
    slug: 'hausa',
    id: 31,
    type: 'translation'
  },
  {
    language: 'id',
    name: 'Indonesian',
    cardinality: '1_ayah',
    slug: 'indonesian',
    id: 32,
    type: 'translation'
  },
  {
    language: 'it',
    name: 'Italian',
    cardinality: '1_ayah',
    slug: 'italian',
    id: 33,
    type: 'translation'
  },
  {
    language: 'ja',
    name: 'Japanese',
    cardinality: '1_ayah',
    slug: 'japanese',
    id: 34,
    type: 'translation'
  },
  {
    language: 'ko',
    name: 'Korean',
    cardinality: '1_ayah',
    slug: 'korean',
    id: 35,
    type: 'translation'
  },
  {
    language: 'ml',
    name: 'Malayalam',
    cardinality: '1_ayah',
    slug: 'malayalam',
    id: 36,
    type: 'translation'
  },
  {
    language: 'mrn',
    name: 'Maranao',
    cardinality: '1_ayah',
    slug: 'maranao',
    id: 37,
    type: 'translation'
  },
  {
    language: 'ms',
    name: 'Malay',
    cardinality: '1_ayah',
    slug: 'malay',
    id: 38,
    type: 'translation'
  },
  {
    language: 'nl',
    name: 'Dutch',
    cardinality: '1_ayah',
    slug: 'dutch',
    id: 39,
    type: 'translation'
  },
  {
    language: 'no',
    name: 'Norwegian',
    cardinality: '1_ayah',
    slug: 'norwegian',
    id: 40,
    type: 'translation'
  },
  {
    language: 'pl',
    name: 'Polish',
    cardinality: '1_ayah',
    slug: 'polish',
    id: 41,
    type: 'translation'
  },
  {
    language: 'pt',
    name: 'Portuguese',
    cardinality: '1_ayah',
    slug: 'portuguese',
    id: 42,
    type: 'translation'
  },
  {
    language: 'ro',
    name: 'Romanian',
    cardinality: '1_ayah',
    slug: 'romanian',
    id: 43,
    type: 'translation'
  },
  {
    language: 'ru',
    name: 'Russian',
    cardinality: '1_ayah',
    slug: 'russian',
    id: 44,
    type: 'translation'
  },
  {
    language: 'so',
    name: 'Somali',
    cardinality: '1_ayah',
    slug: 'somali',
    id: 45,
    type: 'translation'
  },
  {
    language: 'sq',
    name: 'Albanian',
    cardinality: '1_ayah',
    slug: 'albanian',
    id: 46,
    type: 'translation'
  },
  {
    language: 'sv',
    name: 'Swedish',
    cardinality: '1_ayah',
    slug: 'swedish',
    id: 47,
    type: 'translation'
  },
  {
    language: 'sw',
    name: 'Swahili',
    cardinality: '1_ayah',
    slug: 'swahili',
    id: 48,
    type: 'translation'
  },
  {
    language: 'ta',
    name: 'Tamil',
    cardinality: '1_ayah',
    slug: 'tamil',
    id: 49,
    type: 'translation'
  },
  {
    language: 'th',
    name: 'Thai',
    cardinality: '1_ayah',
    slug: 'thai',
    id: 50,
    type: 'translation'
  },
  {
    language: 'tr',
    name: 'Turkish',
    cardinality: '1_ayah',
    slug: 'turkish',
    id: 51,
    type: 'translation'
  },
  {
    language: 'tt',
    name: 'Tatar',
    cardinality: '1_ayah',
    slug: 'tatar',
    id: 52,
    type: 'translation'
  },
  {
    language: 'ur',
    name: 'Urdu',
    cardinality: '1_ayah',
    slug: 'urdu',
    id: 53,
    type: 'translation'
  },
  {
    language: 'uz',
    name: 'Uzbek',
    cardinality: '1_ayah',
    slug: 'uzbek',
    id: 54,
    type: 'translation'
  },
  {
    language: 'zh',
    name: 'Chinese',
    cardinality: '1_ayah',
    slug: 'chinese',
    id: 55,
    type: 'translation'
  },
  {
    language: 'en',
    name: 'Transliteration',
    cardinality: '1_ayah',
    slug: 'transliteration',
    id: 56,
    type: 'transliteration'
  }
].sort(compareAlphabetically('name'));

export default class ContentDropdown extends Component {
  static propTypes = {
    onOptionChange: PropTypes.func.isRequired,
    content: PropTypes.arrayOf(PropTypes.number).isRequired,
    className: PropTypes.string
  };

  handleRemoveContent = () => {
    const { onOptionChange } = this.props;

    onOptionChange({ content: [] });
  }

  handleOptionSelected(id) {
    const { onOptionChange, content } = this.props;

    if (content.find(option => option === id)) {
      onOptionChange({ content: content.filter(option => option !== id) });
    } else {
      onOptionChange({ content: [...content, id] });
    }
  }

  renderItems(items) {
    const { content } = this.props;

    return items.map((slug) => {
      const checked = content.find(option => option === slug.id);

      return (
        <li key={slug.name} className={style.item}>
          <input
            type="checkbox"
            className={style.checkbox}
            id={slug.id + slug.language}
            onChange={() => this.handleOptionSelected(slug.id)}
            checked={checked}
          />

          <label htmlFor={slug.id + slug.language} className={style.label}>
            {slug.name}
          </label>
        </li>
      );
    });
  }

  renderEnglishList() {
    return this.renderItems(
      slugs.filter(slug => slug.language === 'en')
    );
  }

  renderLanguagesList() {
    return this.renderItems(
      slugs.filter(slug => slug.language !== 'en' && slug.type === 'translation')
    );
  }

  render() {
    const { className, content } = this.props;
    const title = slugs.filter(slug => content.includes(slug.id)).map(slug => slug.name).join(', ');

    return (
      <ButtonToolbar>
        <DropdownButton
          block
          id="content-dropdown"
          className={`dropdown ${className} ${style.dropdown}`}
          title={title}
        >
          {
            content.length &&
              <MenuItem onClick={this.handleRemoveContent}>
                <LocaleFormattedMessage id="setting.translations.removeAll" defaultMessage="Remove all" />
              </MenuItem>
          }
          <MenuItem header>
            <LocaleFormattedMessage id="setting.translations.english" defaultMessage="English" />
          </MenuItem>
          {this.renderEnglishList()}
          <MenuItem divider />
          <MenuItem header>
            <LocaleFormattedMessage id="setting.translations.other" defaultMessage="Other Languages" />
          </MenuItem>
          {this.renderLanguagesList()}
        </DropdownButton>
      </ButtonToolbar>
    );
  }
}
