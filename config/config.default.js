/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    sequelize: {
      dialect: 'mysql', // 数据库类型
      host: 'localhost', // 数据库地址
      port: 3306, // 数据库端口
      database: 'planwebdatabase',
      username: 'heilong_lyhy',
      password: 'mjlyhy',
    },

    graphql: {
      router: '/graphql',
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
      // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
      graphiql: process.env.NODE_ENV === 'development',
      // 是否设置默认的Query和Mutation, 默认关闭
      defaultEmptySchema: true,
      // graphQL 路由前的拦截器
      // onPreGraphQL: function* (ctx) {},
      // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
      // 这是一个仅允许开发机使用的示例
      onPreGraphiQL: async ctx => {
        if (ctx.request.header.host !== '127.0.0.1:7001') {
          ctx.throw(403, `${ctx.request.header.host} Access Denied`);
        }
      },
    },
    // jsonwebtoken 的必要变量
    jwt: {
      jwtSecret: 'process.env.APP_JWT_SECRET',
      expiresIn: '9h', // 设置 token 过期时间，可调整为适合的值
    },
  };

  // exports.sequelize = {
  //   dialect: 'mysql', // 数据库类型
  //   host: 'localhost', // 数据库地址
  //   port: 3306, // 数据库端口
  //   database: 'planwebdatabase',
  //   username: 'heilong_lyhy',
  //   password: 'mjlyhy',
  // };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1744426642798_4724';

  exports.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };

  // add your middleware config here
  config.middleware = [ 'graphqlResponseHandler', 'errorHandler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
