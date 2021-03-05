import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Button, Tabs, TabPanel } from '@cmsgov/design-system';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@cmsgov/design-system';

import {
  getStateAffiliations,
  updateStateAffiliation,
  getRoleTypes
} from '../../actions/admin';

// import { getUserStateOrTerritory } from '../../reducers/user.selector';

import ManageRoleDialog from './ManageRoleDialog';
import ConfirmationDialog from './ConfirmationDialog';
import ManageUserTable from './ManageUserTable';

const FederalAdmin = ({

}) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [isFetching, setIsFetching] = useState(true);
  const [isDenied, setIsDenied] = useState(true);

  const [selectedAffiliation, setSelectedAffiliation] = useState();

  const [manageModalDisplay, setManageModalDisplay] = useState(false);
  const [confirmationModalDisplay, setConfirmationModalDisplay] = useState(
    false
  );

  useEffect(() => {

  }, []);

  useEffect(() => {

  }, []);

  const currentTab = id => {
    setActiveTab(id);
  };

  const showManageModal = event => {

  };

  const hideManageModal = () => {
    setManageModalDisplay(false);
  };

  const handleAffiliationUpdate = roleId => {

  };

  const showConfirmationModal = event => {

  };

  const hideConfirmationModal = () => {
    setConfirmationModalDisplay(false);
  };

  const handleDenyOrRevoke = () => {

  };

  return (
    <main
      id="start-main-content"
      className="ds-l-container ds-u-margin-bottom--5"
    >
      <h1>eAPD Federal Administrator Portal</h1>
      <h2>State Administrator Requests</h2>
      <Tabs onChange={currentTab}>
        <TabPanel id="pending" tab="Requests">
          <Table borderless>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Tif Forkner</TableCell>
              <TableCell>tif@fearless.tech</TableCell>
              <TableCell>
                <a href="# ">4108675309</a>
              </TableCell>
              <TableCell>Maryland</TableCell>
              <TableCell>
                <Button
                  onClick={showManageModal}
                  size="small"
                  className="ds-u-margin-right--2"
                  key="action1"
                >
                  Approve
                </Button>
                <Button
                  onClick={showConfirmationModal}
                  size="small"
                  variation="danger"
                  data-deny-or-revoke="deny"
                  key="action2"
                >
                  Deny
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ty Bolt</TableCell>
              <TableCell>tbolt@fearless.tech</TableCell>
              <TableCell>
                <a href="# ">4108675309</a>
              </TableCell>
              <TableCell>New York</TableCell>
              <TableCell>
                <Button
                    onClick={showManageModal}
                    size="small"
                    className="ds-u-margin-right--2"
                    key="action1"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={showConfirmationModal}
                    size="small"
                    variation="danger"
                    data-deny-or-revoke="deny"
                    key="action2"
                  >
                    Deny
                  </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </TabPanel>
        <TabPanel id="active" tab="Active">

        </TabPanel>
        <TabPanel id="inactive" tab="Inactive">

        </TabPanel>
      </Tabs>

      {confirmationModalDisplay && (
        <ConfirmationDialog
          hideConfirmationModal={hideConfirmationModal}
          showConfirmationModal={showConfirmationModal}
        />
      )}

      {manageModalDisplay && (
        <ManageRoleDialog
          hideManageModal={hideManageModal}
          showManageModal={showManageModal}
        />
      )}
    </main>
  );
};

FederalAdmin.propTypes = {

};

FederalAdmin.defaultProps = {

};

const mapDispatchToProps = {

};

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(FederalAdmin);

export { FederalAdmin as plain, mapStateToProps, mapDispatchToProps };
