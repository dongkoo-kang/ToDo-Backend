import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import todoRoutes from './routes/todo.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경변수 파일 로드 (현재 디렉토리의 .env 파일)
dotenv.config({ path: join(__dirname, '.env') });

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
app.use('/todos', todoRoutes); // /todos 경로도 지원

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo';

// 환경변수 로드 확인
if (!process.env.MONGODB_URI) {
  console.warn('경고: MONGODB_URI 환경변수가 설정되지 않았습니다. 기본값을 사용합니다.');
} else {
  console.log('MONGODB_URI 환경변수 로드 완료');
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
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

