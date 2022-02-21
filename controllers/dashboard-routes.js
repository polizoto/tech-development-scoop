const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        Post.findAll({
            where: {
                user_id: 1
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
            res.render('dashboard', { posts, layout: 'user.handlebars', loggedIn: req.session.loggedIn});
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      }
      Post.findAll({
        attributes: [
          'id',
          'post_content',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)'), 'comment_count']
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
          const posts = dbPostData.map(post => post.get({ plain: true }));
          res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
            layout: 'main.handlebars'
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
  });

module.exports = router;