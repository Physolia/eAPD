import NoMatch from './components/NoMatch';
import Dashboard from './containers/Dashboard';
import ApdApplication from './containers/ApdApplication';
import ApdViewOnly from './containers/viewOnly/Apd';
import StateAdmin from './containers/admin/StateAdmin';
import FederalAdmin from './containers/admin/FederalAdmin';
import Login from './containers/Login';
import Logout from './containers/Logout';

const routes = [
  { path: '/', component: Dashboard, exact: true, isPublic: false },
  { path: '/apd', component: ApdApplication, exact: false, isPublic: false },
  { path: '/print', component: ApdViewOnly, exact: true, isPublic: false },
  { path: '/state-admin', component: StateAdmin, isPublic: false },
  { path: '/federal-admin', component: FederalAdmin, isPublic: false },
  { path: '/login', component: Login, isPublic: true, isCard: true },
  { path: '/logout', component: Logout, isPublic: false },
  { component: NoMatch, isPublic: true }
];

export default routes;
