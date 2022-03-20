let redisLocalServer: any = {};
let options: any = {
  redis_cms_login_session: "yl-cms-user:loginsession",
};

if (process.env.NODE_ENV === "docker") {
  redisLocalServer = {
    redisPort: 27812,
    redisHost: "sh-crs-hehe9ijl.sql.tencentcdb.com",
    redispwd: process.env.REDIS_PASSWORD,
    ...options,
  };
} else {
  redisLocalServer = {
    redisPort: 27812,
    redisHost: "127.0.0.1",
    // redisHost: "sh-crs-hehe9ijl.sql.tencentcdb.com",
    // redispwd: "qwd920224",
    redispwd: "",
    ...options,
  };
}

export default redisLocalServer;
