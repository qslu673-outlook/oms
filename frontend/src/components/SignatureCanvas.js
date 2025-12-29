import React, { useRef, useEffect, useState } from 'react';
import SignaturePad from 'signature_pad';
import { Button, Space, Card } from 'antd';
import { ClearOutlined, CheckOutlined, UndoOutlined } from '@ant-design/icons';

const SignatureCanvas = ({ onSave, width = 600, height = 300 }) => {
  const canvasRef = useRef(null);
  const [signaturePad, setSignaturePad] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const pad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
        minWidth: 1,
        maxWidth: 3,
      });

      // Update isEmpty state when signature changes
      pad.addEventListener('beginStroke', () => {
        setIsEmpty(false);
      });

      setSignaturePad(pad);

      // Handle window resize
      const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        pad.clear();
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        pad.off();
      };
    }
  }, []);

  const handleClear = () => {
    if (signaturePad) {
      signaturePad.clear();
      setIsEmpty(true);
    }
  };

  const handleUndo = () => {
    if (signaturePad) {
      const data = signaturePad.toData();
      if (data && data.length > 0) {
        data.pop();
        signaturePad.fromData(data);
        setIsEmpty(data.length === 0);
      }
    }
  };

  const handleSave = () => {
    if (signaturePad && !signaturePad.isEmpty()) {
      const dataURL = signaturePad.toDataURL('image/png');
      onSave(dataURL);
    }
  };

  return (
    <Card>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          border: '2px solid #d9d9d9', 
          borderRadius: '4px',
          display: 'inline-block',
          backgroundColor: '#fff'
        }}>
          <canvas
            ref={canvasRef}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              touchAction: 'none',
              cursor: 'crosshair'
            }}
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Space>
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClear}
              disabled={isEmpty}
            >
              清除
            </Button>
            <Button 
              icon={<UndoOutlined />} 
              onClick={handleUndo}
              disabled={isEmpty}
            >
              撤销
            </Button>
            <Button 
              type="primary" 
              icon={<CheckOutlined />} 
              onClick={handleSave}
              disabled={isEmpty}
            >
              保存签名
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default SignatureCanvas;
