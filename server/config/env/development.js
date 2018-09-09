module.exports =  {
    env: 'development',
    db: 'mongodb+srv://db-user:1234@cluster0-rvrjn.mongodb.net/test?retryWrites=true',
    port: 8000,
    jwtSecret: 'mp-api-secret',
    jwtDuration: '2 hours'
};