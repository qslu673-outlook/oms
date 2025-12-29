import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Image, Tag, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import SignatureGenerator from './SignatureGenerator';
import axios from 'axios';
import dayjs from 'dayjs';

const SignatureManager = ({ orderId = null }) => {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSignatures();
  }, [orderId]);

  const fetchSignatures = async () => {
    setLoading(true);
    try {
      const url = orderId 
        ? `http://localhost:5000/api/signatures?order_id=${orderId}`
        : 'http://localhost:5000/api/signatures';
      
      const response = await axios.get(url);
      setSignatures(response.data);
    } catch (error) {
      message.error('获取签名列表失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/signatures/${id}`);
      message.success('签名删除成功');
      fetchSignatures();
    } catch (error) {
      message.error('删除签名失败: ' + (error.response?.data?.error || error.message));
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '签名人',
      dataIndex: 'signer_name',
      key: 'signer_name',
    },
    {
      title: '角色',
      dataIndex: 'signer_role',
      key: 'signer_role',
      render: (role) => <Tag color="blue">{role || '未指定'}</Tag>,
    },
    {
      title: '签名日期',
      dataIndex: 'signature_date',
      key: 'signature_date',
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '订单ID',
      dataIndex: 'order_id',
      key: 'order_id',
      render: (order_id) => order_id ? <Tag color="green">订单 #{order_id}</Tag> : <Tag>独立签名</Tag>,
    },
    {
      title: '签名预览',
      dataIndex: 'signature_data',
      key: 'signature_data',
      render: (data) => (
        <Image
          src={data}
          alt="签名"
          width={100}
          height={50}
          style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="确定要删除这个签名吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={orderId ? `订单 #${orderId} 的签名列表` : '所有签名列表'}
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setModalVisible(true)}
        >
          新建签名
        </Button>
      }
    >
      <Table
        dataSource={signatures}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <SignatureGenerator
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        orderId={orderId}
        onSuccess={fetchSignatures}
      />
    </Card>
  );
};

export default SignatureManager;
