const config = require('../conf/config')
export class smsService {
    getCredentials(){ 
        var credentials = config.africanstalking;
        return credentials;
    }
    postMessage (message) {
        const AfricasTalking = require('africastalking')(this.getCredentials());
        const sms = AfricasTalking.SMS;
        console.log(message.to, 'req');
        // const {
        //     to,
        //     message
        // } = req.body;
        const options = {
            //Set the numbers that you want to send to in international format
            to: message.to,
            //Set the message
            message: message.message,
            //Set your shortcode or senderID
            // from: 'eugene_kandie'
        }
        return new Promise(function (resolve, reject) {
            sms.send(options)
            .then(function(parsedBody) {
                 resolve({ status: 'okay' });
            }).catch(function(err) {
                console.log('Error:', err);
                resolve({ status: err });
            });
        });
        // sms.send(options)
        //     .then(response => {
        //         console.log(response);
        //         res.json(response);
        //     })
        //     .catch(error => {
        //         console.log(error, 'noted');
        //         res.json(error.toString());
        //     });
        }
}