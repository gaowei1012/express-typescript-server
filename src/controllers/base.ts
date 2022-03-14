import { QwdError } from './helper';
import { errorCode } from '@/config';
import _ from 'lodash';
import { sequelize } from '@/sysInit';
import e from 'express';
const { Op } = require('sequelize');

abstract class BaseCtrl {
  abstract model: any;

  constructor() {
    //  sequelize
    // .authenticate().then(() => {})
    // .catch((err) => {
    //   throw new QwdError(errorCode.MysqlConnectionError, 'Mysql数据库未连接');
    // });
    // if (!this.model) {
    //   throw new QwdError(errorCode.MysqlConnectionError, 'Mysql数据库未连接');
    // }
  }
  /**
   * 插入记录
   * @param {object} _record 插入的对象JSON||对象数组
   * @returns {object} 插入后数据库中的记录
   */
  insert = async (_record: any, _transaction?: any) => {
    const t = _transaction ? _transaction : await sequelize.transaction();
    try {
      let new_record: any;

      // Insert Array
      if (Object.prototype.toString.call(_record) == '[object Array]') {
        new_record = await this.model.bulkCreate(_record);
      } else {
        new_record = await this.model.create(_record);
      }
      if (!_transaction) await t.commit();

      return new_record;
    } catch (err) {
      await t.rollback();
      // 错误类型处理
      errTypeHandle(err);
    }
  };

  /**
   * 删除记录
   * 当传入数组时，批量删除
   * @param {object} _query {_id:id}
   * @param {object} _transaction 支持事务
   * @returns {number} 删除的数量
   */
  remove = async (_query: any, _transaction?: any): Promise<any> => {
    const t = _transaction ? _transaction : await sequelize.transaction();
    try {
      let delRes: number = 0;
      delRes = await this.model.destroy({ where: _query, transaction: t });
      //若事务参数由外部传入，则不在该函数内commit
      if (!_transaction) await t.commit();
      return delRes;
    } catch (err) {
      await t.rollback();
      throw new QwdError(errorCode.MysqlDeleteError, err.message);
    }
  };

  /**
   * 获取一条记录
   *
   * @param {object} _query {_id:id} 查询条件
   * @returns {object} 查询到的记录
   */
  get = async (_query: any, _attributes?: any) => {
    try {
      let findRes = await this.model.findOne({
        where: _query,
        attributes: _attributes,
        raw: true,
      });

      return findRes;
    } catch (err) {
      throw new QwdError(errorCode.MysqlFindError, err.message);
    }
  };

  /**
   * 获取TABLE所有记录并统计
   * @param _query 查询条件
   * @param _attributes 限制返回的字段["username","createdAt"]
   * @param _order 排序如[['title', 'DESC']]
   * @param _page 页数如5
   * @param _count 每页数量如20
   * @returns {object} {count:table记录总条数,rows:返回数组}
   */
  getAll = async (_query?: any, _attributes?: any, _order?: any, _page?: any, _count?: any, _inclued?: any) => {
    try {
      const page = _page ? (_page = parseInt(_page)) : null;
      const count = _count ? (_count = parseInt(_count)) : null;
      // [Op.and]:[
      //   {product_title:
      //     {[Op.like]:'%测%'}
      //   }
      // ]
      // {start_at:{[Op.between]:["2021","2022"]}},
      // 运算符处理
      _query = this.operator_handle(_query);

      let findCountAllRes = await this.model.findAndCountAll({
        include: _inclued,
        where: _query,
        attributes: _attributes,
        order: _order,
        offset: (page - 1) * count,
        limit: count,
        raw: true,
      });
      return findCountAllRes;
    } catch (err) {
      throw new QwdError(errorCode.MysqlFindError, err.message);
    }
  };

