## 部署文档

### 前端部署

```bash
# 克隆项目
git clone https://git.coding.net/zg919506719/candybox_manage.git

# cd到前端目录
cd ./frontend

# 安装依赖
npm install

# 修改config 在config/prod.env.js 文件的host

# 打包
npm run build

# 生成dist文件夹，直接部署到服务器上

```

### 后端部署

```bash
# 服务器先安装nodejs 环境
# 克隆项目
git clone https://git.coding.net/zg919506719/candybox_manage.git

# cd到后端目录
cd ./backend

# 安装依赖
npm install

# 修改config/config.prod.js 数据库配置
config.sequelize = {
    dialect: 'mysql',
    hostname: '127.0.0.1',
    host: '127.0.0.1',
    port: 3306,
    database: 'candybox',
    username: 'root',
    password: 'candyboxtest',
    dialectOptions: {
        multipleStatements: true,
    },
};

# 启动服务
npm start

# 停止服务
npm stop
```


## CandyBox管理后台功能列表
### 一、项目（糖果）管理
1. 项目列表
   - 分页显示
   - 简单的查询功能
2. 新增项目
   - 项目基本信息（logo，所属公链，TokenName，Token标准，糖果总数，每天最大数量，每次领取数量，起始时间，官网，状态（初始、进行中、已停止），是否仅限开红包奖励，是否前端显示）
   - 多语言设置（项目名称，简介，介绍）
   - ~~任务配置~~，dapp里面没有任务功能，管理后台去掉该项配置
   - 社交媒体链接（白皮书、facebook、telegram、twitter）
3. 修改项目
   - 同上
4. 项目详情
   - 领取日志candy_userproject、candy_usertokenlog（action=in）
   - 提现日志candy_usertokenlog（action=out）
   
### 二、红包配置管理
1. 红包管理（支持以下两种红包）
   - 新手红包
   - 邀请红包
2. 红包内容管理（支持奖励体力上限和糖果）
   - 奖励体力上限
   - 奖励糖果
      - 可设置奖励哪种糖果（就是1中的项目）
      - 可设置奖励金额范围、精度，可分段设置概率
   
### 三、用户管理
1. 用户列表
   - 分页显示
   - 简单的查询功能
2. 用户详情
   - 用户基本信息（ONTID、是否认证，创建时间，最后登录时间，AP，MaxAP，手机，邀请人，邀请数量，红包数量，已开红包数量等）
   - 开红包日志（红包id，title，状态，时间，奖励内容等）