import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ChoiceList } from '@cmsgov/design-system';
import CardForm from '../../components/CardForm';

import { STATES } from '../../util/states';
import axios from '../../util/api';

import { selectAffiliation } from '../../actions/auth';

const statesWithFederal = [...STATES, { id: 'fd', name: 'Federal' }];

const SelectAffiliation = ({
  currentStateId,
  error,
  selectAffiliation: selectUserAffiliation
}) => {
  const history = useHistory();

  const [selectedAffiliation, setSelectedAffiliation] =
    useState(currentStateId);
  const [availableAffiliations, setAvailableAffiliations] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const affiliations = await axios.get('/affiliations/me', {
        signal: controller.signal
      });
      const states = affiliations.data.map(affiliation => {
        return affiliation.stateId;
      });
      setAvailableAffiliations(states);
    })();

    return () => controller?.abort();
  }, []);

  const onSave = async () => {
    const route = await selectUserAffiliation(
      selectedAffiliation,
      currentStateId
    );
    if (route) {
      history.push(route);
    }
  };

  const choiceList = availableAffiliations.map(item => {
    const choice = {
      className: 'state-aff-item',
      label: statesWithFederal.find(state => state.id === item).name,
      value: item
    };
    if (item === currentStateId) {
      choice.defaultChecked = true;
    }
    return choice;
  });

  const sortedChoiceList = choiceList.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });

  const handleChoiceSelection = e => {
    setSelectedAffiliation(e.target.value);
  };

  return (
    <CardForm
      onSave={onSave}
      error={error}
      primaryButtonText={['Submit', 'Updating']}
      cancelable={false}
    >
      <h1 className="ds-h3">State Affiliation</h1>
      <ChoiceList
        choices={sortedChoiceList}
        label="Please select your state affiliation"
        labelClassName="ds-u-font-weight--normal ds-u-padding-bottom--1"
        name="radio_choices"
        type="radio"
        onChange={handleChoiceSelection}
      />
    </CardForm>
  );
};

SelectAffiliation.propTypes = {
  selectAffiliation: PropTypes.func.isRequired,
  currentStateId: PropTypes.string,
  error: PropTypes.string
};

SelectAffiliation.defaultProps = {
  currentStateId: '',
  error: null
};

const mapStateToProps = state => ({
  currentStateId: state.user.data.state.id,
  error: state.auth.error
});

const mapDispatchToProps = {
  selectAffiliation
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAffiliation);

export { SelectAffiliation as plain, mapStateToProps, mapDispatchToProps };
