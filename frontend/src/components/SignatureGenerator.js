import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, Image } from 'antd';
import SignatureCanvas from './SignatureCanvas';
import axios from 'axios';

const { Option } = Select;

const SignatureGenerator = ({ visible, onClose, orderId = null, onSuccess }) => {
  const [form] = Form.useForm();
  const [signatureData, setSignatureData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignatureSave = (dataURL) => {
    setSignatureData(dataURL);
    message.success('签名已捕获，请填写签名者信息并提交');
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      if (!signatureData) {
        message.error('请先绘制签名');
        return;
      }

      setLoading(true);

      const apiUrl = orderId 
        ? 'http://localhost:5000/api/signatures'
        : 'http://localhost:5000/api/signatures/generate';

      const payload = {
        signature_data: signatureData,
        signer_name: values.signer_name,
        signer_role: values.signer_role || '签名人',
        ip_address: 'client-ip',
        ...(orderId && { order_id: orderId })
      };

      const response = await axios.post(apiUrl, payload);

      message.success('签名保存成功');
      form.resetFields();
      setSignatureData(null);
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      onClose();
    } catch (error) {
      message.error('保存签名失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSignatureData(null);
    onClose();
  };

  return (
    <Modal
      title="电子签名生成器"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={800}
      confirmLoading={loading}
      okText="提交签名"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="signer_name"
          label="签名人姓名"
          rules={[{ required: true, message: '请输入签名人姓名' }]}
        >
          <Input placeholder="请输入签名人姓名" />
        </Form.Item>

        <Form.Item
          name="signer_role"
          label="签名人角色"
          rules={[{ required: true, message: '请选择签名人角色' }]}
        >
          <Select placeholder="请选择签名人角色">
            <Option value="客户">客户</Option>
            <Option value="销售代表">销售代表</Option>
            <Option value="经理">经理</Option>
            <Option value="财务">财务</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item label="电子签名">
          <SignatureCanvas onSave={handleSignatureSave} width={700} height={250} />
        </Form.Item>

        {signatureData && (
          <Form.Item label="签名预览">
            <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', backgroundColor: '#f5f5f5' }}>
              <Image src={signatureData} alt="签名预览" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default SignatureGenerator;
