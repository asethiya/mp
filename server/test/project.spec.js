const request = require('request-promise-native');
const expect = require('chai').expect;
const config = require('../config/env');
const testData = require('./testData.json');
const utils = require('./utils');

describe("Project", function() {
    let self = this;
    before(() => utils.dropProjects());
    describe("create project", function() {
        try{
            it("returns status 200", async function() {
                //get token first
                let token = await utils.getToken(testData.employer);
                let url = `${utils.baseURL}/api/projects`;
                let options = {
                    body: testData.project,
                    headers: {Authorization: `Bearer ${token}` },
                    json: true,
                    url: url,
                    resolveWithFullResponse: true
                }
                request.post(options)
                let resp = await request.post(options);
                let json = await resp.toJSON();
                expect(json.statusCode).to.equal(200);
                self.project = json.body;
            })
        }catch(err){}
    });    
    describe("bid project", function() {
        try{
            it("returns status 200", async function() {
                //create user
                let employee = await utils.createUser(testData.employee);
                //get token first
                let token = await utils.getToken(testData.employee);
                let url = `${utils.baseURL}/api/projects/bid/${self.project._id}`;
                let options = {
                    body: {amount: '11500'},
                    headers: {Authorization: `Bearer ${token}` },
                    json: true,
                    url: url,
                    resolveWithFullResponse: true
                } 
                request.post(options)
                let resp = await request.post(options);
                let json = await resp.toJSON();
                expect(json.statusCode).to.equal(200);
            })
        }catch(err){}
    });
  });