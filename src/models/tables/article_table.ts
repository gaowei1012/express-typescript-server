import { Model, DataTypes } from "sequelize";

export class articles extends Model {}

export function init_articles_model(sequelize) {
  articles.init(
    {
      article_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "文章id",
        primaryKey: true,
      },
      article_title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "文章名称",
      },
      content: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        comment: "文章内容",
      },
      cover_url: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        comment: "文章预览图",
      },
      abstract: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "文章描述",
      },
      category_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "文章分类",
      },
      alias: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "文章别名",
      },
      createdAt: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "文章发布时间",
      },
      is_top: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 0,
        comment: "文章是否置顶",
      },
    },
    {
      sequelize,
      tableName: "articles_table",
      schema: "public",
      timestamps: true,
    }
  );
}
