## 部署文档

前端配置文件目录 
frontend/config/dev.env.js
frontend/config/prod.env.js

后端配置文件目录
backend/config/config.local.js
backend/config/config.prod.js

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
