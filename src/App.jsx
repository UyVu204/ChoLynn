import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Form, Card, message, Modal, ConfigProvider, Typography } from 'antd';
import { HeartFilled, LockOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// --- CẤU HÌNH CHUNG ---
// Link facebook của bạn
const FACEBOOK_LINK = "https://www.facebook.com/UyVuOne"; 
const THEME_COLOR = "#eb2f96"; // Màu hồng đậm lãng mạn

// --- CSS CHO HIỆU ỨNG TIM BAY VÀ BACKGROUND ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Nunito:wght@400;600&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: 'Nunito', sans-serif;
    overflow-x: hidden;
  }

  .romantic-bg {
    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .bg-hearts {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .heart-particle {
    position: absolute;
    color: rgba(235, 47, 150, 0.3);
    font-size: 20px;
    animation: floatUp 10s linear infinite;
  }

  @keyframes floatUp {
    0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
    20% { opacity: 0.8; }
    100% { transform: translateY(-20vh) scale(1.5); opacity: 0; }
  }

  /* Font chữ viết tay cho tiêu đề và thư */
  .font-script {
    font-family: 'Dancing Script', cursive;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.18);
    z-index: 10;
  }

  .letter-container {
    max-width: 600px;
    width: 90%;
    padding: 40px;
    background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
    background-color: #fffdf5;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    border-radius: 5px;
    position: relative;
    margin: 20px;
  }
  
  .letter-container::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 10px;
    background: repeating-linear-gradient(
      -45deg,
      #ff6b6b,
      #ff6b6b 10px,
      #fff 10px,
      #fff 20px,
      #54a0ff 20px,
      #54a0ff 30px,
      #fff 30px,
      #fff 40px
    );
    border-radius: 5px 5px 0 0;
  }
