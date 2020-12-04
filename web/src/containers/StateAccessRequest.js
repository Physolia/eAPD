import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Autocomplete, TextField } from '@cmsgov/design-system';

import AuthenticationForm from '../components/AuthenticationForm';
import { usStatesDropdownOptions } from '../util/states';

const StateAccessRequest = ({ action, errorMessage, fetching }) => {
  const [selectedStates, setStates] = useState([
    usStatesDropdownOptions[0].value
  ]);

  const changeStates = ({ target: { value } }) => {
    setStates([value]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    action(selectedStates);
  };

  return (
    <div id="start-main-content">
      <AuthenticationForm
        title="Verify Your Identity"
        legend="Verify Your Identity"
        cancelable
        className="ds-u-margin-top--7"
        canSubmit={!!selectedStates}
        error={errorMessage}
        success={null}
        working={fetching}
        primaryButtonText={['Submit', 'Submitting']}
        onSave={handleSubmit}
      >
        <div className="ds-u-margin-bottom--4">
          <label
            htmlFor="states"
            className="ds-c-label ds-u-margin-y--2 ds-u-font-weight--normal"
          >
            Select your State Affiliation.
          </label>
          {/* <Dropdown
            label=""
            ariaLabel="Select your State Affiliation"
            id="states"
            name="states"
            options={usStatesDropdownOptions}
            size="medium"
            value={selectedStates}
            onChange={changeStates}
          /> */}
          <Autocomplete
            items={[
              {
                id: 'kRf6c2fY',
                name: 'Cook County, IL'
              },
              {
                id: 'lYf5cGfM',
                name: 'Cook County, MD'
              },
              {
                id: 'mZfKcGf9',
                name: 'Cook County, TN'
              }
            ]}
            onChange={selectedItem => console.log(selectedItem)}
            onInputValueChange={inputVal =>
              console.log('[Autocomplete]: ' + inputVal)
            }
          >
            <TextField
              hint="Type c then use ARROW keys to change options, ENTER key to make a selection, ESC to dismiss."
              label="Simple list"
              name="Downshift_autocomplete"
            />
          </Autocomplete>
        </div>
      </AuthenticationForm>
    </div>
  );
};

StateAccessRequest.propTypes = {
  errorMessage: PropTypes.bool,
  fetching: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired
};

StateAccessRequest.defaultProps = {
  errorMessage: false
};

export default StateAccessRequest;
