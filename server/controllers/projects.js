const Project = require('../models/project');
const Bid = require('../models/bid');

function load(req, res, next, id) {
  Project.findById(id)
    .exec()
    .then((project) => {
      if (!project) {
        return res.status(404).json({
          status: 400,
          message: "PRoject not found"
        });
      }
      req.dbProject = project;
      return next();
    }, (e) => next(e));
}

function get(req, res) {
  return res.json(req.dbProject);
}

function create(req, res, next) {
  const project = {title, description, budget, startDate, endDate} = req.body;
  project.owner_id = req.user.id;
  Project.create(project)
    .then((savedProject) => {
      return res.json(savedProject);
    }, (e) => next(e));
}

function addBid(user, project, amount){
  return new Promise( (resolve, reject)=> {
    if(project.status !== 'Auction'){
      const err= new Error('Project is no longer available for bidding');
      reject(err);
    }

    if(project.bid && project.bid.amount <= amount){
      const err = new Error('Provided bid equals/exceeds the current lowest bid.');
      reject(err);
    }

    if(project.owner_id == user.id){
      const err = new Error('Project owner cannot bid on the project');
      reject(err);
    }

    Bid.create({project_id: project._id, user_id: user._id, amount: amount})
    .then((savedBid) => {
      Object.assign(project, {winningBid: savedBid, totalBids: project.totalBids +1});
      project.save()
      .then(() => resolve('Bid submitted successfully'),
        (e) => reject(e));
    }, (e) => reject(e))
  })

}

function bid(req, res, next) {
  const project = req.dbProject;

  if(project.status !== 'Auction'){
    const err = new Error('Project is no longer available for bidding');
    next(err);
    return;
  }

  const bid = { amount } = req.body;
  if(project.bid && project.bid.amount <= bid.amount){
    const err = new Error('Provided bid equals/exceeds the current lowest bid.');
    next(err);
    return;
  }

  if(project.owner_id == req.user.id){
    const err = new Error('Project owner cannot bid on the project');
    next(err);
    return;
  }

  addBid({_id: req.user.id}, project, bid.amount)
  .then((message) => {
    res.status(200).send(message)
  }, (e) => next(e));
}

function update(req, res, next) {
  const project = req.dbProject;

  if(project.owner_id != req.user.id){
    err = new Error('Only owner can edit a project');
    next(err);
    return;
  }

  const updates = {name, description} = req.body;

  Object.assign(project, updates);

  project.save()
    .then(() => res.sendStatus(204),
      (e) => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Project.find()
    .skip(skip)
    .limit(limit)
    .exec()
    .then((projects) => res.json(projects),
      (e) => next(e));
}

function remove(req, res, next) {
  //TODO: only owner can remove a project
  const project = req.dbProject;
  project.remove()
    .then(() => res.sendStatus(204),
      (e) => next(e));
}

module.exports = { load, get, create, bid, update, list, remove, addBid };