const express = require('express');
const projCtrl = require('../../controllers/projects');
const auth =  require('../../config/jwt');

const router = express.Router();


router.route('/')
  
  /** GET /api/projects - List all projects */
  .get(projCtrl.list)

  /** POST /api/projects - Create new project */
  .post(auth, projCtrl.create);

router.route('/:projectId')
  /** GET /api/projects/:projectId - Get project */
  .get(auth, projCtrl.get)

  /** PUT /api/projects/:projectId - Update project */
  .put(auth, projCtrl.update)

  /** DELETE /api/projects/:projectId - Delete project */
  .delete(auth, projCtrl.remove);
router.route('/bid/:projectId')
  /** POST /api/projects/bid/:projectId - Bid project */
  .post(auth, projCtrl.bid);

/** Load user when API with projectId route parameter is hit */
router.param('projectId', projCtrl.load);

module.exports = router;