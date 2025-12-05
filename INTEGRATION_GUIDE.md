# 🚀 FitFreak Integration & Development Guide

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Web3 Integration](#web3-integration)
7. [AI Motion Tracking](#ai-motion-tracking)
8. [Development Workflow](#development-workflow)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

**FitFreak** is a full-stack fitness platform combining:
- **Frontend**: Modern React application with TypeScript
- **Backend**: Flask API server with AI motion tracking
- **Blockchain**: Smart contracts on Citrea Testnet
- **AI/ML**: Real-time exercise detection using MediaPipe

### Key Components

| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| Frontend | React + Vite | 5173 | User interface |
| Backend API | Node.js/Express | 3001 | Contest management |
| Flask Server | Python Flask | 5000 | Video processing |
| Blockchain | Citrea Testnet | - | Smart contracts |

---

## 🏗️ Architecture

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom React hooks
│   ├── api/            # API client functions
│   ├── config/         # Configuration files
│   └── App.tsx         # Main application
```

**Key Technologies:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- ethers.js v6 for Web3

### Backend Architecture

```
backend/
├── flask/
│   ├── app.py          # Main Flask application
│   ├── main.py         # Entry point
│   ├── utils.py        # Utility functions
│   └── templates/      # HTML templates
└── server.js           # Node.js API server
```

**Key Technologies:**
- Flask for video streaming
- OpenCV + MediaPipe for motion tracking
- Node.js/Express for REST API
- Web3.js for blockchain interaction

---

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **MetaMask** browser extension
- **Git**

### Step-by-Step Installation

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/FitFreak.git
cd FitFreak
```

#### 2. Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

#### 3. Backend Setup

```bash
cd backend/flask

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

#### 4. Quick Start Script

```bash
# Make script executable
chmod +x FitFreak.sh

# Run the application
./FitFreak.sh
```

---

## ⚙️ Configuration

### Frontend Environment Variables

Create `frontend/.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Blockchain Configuration
VITE_CONTRACT_ADDRESS=0xd43dc5f84320B34149Be4D0602F862DdD61A45CF
VITE_CHAIN_ID=0x1a1
VITE_RPC_URL=https://rpc.testnet.citrea.xyz

# Debug Mode
VITE_DEBUG=true
```

### Backend Environment Variables

Create `backend/.env`:

```env
# Flask Configuration
FLASK_PORT=5000
FLASK_DEBUG=True

# Node.js API Configuration
PORT=3001
NODE_ENV=development

# Blockchain Configuration
RPC_URL=https://rpc.testnet.citrea.xyz
CONTRACT_ADDRESS=0xd43dc5f84320B34149Be4D0602F862DdD61A45CF
ADMIN_PRIVATE_KEY=your_admin_private_key_here

# Network Configuration
CHAIN_ID=5115
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
```http
GET /api
```

**Response:**
```json
{
  "status": "ok",
  "message": "FitFreak API is running"
}
```

#### Get All Contests
```http
GET /api/contests
```

**Response:**
```json
{
  "contests": [
    {
      "id": 0,
      "name": "Squat Challenge",
      "stakeAmount": "100000000000000000",
      "startTime": "1696000000",
      "endTime": "1696086400",
      "maxParticipants": 100,
      "minParticipants": 5,
      "participantCount": 23,
      "rewardsDistributed": false
    }
  ],
  "total": "1"
}
```

#### Get Contest by ID
```http
GET /api/contests/:id
```

#### Check Join Status
```http
GET /api/contests/:id/joined/:userAddress
```

#### Create Contest (Admin)
```http
POST /api/contests/create
Content-Type: application/json

{
  "name": "Push-up Challenge",
  "stakeAmount": "100000000000000000",
  "startTime": 1696000000,
  "endTime": 1696086400,
  "maxParticipants": 100,
  "minParticipants": 5
}
```

#### Distribute Rewards (Admin)
```http
POST /api/contests/distribute
Content-Type: application/json

{
  "contestId": 0
}
```

---

## 🔗 Web3 Integration

### Network Configuration

**Citrea Testnet:**
- Chain ID: `0x13fb` (5115 decimal)
- Currency: CBTC (Citrea Bitcoin)
- RPC URL: `https://rpc.testnet.citrea.xyz`
- Block Explorer: `https://explorer.testnet.citrea.xyz`

### MetaMask Setup

1. **Add Network to MetaMask:**
   - Network Name: Citrea Testnet
   - RPC URL: `https://rpc.testnet.citrea.xyz`
   - Chain ID: `5115`
   - Currency Symbol: `CBTC`

2. **Get Test Tokens:**
   - Visit Citrea faucet
   - Request testnet CBTC

### Smart Contract Integration

```javascript
import { ethers } from 'ethers';

// Connect to MetaMask
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Contract instance
const contractAddress = '0xd43dc5f84320B34149Be4D0602F862DdD61A45CF';
const contractABI = [...]; // Your ABI
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Join contest
const stakeAmount = ethers.parseEther('0.1');
const tx = await contract.joinContest(contestId, {
  value: stakeAmount,
  gasLimit: 300000
});

await tx.wait();
```

---

## 🤖 AI Motion Tracking

### MediaPipe Integration

The Flask backend uses MediaPipe for real-time exercise detection:

```python
import cv2
import mediapipe as mp

# Initialize MediaPipe
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Process video frame
results = pose.process(frame)
landmarks = results.pose_landmarks
```

### Exercise Detection Flow

1. **Video Capture**: Webcam feed via Flask
2. **Frame Processing**: OpenCV processes each frame
3. **Pose Estimation**: MediaPipe detects body landmarks
4. **Rep Counting**: Algorithm counts exercise repetitions
5. **Stream Response**: Results sent to frontend

### Supported Exercises

- Squats
- Push-ups
- Pull-ups
- Planks
- More exercises coming soon

---

## 💻 Development Workflow

### Running Development Servers

**Option 1: Using FitFreak.sh**
```bash
./FitFreak.sh
```

**Option 2: Manual Start**

Terminal 1 - Flask Backend:
```bash
cd backend/flask
source venv/bin/activate
python app.py
```

Terminal 2 - Node.js API:
```bash
cd frontend
node server.js
```

Terminal 3 - React Frontend:
```bash
cd frontend
npm run dev
```

### Code Structure

**Frontend Components:**
```typescript
// Example component structure
interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // Component logic
  return <div>...</div>;
};
```

**Backend Routes:**
```python
@app.route('/api/endpoint', methods=['GET'])
def endpoint():
    # Route logic
    return jsonify({...})
```

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend/flask
pytest
```

### Manual Testing Checklist

- [ ] MetaMask connection works
- [ ] Network switching functions correctly
- [ ] Contest data loads from API
- [ ] Join contest transaction succeeds
- [ ] Video feed displays correctly
- [ ] Exercise detection works
- [ ] Rep counting is accurate

---

## 🚀 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy dist/ folder to hosting service
```

### Backend Deployment

```bash
# Set production environment variables
export NODE_ENV=production
export RPC_URL=your_production_rpc

# Start production server
node server.js
```

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. MetaMask Not Connecting
- **Solution**: Check browser extension is installed and enabled
- **Debug**: Open browser console for error messages

#### 2. Wrong Network
- **Solution**: Use FitFreak.sh to auto-switch networks
- **Manual**: Switch to Citrea Testnet in MetaMask

#### 3. API Connection Failed
- **Solution**: Verify backend server is running on port 3001
- **Check**: `curl http://localhost:3001/api`

#### 4. Video Feed Not Loading
- **Solution**: Ensure Flask server is running on port 5000
- **Check**: Camera permissions in browser

#### 5. Transaction Fails
- **Solution**: Verify sufficient CBTC balance
- **Check**: Gas limit and network connection

### Debug Mode

Enable debug mode in `.env`:
```env
VITE_DEBUG=true
FLASK_DEBUG=True
```

This enables:
- Detailed console logging
- Error stack traces
- API request/response logging

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [MediaPipe Guide](https://google.github.io/mediapipe/)
- [ethers.js Documentation](https://docs.ethers.org)
- [Citrea Network Docs](https://docs.citrea.xyz)

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/FitFreak/issues)
- **Documentation**: Check this guide
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/FitFreak/discussions)

---

**Happy Coding! 💪**
