import { users, init_users_model } from "./user_table";
import { articles, init_articles_model } from "./article_table";
import { categorys, init_categorys_model } from "./category_table";

export { users, articles, categorys };

export function init_db_model(sequelize) {
  init_users_model(sequelize);
  init_articles_model(sequelize);
  init_categorys_model(sequelize);
}
