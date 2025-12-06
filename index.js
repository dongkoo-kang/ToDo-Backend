import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import todoRoutes from './routes/todo.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'ToDo Backend API Server is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Todo 라우트
app.use('/api/todos', todoRoutes);

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    // MongoDB 서버 버전 정보 가져오기
    const admin = mongoose.connection.db.admin();
    const serverInfo = await admin.serverStatus();
    const mongoVersion = serverInfo.version;
    const nodeVersion = process.version;
    
    console.log('연결 성공');
    console.log(`MongoDB 버전: ${mongoVersion}`);
    console.log(`Node.js 버전: ${nodeVersion}`);
    
    // MongoDB 연결 성공 후 서버 시작
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  });

