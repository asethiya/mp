const express = require('express');
const userCtrl = require('../../controllers/users');
const auth =  require('../../config/jwt');

const router = express.Router();


router.route('/')
  
  /** GET /api/users - List all users */
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(auth, userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(auth, userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(auth, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;