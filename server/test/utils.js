const mongoose = require('mongoose');
const config  = require('../config/env');
const User  = require('../models/user');
const Project  = require('../models/project');
const Bid  = require('../models/bid');
const request = require('request-promise-native');

const baseURL = "http://localhost:" + config.port; 

async function dropUsers() {
    try{
        let db = await mongoose.connect(config.db, { useNewUrlParser: true } );
        await User.collection.drop();
        db.disconnect();
    }catch(e){}
}

async function dropProjects() {
    try{
        let db = await mongoose.connect(config.db, { useNewUrlParser: true } );
        await Project.collection.drop();
        db.disconnect();
    }catch(e){}
}

async function createUser(userInfo){
    try{
        let db  = await mongoose.connect(config.db, { useNewUrlParser: true } );
        let user = await User.create(userInfo);
        db.disconnect();
        return user;
    }catch(error){

    }
}

async function getToken(userCredentials){
    try{
        let url = `${baseURL}/api/auth/token`;
        let options = {
            body: userCredentials,
            json: true,
            url: url,
            resolveWithFullResponse: true
        } 
        let resp = await request.post(options);
        const json = await resp.toJSON();
        return json.body.jwt;
    }catch(error){

    }
}

module.exports = {baseURL, dropUsers, dropProjects, createUser, getToken};