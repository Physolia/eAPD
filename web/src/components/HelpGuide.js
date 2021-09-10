import PropTypes from 'prop-types';
import React from 'react';

import Icon, {
  faCalculator,
  faEye,
  faFolderPlus,
  faTasks,
  faLayerGroup,
  faPaperPlane
} from './Icons';

const HelpGuide = () => {
  return (
    <section className="ds-l-container--fluid ds-u-font-size--small">
      <div className="ds-l-row ds-u-fill--primary-alt-lightest">
        <div className="ds-l-col ds-u-fill--white ds-u-margin--3 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faFolderPlus} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3>Create an APD</h3>
          </div>
          <p>Start by creating a new APD.</p>          
        </div>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--3 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faLayerGroup} className="ds-u-font-size--3xl"/>
            <h3>Add APD Information</h3>
          </div>
          <p>Provide the FFYs for which you are requesting funding and details about the state’s Medicaid program.</p>
          <p>Also included at the APD level:</p>
          <ul>
            <li>Key personnel and key contacts</li>              
            <li>Results of previous activities</li>
            <li>Risks and alternatives</li>
          </ul>
        </div>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--3 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faTasks} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3>Include Activity Information</h3>
          </div>
          <p>Describe narrowly scoped tasks that inform how the APD work will be completed, including:</p>
          <ul>
            <li>Outcomes, metrics, and milestones</li>
            <li>State staff and contractors and their costs</li>
            <li>Cost allocation and FFP</li>
          </ul>           
        </div>
      </div>
      <div className="ds-l-row ds-u-fill--primary-alt-lightest ds-u-margin-top--2">
        <div className="ds-l-col ds-u-fill--white ds-u-margin--3 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faCalculator} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3>Schedules and Budgets</h3>
          </div>
          <p>In real time, data is populated across the eAPD system to create a schedule summary and budget.</p>
          <p>We do the math for you!</p>            
        </div>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--3 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faEye} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3>Executive Summary</h3>
          </div>
          <p>Based on your content, eAPD creates an Executive Summary at the end of your APD. It is structured so the State Officer can quickly review key takeaways contained in the APD to begin the official review.</p>
        </div>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--3 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faPaperPlane} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3>Email-ready PDFs</h3>
          </div>
          <p>Use the Export function to save the APD as a PDF and email it to CMS.</p>
        </div>
      </div>
    </section>
  )
}

export default HelpGuide;