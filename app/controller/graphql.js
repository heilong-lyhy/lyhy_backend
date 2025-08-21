'use strict';

module.exports = {
  async index(ctx) {
    // 使用Egg.js GraphQL插件提供的方式处理请求
    // 插件会自动根据schema和resolver处理查询
    const result = await ctx.app.graphql.execute({
      query: ctx.request.body.query,
      variables: ctx.request.body.variables,
      operationName: ctx.request.body.operationName,
      context: ctx,
    });
    ctx.body = result;
  },
};
