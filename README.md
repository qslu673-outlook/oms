# oms
order management system

## 电子签名生成器 (Electronic Signature Generator)

本项目为订单管理系统开发了完整的电子签名生成器功能，支持手写电子签名的创建、管理和存储。

### 项目结构

```
oms/
├── backend/              # 后端服务器
│   ├── server.js        # Express服务器及API
│   ├── package.json     # 后端依赖配置
│   └── orders.db        # SQLite数据库（运行时自动生成）
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── components/  # React组件
│   │   │   ├── SignatureCanvas.js      # 签名画布组件
│   │   │   ├── SignatureGenerator.js   # 签名生成器模态框
│   │   │   └── SignatureManager.js     # 签名管理组件
│   │   ├── App.js       # 主应用组件
│   │   └── index.js     # 应用入口
│   └── package.json     # 前端依赖配置
├── README.md            # 项目说明（本文件）
├── SIGNATURE_GENERATOR.md  # 详细技术文档
└── requirements.md      # 需求规格说明
```

### 快速开始

#### 1. 安装依赖

**后端:**
```bash
cd backend
npm install
```

**前端:**
```bash
cd frontend
npm install
```

#### 2. 运行应用

**启动后端服务器（在 backend 目录）:**
```bash
npm start
```
后端服务器将在 `http://localhost:5000` 启动

**启动前端应用（在 frontend 目录）:**
```bash
npm start
```
前端应用将在 `http://localhost:3000` 启动并自动打开浏览器

### 主要功能

✍️ **电子签名生成**
- 支持鼠标和触摸屏手写签名
- 实时预览签名效果
- 支持撤销和清除操作

👤 **签名管理**
- 记录签名人姓名和角色
- 自动记录签名时间
- 支持查看、删除签名

🔗 **订单集成**
- 可关联签名到订单
- 支持独立签名生成
- 完整的签名历史记录

💾 **数据持久化**
- SQLite数据库存储
- PNG格式签名图片（Base64编码）
- RESTful API接口

### 技术栈

**后端:**
- Node.js + Express
- better-sqlite3 (SQLite数据库)
- CORS支持

**前端:**
- React
- Ant Design (UI组件库)
- signature_pad (签名画布)
- axios (HTTP客户端)
- dayjs (日期处理)

### API端点

#### 签名相关
- `POST /api/signatures` - 创建签名（关联订单）
- `POST /api/signatures/generate` - 生成独立签名
- `GET /api/signatures` - 获取所有签名
- `GET /api/signatures?order_id=X` - 获取指定订单的签名
- `GET /api/signatures/:id` - 获取指定签名
- `DELETE /api/signatures/:id` - 删除签名

#### 其他端点
完整的客户、订单和订单详情管理API请参考 `requirements.md`

### 截图

查看完整的应用截图和功能演示，请参考 PR 描述。

### 文档

- [详细技术文档](SIGNATURE_GENERATOR.md) - 完整的技术说明和API文档
- [需求规格说明](requirements.md) - 订单管理系统需求

### 开发

项目采用前后端分离架构：
- 后端提供RESTful API服务
- 前端使用React构建用户界面
- 数据存储使用SQLite数据库

### 许可证

ISC

