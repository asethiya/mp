const mongoose =  require('mongoose');
const config = require('../config/env');
const User = require('../models/user');
const Project = require('../models/project');
const Bid = require('../models/bid');
const prjCtrl = require('../controllers/projects');
const data = require('./seedData.json');
const _ = require('lodash');

async function dropDB(){
    try {
        await User.collection.drop();
    }catch(e){
        console.log(e);
    }
        
    try {
        await Project.collection.drop();
    }catch(e){
        console.log(e);
    }

    try {
        await Bid.collection.drop();
    }catch(e){
        console.log(e);
    }
}

async function populate(){
    try{
        //let db  = await mongoose.connect(config.db, { useNewUrlParser: true} );
        await dropDB();
        
        let users = await Promise.all(data.users.map(async (user)=> {
            try{
                let dbuser = await User.create(user);
                return dbuser;
            }catch(e){return user};
        }));
        
        await _.forEach(data.projects, async (projectInfos, username) => {
            try{
                let user = _.find(users, {username});
                projectInfos = await Promise.all(projectInfos.map(async (info) => {
                    info.owner_id = user._id;

                    let project = await Project.create(info);

                    if(info.bids){
                        await Promise.all(info.bids.map(async (bidInfo) => {
                            let user = _.find(users, {username: bidInfo.user});
                            prjCtrl.addBid(user, project, bidInfo.amount);
                        }))
                    }

                    return project;
                }));
            }catch(e){console.log(e)}
        })
        //db.disconnect();
    }catch(err){ console.log(err)}
} 

module.exports  = populate();