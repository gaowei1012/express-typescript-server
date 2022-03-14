import { Model, DataTypes } from "sequelize";

export class categorys extends Model {}

export function init_categorys_model(sequelize) {
  categorys.init(
    {
      category_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "文章分类id",
        primaryKey: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "分类名称",
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "分类描述",
      },
      alias: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "分类名称别称",
      },
    },
    {
      sequelize,
      schema: "categorys_table",
      timestamps: true,
    }
  );
}
