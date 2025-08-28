'use strict';


module.exports = {
  Query: {
    usergetPlanlist: (_, { params }, ctx) => {
      return ctx.connector.Planlist.usergetPlanlist(params);
    },

  },

  Mutation: {
    userResetPlanlist: (_, { input }, ctx) => {
      return ctx.connector.Planlist.userResetPlanlist(input);
    },
  },

};
