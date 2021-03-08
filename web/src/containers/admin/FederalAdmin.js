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


const FederalAdmin = ({

}) => {
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {

  }, []);

  const currentTab = id => {
    setActiveTab(id);
  };

  const approveStateAdmin = event => {
    console.log("approved hit");
    console.log("event", event.target);
  };
  
  const denyStateAdmin = event => {
    console.log("deny hit");
    console.log("event", event.target);
  };

  return (
    <main
      id="start-main-content"
      className="ds-l-container ds-u-margin-bottom--5"
    >
      <h1>eAPD Federal Administrator Portal</h1>
      <Tabs onChange={currentTab}>
        <TabPanel id="pending" tab="State Admin Requests">
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
                    onClick={approveStateAdmin}
                    size="small"
                    className="ds-u-margin-right--2"
                    key="action1"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={denyStateAdmin}
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
                      onClick={approveStateAdmin}
                      size="small"
                      className="ds-u-margin-right--2"
                      key="action1"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={denyStateAdmin}
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
                <TableCell>Ty Bolt</TableCell>
                <TableCell>tbolt@fearless.tech</TableCell>
                <TableCell>
                  <a href="# ">4108675309</a>
                </TableCell>
                <TableCell>New York</TableCell>
                <TableCell>
                  <Button
                      onClick={denyStateAdmin}
                      size="small"
                      className="ds-u-margin-right--2"
                      key="action1"
                    >
                      Revoke
                    </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabPanel>
        <TabPanel id="inactive" tab="Inactive">
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
                  <TableCell>Ty Bolt</TableCell>
                  <TableCell>tbolt@fearless.tech</TableCell>
                  <TableCell>
                    <a href="# ">4108675309</a>
                  </TableCell>
                  <TableCell>New York</TableCell>
                  <TableCell>
                    <Button
                        onClick={approveStateAdmin}
                        size="small"
                        className="ds-u-margin-right--2"
                        key="action1"
                      >
                        Reinstate
                      </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
        </TabPanel>
      </Tabs>
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
