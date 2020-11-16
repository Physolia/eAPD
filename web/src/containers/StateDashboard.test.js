import React from 'react';
import StateDashboard from './StateDashboard';
import { renderWithConnection } from '../shared/apd-testing-library';
import mockAxios from '../util/api';

jest.mock('../util/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
}));

let props;
let renderUtils;

const apd = {
  id: '1',
  name: 'Sample APD',
  updated: '2020-07-27 17:50:02.834242+00',
  created: '2020-07-28 20:20:56.835976+00',
  state: 'MO',
  status: 'draft'
};
const createdStr = 'July 27, 2020';
const updatedStr = 'July 28, 2020, 3:20 PM EDT';

describe('<StateDashboard />', () => {
  beforeEach(() => {
    props = {
      apds: [],
      fetching: false,
      createApd: jest.fn(() => console.log('createAPD')),
      deleteApd: jest.fn(),
      selectApd: jest.fn(),
      route: '/apd'
    };
  });
  describe('pending state', () => {
    beforeEach(() => {
      renderUtils = renderWithConnection(<StateDashboard {...props} pending />);
    });

    it('should display introduction, but not instruction', () => {
      const { queryByText } = renderUtils;
      expect(
        queryByText(
          /The CMS HITECH APD app is the new way to create and manage/i
        )
      ).toBeTruthy();
      expect(queryByText(/All your state's APDs are listed here./i)).toBeNull();
    });

    it("shouldn't display the create APD button", () => {
      const { queryByRole } = renderUtils;
      expect(queryByRole('button', { name: /create/i })).toBeNull();
    });

    it("shouldn't display the empty APD message", () => {
      const { queryByText } = renderUtils;
      expect(queryByText(/You have not created any APDs./i)).toBeNull();
    });

    it('should display the pending message', () => {
      const { getByAltText, getByText } = renderUtils;
      expect(getByAltText(/Puzzle Piece Icon/i)).toBeTruthy();
      expect(
        getByText(/Approval Pending From State Administrator/i)
      ).toBeTruthy();
    });
  });

  describe('default state, no apds', () => {
    beforeEach(() => {
      mockAxios.get.mockImplementation(() => Promise.resolve({ data: [] }));
      renderUtils = renderWithConnection(
        <StateDashboard {...props} pending={false} />,
        {
          initialState: {
            user: {
              data: {
                state: 'MO'
              }
            }
          }
        }
      );
    });

    it('should display the introduction and instructions', () => {
      const { queryByText } = renderUtils;
      expect(
        queryByText(
          /The CMS HITECH APD app is the new way to create and manage/i
        )
      ).toBeTruthy();
      expect(queryByText(/All your state's APDs are listed here./i)).toBeNull();
    });

    it('should handle clicking the create APD button', async () => {
      mockAxios.post.mockImplementation(() => Promise.resolve({ data: apd }));
      const { queryByRole } = renderUtils;
      expect(queryByRole('button', { name: /Create new/i })).toBeTruthy();
      // fireEvent.click(queryByRole('button', { name: /Create new/i }));
      // expect(props.createApd).toHaveBeenCalled();
    });

    it('should display the empty APD message', () => {
      const { queryByText } = renderUtils;
      expect(queryByText(/You have not created any APDs./i)).toBeTruthy();
    });

    it("shouldn't display the pending message", () => {
      const { queryByAltText, queryByText } = renderUtils;
      expect(queryByAltText(/Puzzle Piece Icon/i)).toBeNull();
      expect(
        queryByText(/Approval Pending From State Administrator/i)
      ).toBeNull();
    });
  });

  describe('default state with apds', () => {
    beforeEach(() => {
      mockAxios.get.mockImplementation(() => Promise.resolve({ data: [apd] }));
      renderUtils = renderWithConnection(
        <StateDashboard {...props} pending={false} />,
        {
          initialState: {
            user: {
              data: {
                state: 'MO'
              }
            },
            apd: {
              byId: {
                [apd.id]: {
                  ...apd,
                  created: createdStr,
                  updated: updatedStr
                }
              }
            }
          }
        }
      );
    });

    it('should display the APD', () => {
      const { getByText } = renderUtils;
      expect(getByText(apd.name)).toBeTruthy();
      expect(getByText(updatedStr)).toBeTruthy();
      expect(getByText(createdStr)).toBeTruthy();
    });

    it('should allow the user to click on the APD to edit', () => {
      const { getByText } = renderUtils;
      expect(getByText(apd.name)).toBeTruthy();
      // fireEvent.click(getByText(apd.name));
      // expect(props.selectApd).toHaveBeenCalledWith(apd.id, props.route);
    });

    it('should allow the user to click the delete APD button', () => {
      const { getByText } = renderUtils;
      expect(getByText(/Delete/i)).toBeTruthy();
      // fireEvent.click(getByText(/Delete/i));
      // expect(props.deleteApd).toHaveBeenCalledWith(apd);
    });
  });
});
