var db = require('../../etl-db');

function getOncMeds(request, medsFormat, encounterId) {
    let queryParts = {};
    var patientUuid = request.uuid;
    var programUuid = request.programUuid;
    if (medsFormat === 'summary') {
        queryParts = {
            columns: "t1.value_coded",
            table: "openmrs.obs",
            where: ["t2.uuid = ? and t1.concept_id in ? and t1.encounter_id = ? and t1.voided = ?", patientUuid, [9918], encounterId, 0],
            order: [{
                column: 't1.obs_group_id',
                asc: false
            }],
            joins: [
                ['openmrs.person', 't2', 't2.person_id=t1.person_id'],
            ],
            offset: request.startIndex,
            limit: request.limit
        };
    } else {
        queryParts = {
            columns: "t1.concept_id, t1.value_coded, t1.value_numeric, t1.obs_group_id, t1.encounter_id, t1.obs_datetime",
            table: "openmrs.obs",
            where: ["t2.uuid = ? and t5.programuuid = ? and t1.concept_id in ? and t1.voided = ?", patientUuid, programUuid, [9918, 8723, 1896, 7463, 1899, 9869], 0],
            order: [{
                column: 't1.obs_group_id',
                asc: false
            }],
            joins: [
                ['openmrs.person', 't2', 't2.person_id=t1.person_id'],
                ['openmrs.patient_program', 't3', 't3.patient_id=t2.person_id']
            ],
            leftOuterJoins: [
                ['(SELECT program_id, uuid as `programuuid` FROM openmrs.program ) `t5` ON (t3.program_id = t5.program_id)']
            ],
            offset: request.startIndex,
            limit: request.limit
        };
    }
    return db.queryDb(queryParts)
}

function generateMedsDataSet(data) {
    let meds = [];
    const groupBy = key => array =>
        array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});
    //Group medical history obs by the group
    if (data) {
        const groupByEncounter = groupBy('encounter_id');
        const encounterData = groupByEncounter(data);
        _.each(encounterData, function (concepts) {
            let oncMeds = {};
            const i = groupBy('obs_group_id');
            oncMeds.treatment_plan = _.filter(concepts, function (o) {
                return o.concept_id === 9869
            });
            _.remove(concepts, function (e) {
                return e.obs_group_id == null;
            });
            let drug;
            drug = i(concepts);
            if (!_.isEmpty(drug)) {
                oncMeds.drugs = drug;
                meds.push(oncMeds);
            }
        })
    }
    return meds;
}

function getPatientOncologyDiagnosis(request) {
    let patientUuid = request.uuid;
    let queryParts = {
        columns: "*",
        order: [{
            column: 'encounter_id',
            asc: false
        }],
        joins: [
            ['openmrs.person', 't2', 't2.person_id=t1.person_id']
        ],
        table: "openmrs.obs",
        where: ["t2.uuid = ? and t1.concept_id in ? and t1.voided = ?", patientUuid, [
            6529,
6530,
6531,
6532,
6533,
6515,
6516,
176773,
6517,
6518,
6519,
176774,
6537,
6538,
6539,
6553,
6552,
8423,
6541,
6542,
6543,
6545,
9842,
8424,
8425,
9845,
6547,
6548,
6549,
6550,
1226,
6556,
9870,
2,
6557,
177154,
177153,
6781,
507,
6486,
6487,
6488,
6489,
6485,
6514,
6520,
6528,
6536,
6551,
6540,
6544,
216,
9846,9841, 9871, 6536, 6522,
            6523,
            6524,
            6525,
            6526,
            6527,
            6568, 7176, 9844, 6551, 9846, 6540, 9843], 0],
        offset: request.startIndex,
        limit: request.limit
    };

    return db.queryDb(queryParts)
}

function getPatientAppointments(request) {
    let patientUuid = request.uuid;
    let queryParts = {
        columns: "t1.concept_id,t1.value_datetime,obs_datetime, CONCAT(COALESCE(given_name), ' ', COALESCE(middle_name,' '), ' ', COALESCE(family_name)) as provider_name",
        order: [{
            column: 'encounter_id',
            asc: false
        }],
        joins: [
            ['openmrs.person', 't2', 't2.person_id=t1.person_id'],
            ['openmrs.users', 't3', 't3.user_id=t1.creator'],
            ['openmrs.person_name', 't4', 't4.person_id = t3.person_id']
        ],
        table: "openmrs.obs",
        where: ["t2.uuid = ? and t1.concept_id in ? and t1.voided = ?", patientUuid, [5096], 0],
        offset: request.startIndex,
        limit: request.limit
    };

    return db.queryDb(queryParts)
}

function getOncologyIntegratedProgramSnapshot(request) {
    let patientUuid = request.uuid;
    let queryParts = {
        columns: "t1.encounter_id,DATE_FORMAT(t1.encounter_datetime,'%d%-%m%-%Y') as encounter_datetime,t3.name, t5.name as location",
        order: [{
            column: 'encounter_id',
            asc: false
        }],
        group: ['t1.visit_id'],
        joins: [
            ['openmrs.visit', 't2', 't2.visit_id=t1.visit_id'],
            ['openmrs.visit_type', 't3', 't3.visit_type_id=t2.visit_type_id'],
            ['openmrs.person', 't4', 't4.person_id=t1.patient_id'],
            ['openmrs.location', 't5', 't5.location_id=t1.location_id'],
        ],
        table: "openmrs.encounter",
        where: [
            't4.uuid = ? and t2.visit_type_id in ? and t1.voided = ?',
            patientUuid,
            [5, 6, 70, 72, 71],
            0],
        offset: request.startIndex,
        limit: request.limit
    };

    return db.queryDb(queryParts)
}

export { generateMedsDataSet, getOncMeds, getPatientOncologyDiagnosis, getPatientAppointments, getOncologyIntegratedProgramSnapshot }