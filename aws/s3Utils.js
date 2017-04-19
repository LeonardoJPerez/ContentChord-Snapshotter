const AWS = require('aws-sdk'),
    fs = require('fs'),
    uuid = require('uuid');

const albumBucketName = 's3-node-demo';
const bucketRegion = 'us-east-1';
const IdentityPoolId = 'us-east-1:a794999e-844c-4cd4-814b-30e2f99ae2ee';

AWS
    .config
    .update({
        region: bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({IdentityPoolId: IdentityPoolId})
    });

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
        Bucket: albumBucketName
    }
});

module.exports = {
    listObjects: () => {
        s3.listObjects({
            Delimiter: '/'
        }, (err, data) => {
            if (err) {
                return console.log('There was an error listing your albums: ' + err.message);
            } else {
                const albums = data
                    .CommonPrefixes
                    .map(commonPrefix => {
                        return decodeURIComponent(commonPrefix.Prefix.replace('/', ''));
                    });

                return albums;
            }
        });
    },
    putObject: (fileName) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                throw err;
            }

            s3.putObject({
                Key: uuid.v4() + '/' + fileName,
                Body: new Buffer(data, 'binary')
            }, (awsError, response) => {
                if (awsError) 
                    console.log(awsError);
                else 
                    console.log("File '" + fileName + "' uploaded. Etag: " + response.ETag);
                }
            );
        });
    }
}
