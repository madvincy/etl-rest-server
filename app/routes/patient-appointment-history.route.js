var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
import { getPatientAppointments } from '../../service/oncology/patient-oncology-summary-service'

var helpers = require('../../etl-helpers');
const routes = [{
    method: 'GET',
    path: '/etl/patient/{uuid}/oncology/appointment-history',
    config: {
        plugins: {
            'hapiAuthorization': {
                role: privileges.canViewPatient
            }
        },
        handler: function (request, reply) {
            let requestParams = Object.assign({}, request.query, request.params);
            getPatientAppointments(requestParams).then(data => {
                let appointmentData = data;
                _.each(appointmentData.result, (summary) => {
                    console.log(summary);
                     summary.date = helpers.filterDate(summary.obs_datetime);
                     summary.appointment_date = helpers.filterDate(summary.value_datetime);
                });
                reply(appointmentData);
            }).catch((error) => {
                reply(error);
            });
        },
        description: "Get the appointment history report",
        notes: "Returns the the appointment history of the selected patient",
        tags: ['api'],
        validate: {
            options: {
                allowUnknown: true
            },
            params: {}
        }
    }
}];
exports.routes = server => server.route(routes);