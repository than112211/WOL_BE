const userRoute = require('./user');
const paymentRoute = require('./payment');
const lectureRoute = require('./lecture');
const quizzRoute = require('./quizz');
const liveRoute = require('./live');
const reportRoute = require('./report')
function route(app){ 
    app.use('/user',userRoute);
    app.use('/lecture',lectureRoute);
    app.use('/payment',paymentRoute);
    app.use('/quizz',quizzRoute);
    app.use('/live',liveRoute);
    app.use('/report',reportRoute);




}
module.exports = route;