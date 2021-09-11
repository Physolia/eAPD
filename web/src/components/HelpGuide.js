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

import { Button } from '@cmsgov/design-system';

const HelpGuide = () => {
  return (
    <div className="ds-u-display--flex eapd-help">
      <div className="ds-u-margin--3">
        <img
          src="/static/img/eAPDLogoSVG_ICO/SVG/eAPDLightVarSVG.svg"
          alt="eAPD Logo"
        />
        <h1 className="ds-u-color--white ds-u-text-align--center ds-u-margin-y--2 ds-u-padding-bottom--2 eapd-help-h1-border">Welcome!</h1>
        <p className="ds-u-color--white">Review this overview first and when you're ready hit Get Started to close this guide and be taken to the APD Dashboard. There you can create and edit APDs.</p>
        <div className="ds-u-margin-top--3 ds-u-display--flex ds-u-justify-content--center">
          <Button size="big">Get started</Button>
        </div>
      </div>
      <section className="ds-u-font-size--sm ds-u-padding--3">
      <div className="ds-l-row ds-u-fill--primary-alt-lightest">
        <h2 className="ds-u-margin-left--2 ds-u-margin-bottom--0 ds-u-margin-top--1 eapd-help-section-header ds-u-color--gray-dark">When you provide this information...</h2>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--1 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faFolderPlus} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3 className="ds-u-margin--1">Create an APD</h3>
          </div>
          <p>Start by creating a new APD.</p>
        </div>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--1 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faLayerGroup} className="ds-u-font-size--3xl"/>
            <h3 className="ds-u-margin--1">Add APD Information</h3>
          </div>
          <p>Provide the FFYs for which you are requesting funding and details about the state’s Medicaid program.</p>
          <p>Also included at the APD level:</p>
          <ul>
            <li>Key personnel and key contacts</li>
            <li>Results of previous activities</li>
            <li>Risks and alternatives</li>
          </ul>
        </div>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--1 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faTasks} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3 className="ds-u-margin--1">Include Activity Information</h3>
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
        <h2 className="ds-u-margin-left--2 ds-u-margin-bottom--0 ds-u-margin-top--1 eapd-help-section-header">We can generate these for you...</h2>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--1 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faCalculator} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3 className="ds-u-margin--1">Schedules and Budgets</h3>
          </div>
          <p>In real time, data is populated across the eAPD system to create a schedule summary and budget.</p>
          <p>We do the math for you!</p>
        </div>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--1 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faEye} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3 className="ds-u-margin--1">Executive Summary</h3>
          </div>
          <p>Based on your content, eAPD creates an Executive Summary at the end of your APD. It is structured so the State Officer can quickly review key takeaways contained in the APD to begin the official review.</p>
        </div>
        <div className="ds-l-col ds-u-fill--white ds-u-margin--1 ds-u-padding--2">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-align-items--center">
            <Icon icon={faPaperPlane} style={{ width: '30px' }} className="ds-u-font-size--3xl"/>
            <h3 className="ds-u-margin--1">Email-ready PDFs</h3>
          </div>
          <p>Use the Export function to save the APD as a PDF and email it to CMS.</p>
        </div>
      </div>
    </section>
    </div>
  )
}

export default HelpGuide;