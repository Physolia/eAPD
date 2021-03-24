import PropTypes from 'prop-types';
import { Button } from '@cmsgov/design-system';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { Section, Subsection } from '../components/Section';

const ExportAndSubmit = ({ push: pushRoute }) => (
  <Section resource="exportAndSubmit">
    <Subsection resource="reviewAndDownload">
      <p>
        On the next page, you will be able to review and download a copy of your
        APD as the first step in submitting a completed APD to CMS.
      </p>
      <Button
        size="big"
        variation="primary"
        className="ds-u-margin-top--2"
        onClick={() => pushRoute('/print')}
      >
        Continue to Review
      </Button>
    </Subsection>
  </Section>
);

ExportAndSubmit.propTypes = {
  push: PropTypes.func.isRequired
};

const mapDispatchToProps = { push };

export default connect(null, mapDispatchToProps)(ExportAndSubmit);

export { ExportAndSubmit as plain, mapDispatchToProps };
