## 介绍

后端 nestjs+prisma+swagger（自动生成接口文档）

后台前端用[v3-admin](https://github.com/un-pany/v3-admin)对接，新增了一些基础功能

## 安装项目

```bash

#克隆项目到本地
$ git clone

#安装后端依赖
$ pnpm install

#安装后台依赖
$ cd admin
$ pnpm install

```

```bash
#前端地址
FRONTEND_URL=http://localhost:3333/ 
#数据库设置，支持mysql（数据库类型）://nestjsapi（账号）:nestjsapi（密码）@localhost（host）:3306（端口）/nestjsapi（数据库名）
DATABASE_URL="mysql://nestjsapi:nestjsapi@localhost:3306/nestjsapi?schema=public"
#jwt密钥，随机生成个32位字符串替换
JWT_SECRET=Y01ZQp1HCJzHGihNQQAmCn5wc5SfcFBb
#邮件配置
MAIL_HOST=smtp.example.com
MAIL_USER=your-email@example.com
MAIL_PASSWORD=your-password
MAIL_FROM=noreply@example.com
```

```bash
#迁移数据库
$ npx prisma db push
```

## 启动项目

```bash
# development
$ pnpm dev

# 注意：启动后会自动生成一条系统管理员数据和uesr_group数据，请根据需要自行修改，
path: src/prisma/pjrisma.service.ts
seedData() 方法，请根据需要自行修改

# production mode
$ pnpm start:prod
$ pnpm build
```

## 前后端地址

```bash

# 后台前端访问地址
http://localhost:3333

# 后端接口文档
http://localhost:3000/docs

# prisma studio 数据库管理地址
http://localhost:5555


```

## Run tests

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## 基础功能

认证系统:

- [x] JWT 基于令牌的认证
- [x] 用户登录/注册
- [x] 密码重置

验证码:

- [x] 图形验证码
- [x] 登录验证
- [x] 防暴力破解

邮箱验证:

- [x] 密码重置验证

用户管理:

- [x] 个人信息修改
- [x] 用户表单及增删改查

## todo

- 完善注册验证
- 手机验证码登录注册
- 动态路由增删改查接口
