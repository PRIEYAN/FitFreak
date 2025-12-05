# 💪 FitFreak

<div align="center">

**Where Every Rep Counts**

*Transform your workouts into wins. Compete, earn rewards, and build the strongest version of yourself.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?logo=flask)](https://flask.palletsprojects.com/)

</div>

---

## 🌟 Overview

**FitFreak** is a revolutionary blockchain-powered fitness platform that gamifies your workout journey. Earn rewards, compete in live contests, and transform your fitness routine into an engaging, rewarding experience. Built with cutting-edge AI motion tracking, smart contracts, and a beautiful modern interface.

### 🎯 Core Philosophy

We believe fitness should be **fun, rewarding, and social**. FitFreak combines:
- 🤖 **AI-Powered Tracking** - Real-time motion detection with computer vision
- 🏆 **Competitive Contests** - Join live challenges and climb leaderboards  
- 💰 **Crypto Rewards** - Earn tokens for completing workouts and winning contests
- 🎲 **Social Betting** - Bet on live contests and win big
- 📊 **Progress Analytics** - Track your journey with detailed insights

---

## ✨ Key Features

### 🎮 **Gamified Fitness Experience**
- **Personalized Challenges**: AI-generated workout plans tailored to your fitness level
- **Live Contests**: Real-time competitions with instant verification
- **Achievement System**: Unlock badges, level up, and earn rewards
- **Leaderboards**: Compete globally and track your ranking

### 🤖 **Advanced AI Technology**
- **Motion Detection**: MediaPipe-powered real-time exercise tracking
- **Form Analysis**: Get instant feedback on your technique
- **Rep Counting**: Accurate automatic rep detection
- **Progress Tracking**: Detailed analytics and performance metrics

### 💎 **Blockchain Integration**
- **Smart Contracts**: Transparent, trustless reward distribution
- **Crypto Rewards**: Earn tokens for workouts and achievements
- **Stake-to-Win**: Enter contests by staking crypto
- **Decentralized**: Your data, your control

### 🎨 **Modern UI/UX**
- **Light Blue Theme**: Beautiful, professional design
- **Responsive**: Works seamlessly on all devices
- **Smooth Animations**: Polished interactions and transitions
- **Gen Z Ready**: Modern, intuitive interface

---

## 🏗️ Architecture

### **Frontend Stack**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Web3**: ethers.js v6
- **State Management**: Custom React Hooks

### **Backend Stack**
- **Framework**: Flask (Python)
- **AI/ML**: OpenCV + MediaPipe
- **API**: RESTful endpoints
- **Video Processing**: Real-time frame streaming

### **Blockchain**
- **Network**: Citrea Testnet
- **Smart Contracts**: Solidity
- **Web3 Provider**: MetaMask integration
- **Currency**: cBTC (Citrea Bitcoin)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FitFreak.git
   cd FitFreak
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend/flask
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   ```bash
   # Frontend
   cp frontend/env.example frontend/.env
   
   # Backend
   cp backend/.env.example backend/.env
   ```

5. **Run the Application**
   ```bash
   # Use the provided startup script
   chmod +x FitFreak.sh
   ./FitFreak.sh
   ```

   Or manually:
   ```bash
   # Terminal 1 - Backend
   cd backend/flask
   python app.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api
   - Video Feed: http://localhost:5000/video_feed

---

## 📖 Documentation

- **[Integration Guide](INTEGRATION_GUIDE.md)** - Complete setup and integration instructions
- **[API Documentation](frontend/API_DOCUMENTATION.md)** - API endpoint reference
- **[Smart Contract Guide](contract/README.md)** - Blockchain integration details

---

## 🎯 Usage

### For Users

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Join Contest**: Browse available contests and stake crypto to join
3. **Start Workout**: Begin your exercise session with AI tracking
4. **Earn Rewards**: Complete challenges and win prizes
5. **Track Progress**: View analytics and achievements

### For Developers

See the [Integration Guide](INTEGRATION_GUIDE.md) for detailed development instructions.

---

## 🔧 Configuration

### Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_CONTRACT_ADDRESS=0xd43dc5f84320B34149Be4D0602F862DdD61A45CF
VITE_CHAIN_ID=0x1a1
VITE_RPC_URL=https://rpc.testnet.citrea.xyz
```

**Backend** (`backend/.env`):
```env
RPC_URL=https://rpc.testnet.citrea.xyz
CONTRACT_ADDRESS=0xd43dc5f84320B34149Be4D0602F862DdD61A45CF
PORT=3001
FLASK_PORT=5000
```

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend/flask
pytest
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **MediaPipe** - For motion tracking technology
- **OpenCV** - For computer vision capabilities
- **React Team** - For the amazing framework
- **Citrea Network** - For blockchain infrastructure
- **All Contributors** - For making FitFreak better

---

## 📞 Support

- **Documentation**: Check [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/FitFreak/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/FitFreak/discussions)

---

<div align="center">

**Made with 💪 by the FitFreak Team**

[Website](https://fitfreak.io) • [Twitter](https://twitter.com/fitfreak) • [Discord](https://discord.gg/fitfreak)

</div>
