const express = require('express');
const massive = require('massive');
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: '',
});

app.set('s3', s3);

massive({
    host: '',
    port: 5432,
    database: '',
    user: '',
    password: '',
    ssl: true,
}).then(db => {
    app.set('db', db);
});

app.get('/users', (req, res) => {
    const db = req.app.get('db');

    db.users.findOne({ username: 'pbarker' }).then(user => {
        res.status(200).send(user);
    })
})

app.post('/login', (req, res) => {
    const db = req.app.get('db');

    const { username, password } = req.body;

    db.users.findOne({ username })
        .then(user => {
            const result = bcrypt.compareSync(password, user.password);

            if (result) {
                res.status(200).send('Logged in!');
            } else {
                res.status(401).send('Unauthorized');
            }
        })
});

app.post('/email', (req, res) => {
    const db = req.app.get('db');

    const { emailBody } = req.body;

    const ses = new AWS.SES({
        accessKeyId: '',
        secretAccessKey: '',
        region: 'us-east-1'
    });

    const params = {
        Destination: {
            ToAddresses: [
                ''
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: emailBody
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Test Email'
            }
        },

        ReplyToAddresses: [
            ''
        ],
        Source: '',
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
})

app.listen(3000, () => {
    console.log('App listening on port 3000');
})
