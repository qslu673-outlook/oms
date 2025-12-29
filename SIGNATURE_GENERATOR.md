# 电子签名生成器

订单管理系统的电子签名生成器模块，支持手写电子签名的创建、保存和管理。

## 功能特点

- ✍️ **手写签名**: 支持鼠标和触摸屏绘制电子签名
- 🎨 **签名编辑**: 支持撤销、清除等编辑功能
- 👤 **签名者信息**: 记录签名人姓名、角色、时间等信息
- 🔗 **订单关联**: 可以将签名关联到特定订单
- 💾 **数据持久化**: 签名数据存储在SQLite数据库中
- 🖼️ **签名预览**: 实时预览签名效果

## 技术栈

### 后端
- **Node.js** + **Express**: RESTful API服务器
- **better-sqlite3**: SQLite数据库
- **CORS**: 跨域资源共享支持

### 前端
- **React**: 用户界面框架
- **Ant Design**: UI组件库
- **signature_pad**: 签名画布库
- **axios**: HTTP客户端
- **dayjs**: 日期处理

## 快速开始

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 运行应用

**1. 启动后端服务器**

```bash
cd backend
npm start
```

后端服务器将在 `http://localhost:5000` 启动

**2. 启动前端应用**

```bash
cd frontend
npm start
```

前端应用将在 `http://localhost:3000` 启动并自动打开浏览器

## 使用说明

1. **创建签名**
   - 点击"新建签名"按钮
   - 填写签名人姓名
   - 选择签名人角色（客户、销售代表、经理、财务、其他）
   - 在签名区域使用鼠标或触摸屏绘制签名
   - 点击"保存签名"按钮捕获签名
   - 预览签名后点击"提交签名"保存到数据库

2. **查看签名**
   - 签名列表显示所有已保存的签名
   - 可以查看签名预览、签名人信息、签名时间等
   - 支持按订单ID筛选签名

3. **删除签名**
   - 点击每条签名记录的"删除"按钮
   - 确认后即可删除签名

## API文档

### 签名相关接口

#### 创建签名（关联订单）
```
POST /api/signatures
Content-Type: application/json

{
  "order_id": 1,
  "signature_data": "data:image/png;base64,...",
  "signer_name": "张三",
  "signer_role": "客户",
  "ip_address": "192.168.1.1"
}
```

#### 生成独立签名
```
POST /api/signatures/generate
Content-Type: application/json

{
  "signature_data": "data:image/png;base64,...",
  "signer_name": "张三",
  "signer_role": "客户",
  "ip_address": "192.168.1.1"
}
```

#### 获取所有签名
```
GET /api/signatures
```

#### 获取指定订单的签名
```
GET /api/signatures?order_id=1
```

#### 获取指定签名
```
GET /api/signatures/:id
```

#### 删除签名
```
DELETE /api/signatures/:id
```

### 其他接口

系统还包含完整的客户、订单和订单详情管理API，详见 `requirements.md`。

## 数据库结构

### signatures 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| order_id | INTEGER | 关联订单ID（可为空） |
| signature_data | TEXT | 签名图片数据（Base64） |
| signer_name | TEXT | 签名人姓名 |
| signer_role | TEXT | 签名人角色 |
| signature_date | TEXT | 签名日期时间 |
| ip_address | TEXT | IP地址 |
| created_at | TEXT | 创建时间 |

## 项目结构

```
oms/
├── backend/              # 后端服务器
│   ├── server.js        # Express服务器
│   ├── package.json     # 后端依赖
│   └── orders.db        # SQLite数据库（自动生成）
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── components/  # React组件
│   │   │   ├── SignatureCanvas.js      # 签名画布组件
│   │   │   ├── SignatureGenerator.js   # 签名生成器模态框
│   │   │   └── SignatureManager.js     # 签名管理组件
│   │   ├── App.js       # 主应用组件
│   │   └── index.js     # 应用入口
│   └── package.json     # 前端依赖
├── README.md            # 项目说明（本文件）
├── SIGNATURE_GENERATOR.md  # 详细文档
└── requirements.md      # 需求规格说明
```

## 开发计划

- [x] 基础签名画布功能
- [x] 签名数据存储
- [x] 签名管理界面
- [x] API接口实现
- [ ] 订单系统完整实现
- [ ] 签名验证功能
- [ ] 签名导出（PDF）
- [ ] 多语言支持

## 注意事项

1. 签名数据以Base64格式的PNG图片存储
2. 每个签名包含签名人信息和时间戳
3. 签名可以关联到订单，也可以独立存在
4. 删除订单时会级联删除相关签名
5. 建议在生产环境中添加签名验证和防篡改机制

## 许可证

ISC

## 贡献

欢迎提交Issue和Pull Request！

## 作者

订单管理系统开发团队
