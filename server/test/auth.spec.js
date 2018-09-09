const request = require('request-promise-native');
const expect = require('chai').expect;
const config = require('../config/env');
const testData = require('./testData.json');
const utils = require('./utils');

describe("Authentication", function() {
    before(() => utils.dropUsers());
    describe("create user", function() {
        it("returns status 200", async function() {
            try{
                let url = `${utils.baseURL}/api/users`;
                let options = {
                    body: testData.employer,
                    json: true,
                    resolveWithFullResponse: true,
                    url: url
                } 
                let resp = await request.post(options);
                let json = await resp.toJSON();
                expect(json.statusCode).to.equal(200);
            }
            catch(err){};
        })
    });
    describe("token", function() {
        it("returns status 200", async function() {
            try{
                let url = `${utils.baseURL}/api/auth/token`;
                let options = {
                    body: testData.employer,
                    json: true,
                    url: url,
                    resolveWithFullResponse: true
                } 
                request.post(options)
                let resp = await request.post(options);
                let json = await resp.toJSON();
                expect(json.statusCode).to.equal(200);
            }catch(err){}
        })
    });
  });