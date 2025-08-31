// 'use strict';

// const Service = require('egg').Service;
// const dayjs = require('dayjs');

// class StudyplanService extends Service {
//   async usergetStudyplan(params) {
//     const { ctx } = this;
//     const { id } = params;
//     const studyplan = await ctx.model.Plan.findOne({
//       where: { planid: id },
//       include: [{
//         model: ctx.model.Subitem,
//         as: 'subItems',
//         hierarchy: true,
//       }],
//     });

//     const formatDate = date => dayjs(date).format('YYYY-MM-DD HH:mm:ss');

//     const result = {
//       ...studyplan.dataValues,
//       createdAt: formatDate(studyplan.created_at),
//       deadline: formatDate(studyplan.deadline),
//       subItems: studyplan.subItems.map(item => ({
//         ...item.dataValues,
//         createdAt: item.created_at.getTime(),
//         updatedAt: item.updated_at.getTime(),
//       })),
//     };
//     return result;
//   }
// }

// module.exports = StudyplanService;
