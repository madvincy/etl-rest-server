"use strict";
const _ = require("lodash");

const researchReportsConfig = require("./research-reports-config.json");
const researchPatientListCols = require("./research-patient-list-cols.json");

var serviceDefinition = {
  getResearchReports: getResearchReports,
  getSpecificResearchReport: getSpecificResearchReport,
  getPatientListCols: getPatientListCols
};

module.exports = serviceDefinition;

function getResearchReports() {
  return new Promise(function(resolve, reject) {
    resolve(JSON.parse(JSON.stringify(researchReportsConfig)));
  });
}

function getSpecificResearchReport(reportUuid) {
  let specificReport = [];

  return new Promise(function(resolve, reject) {
    _.each(researchReportsConfig, report => {
      let programUuid = report.uuid;
      if (programUuid === reportUuid) {
        specificReport = report;
      }
    });

    resolve(specificReport);
  });
}

function getPatientListCols(indicator, programUuid) {
  let patientCols = [];
  let specificReport = researchPatientListCols[programUuid];
  return new Promise((resolve, reject) => {
    _.each(specificReport, report => {
      _.each(report, programReport => {
        let reportIndicator = programReport.indicator;
        if (reportIndicator === indicator) {
          let patientListCols = programReport.patientListCols;
          patientCols = patientListCols;
        }
      });
    });

    resolve(patientCols);
  });
}
