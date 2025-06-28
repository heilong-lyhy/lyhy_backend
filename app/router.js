/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.post('/graphql', controller.graphql.index);
  router.get('/', controller.home.index);
};
