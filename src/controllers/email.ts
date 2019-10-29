// import AWS from 'aws-sdk';
// import nodemailer from 'nodemailer';
// import moment from 'moment';
// import 'moment-timezone';
// import { Request, Response } from 'express';
// import { email } from '../util/secrets';
// import { Event } from '../api/events/entity/Event';
// import { Detail } from '../api/appointments/entity/Detail';

// AWS.config.update({
//     accessKeyId: email.AWS_ACCESS_KEY_ID,
//     secretAccessKey: email.AWS_SECRET_ACCESS_KEY,
//     region: email.AWS_SES_REGION,
// });

// const transporter = nodemailer.createTransport({
//     SES: new AWS.SES({ apiVersion: '2010-12-01' }),
// });

// type Table = 'all' | 'appointment' | 'event';

// type Events = Detail | Event;

// const generateHtmlMsg = (type: Table, events: Events): string => {
//     let output = `<h1>${events.title}</h1>`;
//     output += `<div>${events.description}</div>`;
//     // @FIXME: use type guards instead
//     if (type === 'appointment') {
//         output += '<table>';
//         output += `<caption>Time Slots for ${events.title}</caption>`;
//         output += `<thead><tr>
//                         <th>Day</th>
//                         <th>Start</th>
//                         <th>End</th>
//                     </tr></thead>`;
//         output += '<tbody>';
//         (events as Detail).slots.forEach(({ start, end }) => {
//             output += `
//             <tr>
//                 <td>${moment(start)
//                     .tz('America/Chicago')
//                     .format('MMM Do')}
//                 </td>
//                 <td>${moment(start)
//                     .tz('America/Chicago')
//                     .format('hh:mm')}
//                 </td>
//                 <td>${moment(end)
//                     .tz('America/Chicago')
//                     .format('hh:mm')}
//                 </td>
//             </tr>`;
//         });
//         output += '</tbody>';
//         output += '</table>';
//     } else if (type === 'event') {
//         output += `<div>At ${(events as Event).location}</div>`;
//         output += `<div>On ${moment((events as Event).start)
//             .tz('America/Chicago')
//             .format('MMM Do')}</div>`;
//         output += `<div>${moment((events as Event).start)
//             .tz('America/Chicago')
//             .format('hh:mm')} - ${moment((events as Event).end)
//             .tz('America/Chicago')
//             .format('hh:mm')}</div>`;
//         output += `<div>Organized by ${(events as Event).owner.firstName} ${(events as Event).owner.lastName}</div>`;
//     }

//     return output;
// };

// const generateGeneral = (events: Events[]): string => {
//     let output = '<table>';
//     output += `<caption>Your ${events.length} Events</caption>`;
//     output += `<thead><tr>
//                         <th>Title</th>
//                         <th>Description</th>
//                     </tr></thead>`;
//     output += '<tbody>';
//     events.forEach(event => {
//         output += `
//         <tr>
//             <td>${event.title}
//             </td>
//             <td>${event.description}
//             </td>
//         </tr>`;
//     });
//     output += '</tbody></table>';

//     return output;
// };

// // @TODO need to allow for 2+ attachment to be sent on a single email
// export const sender = async (req: Request, res: Response) => {
//     try {
//         const type: Table = req.body.type;
//         const html = type === 'all' ? generateGeneral(req.body.events) : generateHtmlMsg(type, req.body.events);
//         const result = await transporter.sendMail({
//             from: email.SOURCE_EMAIL,
//             to: req.body.to,
//             subject: req.body.subject,
//             text: req.body.body,
//             html,
//             // alternatives: [
//             //     {
//             //         filename: req.body.filename,
//             //         contentType: req.body.contentType,
//             //         content: req.body.content,
//             //     },
//             // ],
//         });
//         res.send({ msg: 'Email successfully sent into the void', result });
//     } catch (err) {
//         res.status(403).send({ msg: `Mistakes were made ${err}` });
//     }
// };
