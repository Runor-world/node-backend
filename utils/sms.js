// const twilio = require('twilio')(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
// );
// const receiver = '+2349061983150'
// const message = 'Hello people you are getting this from runor'

// twilio.messages
//     .create({
//         to: receiver,
//         from: process.env.TWILIO_NUMBER,
//         body: message
//     })
//     .then((res)=>{
//         console.log(res.sid)
//     })
//     .then((error) =>{
//         console.log(error)
//     })
const sendSMS = async (receiver, message) => {};

module.exports = { sendSMS };
