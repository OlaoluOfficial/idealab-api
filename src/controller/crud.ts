import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../model/user.schema';
import protect from '../middlewares/protected.route';

const router = express.Router();

router.get(
  '/:action',
  asyncHandler(async (req, res) => {
    const { action } = req.params;
    if (action === 'read') {
      res.status(200).json({ msg: 'All role allowed' });
    } else {
      res.status(400).json({ msg: 'Invalid action' });
    }
  })
);

router.post(
  '/:action',
  protect,
  asyncHandler(async (req, res) => {
    const { action } = req.params;
    //@ts-ignore
    const user = req['user'];
    switch (action) {
      case 'create':
        if (user?.group.includes('admin') || user?.group.includes('user')) {
          res.status(200).json({ msg: 'Admin and user allowed' });
        } else {
          res.status(401).json({ msg: 'Only Admin and Users allowed' });
        }
        break;
      case 'update':
      case 'delete':
        if (user?.group.includes('admin')) {
          res.status(200).json({ msg: 'Admin allowed' });
        } else {
          res.status(401).json({ msg: 'Only Admin allowed' });
        }
        break;
      default:
        res.status(400).json({ msg: 'Invalid action' });
        break;
    }
  })
);

router.post(
  '/assign/group',
  protect,
  asyncHandler(async (req, res) => {
    const { id, group } = req.body;
    //@ts-ignore
    const user = req['user'];
    // validate group
    if (!group.includes('admin') && !group.includes('user') && !group.includes('guest')) {
      res.status(400).json({ msg: 'Invalid group' });
    }
    if (user?.group.includes('admin')) {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      user.group = group;
      await user.save();
      res.status(200).json({ msg: 'Group assigned' });
    } else {
      res.status(401).json({ msg: 'Only Admin allowed' });
    }
  })
);

export default router;
