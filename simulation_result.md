# 前端请求处理模拟分析

## 请求详情
```json
{
  "Content-Type": "application/json", 
  "token": "123"
}
{
  "query": "query usergetPlanlist($params: PlanList) { usergetPlanlist(params: $params) }", 
  "operationName": "usergetPlanlist", 
  "variables": {
    "params": {
      "username": "用户名值"
    }
  }
}
```

## 处理流程分析

### 1. 请求进入 graphql_response_handler 中间件

```javascript
// 中间件识别这是一个GraphQL请求
const isGraphqlPath = ctx.request.url.includes('/graphql'); // true
const isJsonContent = ctx.request.header['content-type']?.includes('application/json'); // true
isGqlQuery = true;

// 尝试验证Token
const verifyToken = async () => {
  // 问题点1: 前端使用的是'token'字段，而后端代码从'authorization'字段获取
  const token = ctx.request.header.authorization?.split(' ')[1]; // undefined
  
  if (!token) {
    ctx.body = {
      success: false,
      errorCode: 'NO_TOKEN',
      errorMessage: '请先登录',
      showType: 2
    };
    return false;
  }
  // ...
};

// Token验证失败，返回错误响应
const isTokenValid = await verifyToken(); // false
if (!isTokenValid) {
  return;
}
```

### 2. 如果Token验证成功，请求会继续传递

```javascript
// 请求会经过GraphQL解析器
// resolver.js
Query: {
  usergetPlanlist: (_, { params }, ctx) => {
    return ctx.connector.Planlist.usergetPlanlist(params);
  }
}

// connector.js
async usergetPlanlist(params) {
  const planlist = await this.service.usergetPlanList(params);
  return planlist;
}

// PlanListService.js
async usergetPlanList(params) {
  const { ctx } = this;
  const { username } = params;
  const studyplanlist = await ctx.model.Planlist.findOne({
    where: { username },
  });

  const result = {
    mainplans: studyplanlist ? studyplanlist.mainplans : [], // 如果没找到记录，返回空数组
  };
  return result;
}
```

### 3. 响应处理

```javascript
// 重新封装响应
ctx.body = {
  success: true, // 如果查询成功
  data: response.data, // 包含mainplans数组
  errorCode: undefined,
  errorMessage: undefined,
  showType: 0,
  traceId: '生成的唯一ID',
  host: ctx.request.header.host
};
```

## 潜在问题与解决方案

### 问题1: Token传递方式不匹配
**现状**: 前端在请求头中使用`token: "123"`，但后端代码从`authorization`字段获取并期望格式为`Bearer token值`。

**解决方案**: 
```javascript
// 修改graphql_response_handler.js中的verifyToken函数
const verifyToken = async () => {
  // 同时支持两种token传递方式
  let token = ctx.request.header.authorization?.split(' ')[1];
  if (!token) {
    token = ctx.request.header.token; // 尝试从token字段获取
  }
  
  if (!token) {
    ctx.body = {
      success: false,
      ...requestErrorConfig.NO_TOKEN,
    };
    return false;
  }
  
  // 其余验证代码不变
  // ...
};
```

### 问题2: Token验证失败
**现状**: 模拟的token值"123"很可能是无效的JWT token，会导致验证失败。

**解决方案**: 使用有效的JWT token，或者在开发环境下添加跳过验证的逻辑：
```javascript
// 在verifyToken函数开头添加
// 开发环境下可以添加特定的测试token绕过验证
if (!isProduction && token === 'test_token') {
  ctx.user = { username: 'test_user' }; // 模拟用户信息
  return true;
}
```

### 问题3: 数据库查询结果处理
**现状**: PlanList模型中的mainplans字段类型是TEXT，存储的是JSON字符串，但查询时直接返回了这个字符串。

**解决方案**: 在查询结果返回前解析JSON字符串：
```javascript
// 修改PlanListService.js中的usergetPlanList方法
const result = {
  mainplans: studyplanlist ? JSON.parse(studyplanlist.mainplans) : [], // 解析JSON字符串
};
```

## 结论
当前请求在默认情况下会因为Token验证失败而返回`NO_TOKEN`错误。需要调整Token传递方式或者修改后端验证逻辑，同时确保数据库返回的JSON字符串被正确解析。