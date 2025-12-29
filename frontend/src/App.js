import React from 'react';
import { Layout, Typography, Tabs } from 'antd';
import { EditOutlined, OrderedListOutlined } from '@ant-design/icons';
import SignatureManager from './components/SignatureManager';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const items = [
    {
      key: '1',
      label: (
        <span>
          <EditOutlined />
          电子签名生成器
        </span>
      ),
      children: <SignatureManager />,
    },
    {
      key: '2',
      label: (
        <span>
          <OrderedListOutlined />
          使用说明
        </span>
      ),
      children: (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <Title level={3}>电子签名生成器使用说明</Title>
          
          <Title level={4}>功能特点</Title>
          <ul>
            <li>支持手写电子签名</li>
            <li>支持鼠标和触摸屏绘制</li>
            <li>签名可以撤销和清除</li>
            <li>支持保存签名者姓名和角色</li>
            <li>可以关联到订单或独立保存</li>
            <li>自动记录签名时间</li>
          </ul>

          <Title level={4}>使用步骤</Title>
          <ol>
            <li>点击"新建签名"按钮</li>
            <li>填写签名人姓名</li>
            <li>选择签名人角色</li>
            <li>在签名区域绘制您的签名</li>
            <li>可以使用"清除"或"撤销"按钮修改签名</li>
            <li>点击"保存签名"捕获签名</li>
            <li>预览签名无误后，点击"提交签名"保存</li>
          </ol>

          <Title level={4}>技术说明</Title>
          <ul>
            <li>前端: React + Ant Design + signature_pad</li>
            <li>后端: Node.js + Express + SQLite</li>
            <li>签名格式: PNG图片 (Base64编码)</li>
            <li>数据存储: SQLite数据库</li>
          </ul>

          <Title level={4}>API接口</Title>
          <ul>
            <li>POST /api/signatures - 创建签名（关联订单）</li>
            <li>POST /api/signatures/generate - 生成独立签名</li>
            <li>GET /api/signatures - 获取所有签名</li>
            <li>GET /api/signatures?order_id=X - 获取指定订单的签名</li>
            <li>GET /api/signatures/:id - 获取指定签名</li>
            <li>DELETE /api/signatures/:id - 删除签名</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 50px' }}>
        <Title level={2} style={{ color: 'white', margin: '14px 0', lineHeight: '50px' }}>
          订单管理系统 - 电子签名生成器
        </Title>
      </Header>
      <Content style={{ padding: '50px', background: '#f0f2f5' }}>
        <div style={{ background: '#fff', padding: '24px', minHeight: '500px', borderRadius: '8px' }}>
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        电子签名生成器 ©2024 订单管理系统
      </Footer>
    </Layout>
  );
}

export default App;