  /**
   * 运算符转换
   * @param query 条件
   * @returns
   *
   * 运算符处理
   * [Op.and]: {a: 5}           // AND (a = 5)
   * [Op.or]: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
   * [Op.gt]: 6,                // > 6
   * [Op.gte]: 6,               // >= 6
   * [Op.lt]: 10,               // < 10
   * [Op.lte]: 10,              // <= 10
   * [Op.ne]: 20,               // != 20
   * [Op.eq]: 3,                // = 3
   * [Op.not]: true,            // IS NOT TRUE
   * [Op.between]: [6, 10],     // BETWEEN 6 AND 10
   * [Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15
   * [Op.in]: [1, 2],           // IN [1, 2]
   * [Op.notIn]: [1, 2],        // NOT IN [1, 2]
   * [Op.like]: '%hat',         // LIKE '%hat'
   * [Op.notLike]: '%hat'       // NOT LIKE '%hat'
   * [Op.iLike]: '%hat'         // ILIKE '%hat' (case insensitive) (PG only)
   * [Op.notILike]: '%hat'      // NOT ILIKE '%hat'  (PG only)
   * [Op.regexp]: '^[h|a|t]'    // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
   * [Op.notRegexp]: '^[h|a|t]' // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
   * [Op.iRegexp]: '^[h|a|t]'    // ~* '^[h|a|t]' (PG only)
   * [Op.notIRegexp]: '^[h|a|t]' // !~* '^[h|a|t]' (PG only)
   * [Op.like]: { [Op.any]: ['cat', 'hat']}  // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
   * [Op.overlap]: [1, 2]       // && [1, 2] (PG array overlap operator)
   * [Op.contains]: [1, 2]      // @> [1, 2] (PG array contains operator)
   * [Op.contained]: [1, 2]     // <@ [1, 2] (PG array contained by operator)
   * [Op.any]: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)
   * [Op.col]: 'user.organization_id' // = "user"."organization_id", with dialect specific column identifiers, PG in this example
   *
   * ⚠️Op为sequelize模块
   *   Op支持组合使用
   */
  operator_handle(query: any): any {
    // console.log(query)
    _.each(query, (v, key: any) => {
      if (v.type) {
        switch (v.type) {
          case 'like':
            return (query[key] = { [Op.like]: `%${v.value}%` });
          case 'between':
            return (query[key] = { [Op.between]: v.value });
          case 'gte':
            return (query[key] = { [Op.gte]: v.value });
          case 'or':
            // _.each(v.value,(value)=>{
            //   this.operator_handle(value)
            // })
            return (query[key] = { [Op.or]: v.value });
          case 'not':
            return (query[key] = { [Op.not]: v.value });
          default:
            break;
        }
      } else {
        if (v == '') delete query[key];
      }
    });
    return query;
  }

  /**
   * 更新TABLE操作
   * @param {object} _query 更新条件 {key:value}
   * @param {object} _record 待更新的数据 {key:value}
   * @returns {number} 更新的数量
   */
  update = async (_query: any, _record: any, _transaction?: any): Promise<number> => {
    const t = _transaction ? _transaction : await sequelize.transaction();
    try {
      let updateRes = await this.model.update(_record, { where: _query, transaction: t });
      //若事务参数由外部传入，则不在该函数内commit
      if (!_transaction) await t.commit();

      return updateRes[0];
    } catch (err) {
      //若事务参数由外部传入，则不在该函数内rollback
      if (!_transaction) await t.rollback();
      // 错误类型处理
      errTypeHandle(err);
    }
  };

  /**
   * 插入或更新单行
   * @param {object} _record 待操作记录 {key:value}
   * @returns {number} 更新的数量
   */
  upsert = async (_record: any, _transaction?: any): Promise<number> => {
    const t = _transaction ? _transaction : await sequelize.transaction();
    try {
      let record: any;
      if (Object.prototype.toString.call(_record) == '[object Array]') {
        _.each(_record, async (item) => {
          [record] = await this.model.upsert(item, { returning: true });
        });
      } else {
        [record] = await this.model.upsert(_record, { returning: true, transaction: t });
      }
      //若事务参数由外部传入，则不在该函数内commit
      if (!_transaction) await t.commit();

      return record;
    } catch (err) {
      // 若事务参数由外部传入，则不在该函数内rollback
      if (!_transaction) await t.rollback();
      // 错误类型处理
      errTypeHandle(err);
    }
  };

  /**
   * 计算总和
   * @param {object} _query {_id:id} 查询条件
   * @returns {object} 查询到的记录
   */
  sum = async (_value: any, _query: any) => {
    try {
      let sumRes = await this.model.sum(_value, {
        where: _query,
      });
      return sumRes;
    } catch (err) {
      throw new QwdError(errorCode.MysqlFindError, err.message);
    }
  };

  /**
   * 计算条目数
   * @param {object} _query {_id:id} 查询条件
   * @returns {object} 查询到的记录
   */
  count = async (_query: any) => {
    try {
      let sumRes = await this.model.count({
        where: _query,
      });
      return sumRes;
    } catch (err) {
      throw new QwdError(errorCode.MysqlFindError, err.message);
    }
  };
}

/**
 * 错误类型处理
 * @param err
 */
function errTypeHandle(err: any) {
  //   console.log('====>>>', err);

  if (err.name) {
    switch (err.name) {
      case 'SequelizeForeignKeyConstraintError':
        throw new QwdError(errorCode.ForeignKeyConstraintError, '无效的请求参数'); // 外键参数不存在（外键约束错误）
      case 'SequelizeDatabaseError':
        throw new QwdError(errorCode.MysqlOutOfRange, '超出设置范围');
      case 'SequelizeUniqueConstraintError':
        if (err.errors.length != 0) throw new QwdError(errorCode.UpdateDuplicate, err.errors[0].value + ' 数据已存在'); // 数据重复
      case 'SequelizeValidationError':
        if (err.errors.length != 0 && err.errors[0].validatorKey == 'len')
          throw new QwdError(errorCode.ParameterLengthError, err.errors[0].value + ' 参数长度不符合规则！');
        throw new QwdError(errorCode.MissingRequiredParameters, '缺少必填写参数');
      default:
        break;
    }
  } else {
    throw new QwdError(errorCode.MysqlUpdateError, err.message);
  }
}

export default BaseCtrl;
