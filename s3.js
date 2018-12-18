const AWS = require('aws-sdk')
const fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: '',
});

const data = fs.readFileSync('');

const params = {
    Body: data,
    Bucket: '',
    Key: ''
};

s3.putObject(params, (err, data) => {
    if (err) console.error(err);
    else console.log(data);
})
