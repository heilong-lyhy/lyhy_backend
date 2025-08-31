    try {
      // 1. 通过username在planlist中查询出userid
      const planlist = await ctx.model.Planlist.findOne({
        where: { username },
      });

      if (!planlist) {
        ctx.logger.error('未找到该用户的planlist记录:', username);
        return null;
      }

      const userid = planlist.userid;

      // 2. 通过userid和planid去plan查询出plan的内容
      const plan = await ctx.model.Plan.findOne({
        where: { userid, planid },
      });

      if (!plan) {
        ctx.logger.error('未找到该用户的plan记录:', { userid, planid });
        return null;
      }

      // 3. 通过planid去subitem中查询出subitem的内容
      const subitems = await ctx.model.Subitem.findAll({
        where: { planid },
      });

      // 4. 格式化日期和整合数据
      const formatDate = date => dayjs(date).format('YYYY-MM-DD HH:mm:ss');


      const result = {
        planid: plan.planid,
        plantitle: plan.plantitle,
        description: plan.description,
        createdAt: formatDate(plan.plancreatedAt),
        deadline: formatDate(plan.plandeadline),
        subItems: subitems.map(item => ({
          subid: item.subid,
          subtitle: item.subtitle,
          description: item.description,
          completed: item.completed === 1, // 转换为布尔值
          createdAt: item.created_at.getTime(),
          updatedAt: item.updated_at.getTime(),
        })),
      };

      return result;
    } catch (error) {
      ctx.logger.error('查询学习计划失败:', error);
      throw error;
    }