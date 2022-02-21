const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { Post, User, Comment } = require('../models');

router.get('/', withAuth, (req, res) => {
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

  router.get('/create', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        res.render('create', { layout: 'user.handlebars', loggedIn: true });
    }
  });

  router.get('/edit/:id', withAuth, (req, res) => {
    if (req.session.loggedIn) {
      Post.findOne({
        where: {
          id: req.params.id
        },
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
          if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
  
          const post = dbPostData.get({ plain: true });
  
          res.render('edit-post', { post, layout: 'user.handlebars', loggedIn: true });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });

module.exports = router;