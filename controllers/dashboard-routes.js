const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        Post.findAll({
            where: {
                user_id: req.session.user_id
              },
          attributes: [
            'id',
            'post_content',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)'), 'comment_count']
          ]
        })
          .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, layout: 'user.handlebars', loggedIn: true });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      }
  });

  router.get('/create', (req, res) => {
    if (req.session.loggedIn) {
        res.render('create', { layout: 'user.handlebars', loggedIn: true });
    }

  });

module.exports = router;