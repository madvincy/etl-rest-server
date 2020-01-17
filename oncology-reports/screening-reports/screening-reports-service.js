"use strict";
const _ = require("lodash");

const screeningReportsConfig = require("./screening-reports-config.json");
const screeningPatientListCols = require("./screening-patient-list-cols.json");

var serviceDefinition = {
  getScreeningReports: getScreeningReports,
  getSpecificScreeningReport: getSpecificScreeningReport,
  getPatientListCols: getPatientListCols
};

module.exports = serviceDefinition;

function getScreeningReports() {
  return new Promise(function(resolve, reject) {
    resolve(JSON.parse(JSON.stringify(screeningReportsConfig)));
  });
}

function getSpecificScreeningReport(reportUuid) {
  let specificReport = [];

  return new Promise(function(resolve, reject) {
    _.each(screeningReportsConfig, report => {
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
  let specificReport = screeningPatientListCols[programUuid];
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
