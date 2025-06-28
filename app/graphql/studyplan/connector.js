'use strict';

class StudyplanConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.service = ctx.service.studyplan.studyplan;
  }

  async usergetStudyplan(params) {
    const studyplan = await this.service.usergetStudyplan(params);
    return studyplan;
  }


//   async userResetFoudlist(input) {
//     const result = await this.service.userResetFoudlist(input);
//     return result;
//   }
}

module.exports = StudyplanConnector;
