const dotenv = require("dotenv")
const Minio=require('minio')

dotenv.config()

const minioClient = new Minio.Client({
    // endPoint: 'localhost',
    // port: 9000,
    // useSSL: false,
    // accessKey: 'admin',
    // secretKey: 'password'

    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

exports.default=minioClient;