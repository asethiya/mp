module.exports =  {
    env: 'test',
    db: 'mongodb+srv://db-user:1234@cluster0-lo41m.mongodb.net/test?retryWrites=true',
    port: 8001,
    jwtSecret: 'mp-api-secret',
    jwtDuration: '2 hours'
};