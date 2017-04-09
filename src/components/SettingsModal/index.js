import React, { PropTypes } from 'react';
import * as customProptypes from 'customPropTypes';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/lib/Modal';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';
import ReciterDropdown from 'components/ReciterDropdown';
import ContentDropdown from 'components/ContentDropdown';
import TooltipDropdown from 'components/TooltipDropdown';
import { setOption } from 'redux/actions/options.js';
import { load } from 'redux/actions/verses.js';

const ModalHeader = Modal.Header;
const ModalTitle = Modal.Title;
const ModalBody = Modal.Body;

const SettingsModal = ({
  chapter,
  ayahIds,
  open,
  handleHide,
  options,
  setOption,  // eslint-disable-line no-shadow
  load // eslint-disable-line no-shadow
}) => {
  const handleOptionChange = (payload) => {
    setOption(payload);

    if (chapter) {
      const first = [...ayahIds][0];
      const last = [...ayahIds][[...ayahIds].length - 1];
      load(chapter.chapterNumber, first, last, { ...options, ...payload });
    }
  };

  return (
    <Modal show={open} onHide={handleHide}>
      <ModalHeader closeButton>
        <ModalTitle className="montserrat">
          <LocaleFormattedMessage id="setting.title" defaultMessage="Settings" />
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <h5 className="text-black">
            <LocaleFormattedMessage id="setting.reciters.title" defaultMessage="Reciters" />
          </h5>
          <ReciterDropdown
            onOptionChange={handleOptionChange}
          />
        </div>
        <div className="form-group">
          <h5 className="text-black">
            <LocaleFormattedMessage id="setting.translations.title" defaultMessage="Translations" />
          </h5>
          <ContentDropdown
            onOptionChange={handleOptionChange}
          />
        </div>
        <div className="form-group">
          <h5 className="text-black">
            <LocaleFormattedMessage id="setting.tooltip.title" defaultMessage="Tooltip Content" />
          </h5>
          <TooltipDropdown
            tooltip={options.tooltip}
            onOptionChange={setOption}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

SettingsModal.propTypes = {
  chapter: customProptypes.surahType,
  ayahIds: PropTypes.instanceOf(Set),
  open: PropTypes.bool,
  handleHide: PropTypes.func.isRequired,
  options: customProptypes.optionsType,
  setOption: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
};

SettingsModal.defaultProps = {
  open: false
};

export default connect(state => ({
  options: state.options
}), { setOption, load })(SettingsModal);
