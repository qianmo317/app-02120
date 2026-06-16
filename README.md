# 优品商城 - 线上购物商城前端

## How to Run

### Docker 部署（推荐）

```bash
# 构建并启动容器
docker-compose up --build -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 本地开发

```bash
# 进入前端目录
cd frontend-user

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Services

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend-user | 8081 | 用户端商城前端 |

访问地址：http://localhost:8081

## 测试账号

| 用户名 | 密码 | 说明 |
|--------|------|------|
| demo | 123456 | 演示账号 |

## 题目内容

> 使用vue生成一个关于线上购物商城的网站前端页面

---

## 项目介绍

一个基于 Vue 3 + Vite + Element Plus 构建的现代化线上购物商城前端项目。

### 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: SCSS

### 功能模块

#### 🏠 首页
- 轮播图展示
- 分类导航
- 热销商品推荐
- 新品推荐

#### 📦 商品模块
- 商品分类浏览
- 商品列表（支持筛选、排序、分页）
- 商品详情（图片轮播、规格选择、库存显示）
- 商品搜索

#### 🛒 购物车
- 添加/删除商品
- 修改商品数量
- 选择/全选商品
- 实时价格计算

#### 📋 订单模块
- 订单结算
- 订单列表
- 订单详情
- 订单状态跟踪

#### 👤 用户中心
- 登录/注册
- 个人资料管理
- 收货地址管理
- 我的收藏

### 项目结构

```
frontend-user/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口层
│   ├── components/        # 组件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── styles/            # 全局样式
│   ├── views/             # 页面视图
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── Dockerfile             # Docker 构建文件
├── nginx.conf             # Nginx 配置
├── package.json           # 项目依赖
└── vite.config.js         # Vite 配置
```

### Docker 镜像说明

本项目使用的基础镜像均支持多平台架构（AMD64/ARM64）：
- 构建阶段：`node:20-alpine`
- 运行阶段：`nginx:1.25-alpine`

可通过以下命令验证镜像的 ARM 支持：
```bash
docker pull --platform linux/arm64 node:20-alpine
docker pull --platform linux/arm64 nginx:1.25-alpine
```
