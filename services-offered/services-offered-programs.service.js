'use strict';

const medicalServicesConfig = require('./services-offered-programs-config.json');
const _ = require('lodash');

var serviceDefinition = {
    getAllMedicalServicesConfig: getAllMedicalServicesConfig,
    getMedicalServicesPrograms: getMedicalServicesPrograms,
    getMedicalServicesProgramUuids: getMedicalServicesProgramUuids
};

module.exports = serviceDefinition;

function getAllMedicalServicesConfig() {
    return  JSON.parse(JSON.stringify(medicalServicesConfig));
}
function getMedicalServicesPrograms(medicalService){
    return new Promise(function (resolve, reject) {
     let medicalServiceProgramConfig = medicalServicesConfig;
     let medicalServicePrograms = [];
     _.each(medicalServiceProgramConfig, (medserviceConf) => {
           let medicalServiceName = medserviceConf.name;
           let programs = medserviceConf.programs;
           if(medicalServiceName === medicalService || medicalService === ''){
              _.each(programs,(program) => {
                medicalServicePrograms.push(program);
              });
           }
     });

     resolve(JSON.stringify(medicalServicePrograms));

    });
}
function getMedicalServicesProgramUuids(medicalService){
  let medicalServiceProgramConfig = medicalServicesConfig;
  let medicalServiceProgram = [];
  _.each(medicalServiceProgramConfig, (medicalServiceConf) => {
        let medicalServiceName = medicalServiceConf.name;
        let programs = medicalServiceConf.programs;
        if(medicalServiceName === medicalService || medicalService === ''){
           _.each(programs,(program) => {
            medicalServiceProgram.push(program.uuid);
           });
        }
  });

  return medicalServiceProgram;

}