`;

// --- COMPONENT HIỆU ỨNG BACKGROUND ---
const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random(),
        left: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 5 + 5
      };
      setHearts(prev => [...prev.slice(-20), newHeart]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-hearts">
      {hearts.map(h => (
        <div 
          key={h.id} 
          className="heart-particle"
          style={{ 
            left: `${h.left}%`, 
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default function LoveApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State cho nút "Không đồng ý"
  const [noBtnPosition, setNoBtnPosition] = useState({ top: 0, left: 0 });
  const [isHoveringNo, setIsHoveringNo] = useState(false);
  const noBtnRef = useRef(null);

  // --- LOGIC LOGIN (MÔ PHỎNG NODEJS) ---
  const onFinish = (values) => {
    setLoading(true);
    // Giả lập gọi API Nodejs
    setTimeout(() => {
      // Logic kiểm tra: Chấp nhận "linh", "Linh", "LINH"
      if (values.username.toLowerCase().trim() === "linh" && values.password === "03022005") {
        message.success({ content: "Chào mừng Linh đến với những lời dãi bày trong lòng của Bống! ❤️", duration: 3 });
        setIsLoggedIn(true);
      } else {
        message.error("Sai mật khẩu rồi ngốc ạ! (Có lẽ là ngày tháng năm sinh của ai đó?)");
      }
      setLoading(false);
    }, 1500);
  };

  // --- LOGIC NÚT "KHÔNG ĐỒNG Ý" ---
  const moveButton = () => {
    if (!noBtnRef.current) return;
    const buttonSize = noBtnRef.current.getBoundingClientRect();
    // Lấy kích thước màn hình
    const x = Math.random() * (window.innerWidth - buttonSize.width);
    const y = Math.random() * (window.innerHeight - buttonSize.height);
    setNoBtnPosition({ left: x, top: y });
    setIsHoveringNo(true);
  };

  // --- LOGIC NÚT "ĐỒNG Ý" ---
  const handleAgree = () => {
    Modal.success({
      title: <div className="font-script" style={{fontSize: '28px', color: THEME_COLOR}}>Ta xin nói lại lần nữa Anh thích Linh lắm á! ❤️</div>,
      content: (
        <div style={{fontSize: '16px'}}>
          <p>Ta biết ngươi sẽ đồng ý mà (hoặc là bị ép ấn hì hì)!</p>
          <p>Ngươi ấn OK đi đii màa, năn nỉ, ấn xong sau đó nhớ trả lời ta nha.</p>
        </div>
      ),
      okText: "OK nè",
      onOk: () => {
        window.location.href = FACEBOOK_LINK;
      },
      icon: <HeartFilled style={{ color: THEME_COLOR }} />,
      centered: true,
    });
  };

  // Render Trang Login
  if (!isLoggedIn) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: THEME_COLOR } }}>
        <style>{styles}</style>
        <div className="romantic-bg">
          <FloatingHearts />
          <Card className="glass-card" style={{ width: 350, textAlign: 'center' }}>
            <div style={{ marginBottom: 20 }}>
              <HeartFilled style={{ fontSize: 40, color: THEME_COLOR, animation: 'pulse 1.5s infinite' }} />
              <Title level={2} className="font-script" style={{ color: '#333', marginTop: 10 }}>
                Có thể ngươi sẽ thích hoặc không :3
              </Title>
              <Text type="secondary">Nhập tên và mật khẩu nàooo!</Text>
            </div>
            
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Nhập tên ngươi đii tên ta hay gọi á!' }]}
              >
                {/* Đã cập nhật placeholder ẩn ý */}
                <Input prefix={<UserOutlined />} placeholder="Là tên của mi ấy nma kh phải Chi mô..." />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Mật khẩu là ngày tháng năm sinh của aii á!' }]}
              >
                {/* Đã cập nhật placeholder ẩn ý */}
                <Input.Password prefix={<LockOutlined />} placeholder="Ngày tháng năm sinh..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} shape="round">
                  Đăng nhập đii Linh lỡ bốc secret thì seo!
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </ConfigProvider>
    );
  }

  // Render Trang Lá Thư
  return (
    <ConfigProvider theme={{ token: { colorPrimary: THEME_COLOR } }}>
      <style>{styles}</style>
      <div className="romantic-bg" style={{ flexDirection: 'column', height: 'auto', paddingBottom: '100px' }}>
        <FloatingHearts />
        
        <div className="letter-container animate__animated animate__fadeInUp">
          <Title level={1} className="font-script" style={{ textAlign: 'center', color: THEME_COLOR }}>
            Gửi Linhhh...
          </Title>
          
          <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#4a4a4a', fontFamily: 'Nunito, sans-serif', whiteSpace: 'pre-line' }}>
            <p>
              ... Hennuuu Linh thật thật là lâuu rồi nhỉ, để bống nghĩ thì Bống cũng biết Linh được 7 năm rồi hehe. Lần đầu được tiếp xúc với mi là lần nói chuyện trong box chat của quân đoàn hee, rồii xong rồi rủ chơi gamee rồi từ từ rồi chơi thân chơi chung với nhau rồi lúc đó chơi với gà này với gấu nàyy 4 đứa chắc là thân nhau nhất trong quân đoàn rồi.
            </p>
            <p>
              Rồi cái từ lúc nào Bống cũng không biết nữa cảm giác như bống thích Linh rồi và thật sự là Bống thích Linh lắm ý, nhưng bống không có đủ dũng khí để một lần nói ra những lời trong lòng của mình với mi. Rồi cái cũng đến ngày mi ôn thi thpt rồi lúc ý mi nghỉ game một thời giann dài ơi là dài ý, Bống nhớ là cũng thời điểm đó Bống đã nói ra câu hỏi mà Bống muốn hỏi Linh từ trong lòng bống, ta nhớ ta nói là "Linh ơi trong quãng thời gian qua linh có cảm giác gì với Bống không ?" Mặc dù Bống đã biết đã đoán câu trả lời của linh rồi hehe. Linh trả lời lại bống một từ xúc tích lắm ý là "Không" lúc đấy Bống đơ người một lúc luôn mà hehe.
            </p>
            <p>
              Cái từ lúc đó Bống đã ít nhắn tin với Linh rồi giờ lại càng ít hơn, rồi từ lúc đó đến giờ ta nhớ ngươi lắm, có những lúc ta nhớ ngươi mà ta chỉ giám nhắn gọi là spam đii những buổi tối ta chúc mi ngủ ngon. Nhưng Bống cảm thấy lúc đấy Bống chỉ đang làm phiền Linh thôi rồi cái Bống không giám nhắn cho Linh nữa nhưng lại càng như vậy ta càng thấy nhớ mi à ngươi còn nhớ lúc mà ngươi nhắn với ta qua ghi chú không, thấy Linh nhắn như vậy Bống vui lắm ý hmm thật sự là ta rất rất nhớ giọng ngươi.
            </p>
            <p>
              Linh biết gì không ta viết những lời này không phải để cho Linh cảm thấy thương hại Bống hay là Bống muốn Linh cho Bống một cơ hội hay gì, mà là ta muốn nói ra những lời trong lòng mình cho người mà Bống thích trong xuất quãng thời gian qua biết thôi. Bống biết là mình không là cáii chi để Linh quan tâm hay được phép quan tâm ngươi gì nma ta chỉ muốn ngươi nhớ là đã 7 năm rồi Bống vẫn thích Linh nên hiện tại Bống vẫn luôn muốn nói chuyện với Linh và ta sẽ ở đây chờ ngươii nha.
            </p>

            <Paragraph strong style={{ textAlign: 'center', fontSize: '24px', marginTop: '30px', color: '#d63031' }} className="font-script">
              BỐNG RẤTTT NHỚ GIỌNG LINHH
            </Paragraph>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginTop: '40px',
            height: '60px', 
            position: 'relative' 
          }}>
            {/* Nút Đồng Ý */}
            <Button 
              type="primary" 
              shape="round" 
              size="large" 
              icon={<HeartFilled />}
              onClick={handleAgree}
              style={{ 
                background: 'linear-gradient(45deg, #ff6b6b, #eb2f96)', 
                border: 'none',
                boxShadow: '0 4px 15px rgba(235, 47, 150, 0.4)',
                padding: '0 40px',
                height: '50px',
                fontSize: '18px',
                zIndex: 100
              }}
            >
              Đồng ý
            </Button>

            {/* Nút Không Đồng Ý - Chạy Trốn */}
            <Button 
              danger
              shape="round" 
              size="large"
              ref={noBtnRef}
              onMouseEnter={moveButton} // Cho Desktop
              onTouchStart={moveButton} // Cho Mobile
              onClick={moveButton}      // Phòng hờ
              style={{
                position: isHoveringNo ? 'fixed' : 'static',
                left: isHoveringNo ? noBtnPosition.left : 'auto',
                top: isHoveringNo ? noBtnPosition.top : 'auto',
                transition: 'all 0.2s ease', 
                zIndex: 50,
                minWidth: '120px'
              }}
            >
              Không đồng ý
            </Button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}