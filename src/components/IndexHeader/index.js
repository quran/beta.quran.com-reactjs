import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import SearchInput from 'components/SearchInput';
import Jumbotron from 'quran-components/lib/Jumbotron';
import styled from 'styled-components';

const logo = require('../../../static/images/logo-lg-w.png');

const StyledLink = styled(Link)`
  display: inline-block;
  width: 30%;
  margin-top: 35px;
`;

const Logo = styled.img`
  padding-top: 10px;
  padding-bottom: 10px;
  height: auto;
  width: 100%;
`;

const Title = styled.h4`
  color: ${props => props.theme.brandPrimary};
  font-size: 160%;
  padding-bottom: 3.5%;
`;

const IndexHeader = props => (
  <Jumbotron>
    <div className="container">
      <div className="row">
        <div className="col-md-10 col-md-offset-1 text-center">
          <StyledLink to="/" data-metrics-event-name="IndexHeader:Link:Index">
            <Logo src={logo} alt="logo" />
          </StyledLink>
          <Title>THE NOBLE QURAN</Title>
          {!props.noSearch && <SearchInput />}
        </div>
      </div>
    </div>
  </Jumbotron>
);

IndexHeader.propTypes = {
  noSearch: PropTypes.bool
};

export default IndexHeader;
