import _ from 'lodash';
const eidOrderMapV2 = require('../../../service/eid/mappings/eid-order-mappings-v2');
const eidOrderMapv1 = require('../../../service/eid/mappings/eid-order-mappings-v1');
const version = [
    {
        "version": 2,
        "column": "eidCode",
        "tag": "eid config version two"
    }
];


const currentConfig = version[0];

const eidOrderMap = currentConfig.version === 1 ? eidOrderMapv1 : eidOrderMapV2;

module.exports = eidOrderMap;