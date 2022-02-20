const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    comment_text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Required"
           },
           len: {
               args: [4,400],
               msg: "String length is not in this range"
          }
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'post',
          key: 'id'
        }
      }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);

module.exports = Comment;