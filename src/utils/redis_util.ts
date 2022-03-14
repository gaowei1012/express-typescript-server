import { redisServer,errorCode } from '@/config/index';
import { QwdError } from '@/controllers/helper';


let redis = require('redis');
global.redis_status = 0;
const RDS_OPT = { auth_pass: redisServer['redispwd'] };

var redis_client;
redis_client = redis.createClient(redisServer['redisPort'], redisServer['redisHost'], RDS_OPT);

redis_client.on('error', function (err) {
  global.redis_status = 0;
  console.log('Error ' + err);
});

redis_client.on('reconnecting', () => {
  console.log('CacheStore - Connection status: reconnecting');
});

redis_client.on('connect', function (err, r) {
  if (err) {
    console.log('redis disconnected ' + err);
  } else {
    global.redis_status = 1;
    console.log('redis connect ' + redis_client.address);
    redis_client.select(1, function (e, r) {
      console.log('redis select db ' + r);
    });
  }
});

redis = {};

/**
 * 新增key-value
 * @param {string} key
 * @param {string} value
 */
redis.set = function (key, value) {
  return new Promise((resolve, reject) => {
    redis_client.set(key, value, function (err, res) {
      !err ? resolve(res) : reject(err)
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisSetError, err.message);
  });
};
/**
 * 获取value
 * @param {string} key
 */
redis.get = function (key) {
  return new Promise((resolve,reject) => {
    redis_client.get(key, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });
};

/**
 * 删除key
 * @param {string} key
 */
 redis.del = function (key) {
  return new Promise((resolve,reject) => {
    redis_client.del(key, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisDeleteError, err.message);
  });
};

/**
 * 设置过期时间
 * @param {string} key
 *  @param {string} value 过期时间seconds
 */
redis.expire = function (key, value) {
  return new Promise((resolve, reject) => {
    redis_client.expire(key, value, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisSetError, err.message);
  });
};

/**
 * 持久化key
 * @param {string} key key名
 */
redis.persist = function (key) {
  return new Promise((resolve, reject) => {
    redis_client.persist(key, value, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisPersistError, err.message);
  });
};

redis.incr = function (key) {
  return new Promise((resolve, reject) => {
    redis_client.incr(key, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisAddError, err.message);
  });
};

// 事务
redis.multi = function () {
  return redis_client.multi();
};

/**
 * 查看key是否存在
 * @param {string} key key名
 * @returns {int} 1存在/0不存在
 */
redis.exists = function (key) {
  return new Promise((resolve, reject) => {
    redis_client.exists(key, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });
};

/**
 * 添加成员到集合
 * @param {string} set 集合名
 * @param {Array} valuelist 成员名或列表
 *  @returns {int} 1成功/0失败
 */
redis.sadd = function (set, valuelist) {
  return new Promise((resolve, reject) => {
    redis_client.sadd(set, valuelist, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisAddError, err.message);
  });
};

/**
 * 从集合删除成员
 * @param {string} set 集合名
 * @param {Array} value 成员名
 *  @returns {int} 1成功/0失败
 */
redis.srem = function (set, valuelist) {
  return new Promise((resolve, reject) => {
    redis_client.srem(set, valuelist, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisDeleteError, err.message);
  });
};

/**
 * 查看成员是否在集合内
 * @param {string} set 集合名
 * @param {string} value 成员名
 * @returns {int} 1在/0不在
 */
redis.sismember = function (set, value) {
  return new Promise((resolve, reject) => {
    redis_client.sismember(set, value, function (err, res) {
      // return resolve(res);
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });
};

/**
 * 添加成员[key-value]到哈希集合
 * @param {string} hashKey 哈希集合名
 * @param {string} subKey 成员键
 * @param {string} value 成员值
 *  @returns {int} 1成功/0失败
 */
redis.hset = function (hashKey, subKey, value) {
  return new Promise((resolve, reject) => {
    redis_client.hset(hashKey, subKey, value, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisSetError, err.message);
  });
};

/**
 * 添加成员对象到哈希集合
 * @param {string} hashKey 哈希集合名
 * @param {obj} obj 成员对象
 *  @returns {int} 1成功/0失败
 */
redis.hmset = function (hashKey, obj) {
  return new Promise((resolve, reject) => {
    redis_client.hmset(hashKey, obj, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisSetError, err.message);
  });
};

/**
 * 获取所有给定字段的值
 * @param {string} hashKey 哈希集合名
 * @param {Array} keylist 字段列表
 *  @returns {int} 1成功/0失败
 */
redis.hmget = function (hashKey, keylist) {
  return new Promise((resolve, reject) => {
    redis_client.hmget(hashKey, keylist, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });;
};

/**
 * 删除一个或多个Key-pair
 * @param {string} hashKey 哈希集合名
 * @param {Array} keylist 删除key数组
 *  @returns {int} 1成功/0失败
 */
redis.hdel = function (hashKey, keylist) {
  return new Promise((resolve, reject) => {
    redis_client.hdel(hashKey, keylist, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisDeleteError, err.message);
  });;
};

/**
 * 从哈希集合获取一个key-pair
 * @param {string} hashKey 哈希集合名
 * @param {string} key 要获取的key
 *  @returns {int} 1成功/0失败
 */
redis.hget = function (hashKey, key) {
  return new Promise((resolve, reject) => {
    redis_client.hget(hashKey, key, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });;;
};

/**
 * 从哈希集合获取对象
 * @param {string} hashKey 哈希集合名
 *  @returns {int} 1成功/0失败
 */
redis.hgetall = function (hashKey) {
  return new Promise((resolve, reject) => {
    redis_client.hgetall(hashKey, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });;;
};

/**
 * 符合给定模式的 key 列表 (Array)
 * @param {string} key
 */
redis.keys = function (key) {
  return new Promise((resolve, reject) => {
    redis_client.keys(key, (err, matchingKeys) => {
      if (err) return reject(err);
      return resolve(matchingKeys);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });
};

/**
 * 返回所有(一个或多个)给定 key 的值
 * @param {string} key
 */
redis.mget = function (key) {
  return new Promise((resolve, reject) => {
    redis_client.mget(key, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });
};

/**
 * 将一个或多个成员元素及其分数值加入到有序集当中
 * @param {string} key
 */
redis.zadd = function (key, value, obj) {
  return new Promise((resolve, reject) => {
    redis_client.zadd([key, value, obj], function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisAddError, err.message);
  });
};

/**
 * 返回有序集中，指定区间内的成员
 * @param {string} key
 * @param {string} start
 * @param {string} stop
 */
redis.zervrange = function (key, start, stop) {
  return new Promise((resolve, reject) => {
    redis_client.ZREVRANGE(key, start, stop, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  }).catch(err=>{
    throw new QwdError(errorCode.RedisGetError, err.message);
  });
};

/**
 * 计算集合中元素的数量。
 * @param {string} key
 * @param {string} start
 * @param {string} stop
 */
redis.zcard = function (key) {
  return new Promise((resolve, reject) => {
    redis_client.ZCARD(key, function (err, res) {
      !err ? resolve(res) : reject(err);
    });
  });
};

function value(key: any, value: any, arg2: (err: any, res: any) => void) {
  throw new Error('Function not implemented.');
}

export default redis;
