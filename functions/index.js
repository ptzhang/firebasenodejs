const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

async function getFacts() {
    const ref = firebaseApp.database().ref('facts');
    const snap = await ref.once('value');
    return snap.val();
}

// function getFacts() {
//     const ref = firebaseApp.database().ref('facts');
//     return ref.once('value').then(snap => snap.val());
// }

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');


app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=30, s-maxage=60');
    getFacts().then(facts => {
        response.render('index', { time: Date.now(), facts });
    });
});

exports.app = functions.https.onRequest(app);
