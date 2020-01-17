"use strict";
const _ = require("lodash");

const treatmentReportsConfig = require("./treatment-reports-config.json");
const treatmentPatientListCols = require("./treatment-patient-list-cols.json");

var serviceDefinition = {
  getTreatmentReports: getTreatmentReports,
  getSpecificTreatmentReport: getSpecificTreatmentReport,
  getPatientListCols: getPatientListCols
};

module.exports = serviceDefinition;

function getTreatmentReports() {
  return new Promise(function(resolve, reject) {
    resolve(JSON.parse(JSON.stringify(treatmentReportsConfig)));
  });
}

function getSpecificTreatmentReport(reportUuid) {
  let specificReport = [];

  return new Promise(function(resolve, reject) {
    _.each(treatmentReportsConfig, report => {
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
  let specificReport = treatmentPatientListCols[programUuid];
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
