import { Model, DataTypes } from "sequelize";

export class users extends Model {}

export function init_users_model(sequelize) {
  users.init(
    {
      user_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "用户id",
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "用户名称",
      },
      password: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        comment: "用户密码",
      },
    },
    {
      sequelize,
      tableName: "user_table",
      schema: "public",
      timestamps: true,
    }
  );
}
