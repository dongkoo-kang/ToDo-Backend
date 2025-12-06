# ToDo Backend

ToDo 애플리케이션을 위한 백엔드 API 서버입니다.

## 기술 스택

- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- dotenv

## 설치 방법

```bash
npm install
```

## 실행 방법

### 프로덕션 모드
```bash
npm start
```

### 개발 모드 (자동 재시작)
```bash
npm run dev
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### 기본 엔드포인트
- `GET /` - 서버 상태 확인
- `GET /health` - 헬스 체크

### Todo API 엔드포인트

#### 할일 조회
- `GET /api/todos` - 모든 할일 조회
  - Query Parameters:
    - `completed` (boolean, optional): 완료 상태 필터링
    - `priority` (string, optional): 우선순위 필터링 (low, medium, high)
  - 예시: `GET /api/todos?completed=false&priority=high`

- `GET /api/todos/:id` - 특정 할일 조회

#### 할일 생성
- `POST /api/todos` - 새로운 할일 생성
  - Request Body:
    ```json
    {
      "title": "할일 제목 (필수)",
      "description": "할일 설명 (선택)",
      "priority": "low|medium|high (선택, 기본값: medium)"
    }
    ```

#### 할일 수정
- `PUT /api/todos/:id` - 할일 수정
  - Request Body:
    ```json
    {
      "title": "수정할 제목 (선택)",
      "description": "수정할 설명 (선택)",
      "completed": true/false (선택),
      "priority": "low|medium|high (선택)"
    }
    ```

#### 할일 삭제
- `DELETE /api/todos/:id` - 할일 삭제

#### 할일 완료 상태 토글
- `PATCH /api/todos/:id/toggle` - 완료/미완료 상태 전환

## 환경 변수

`.env` 파일을 생성하여 다음 변수를 설정할 수 있습니다:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todo
```

MongoDB 연결 URI를 설정하지 않으면 기본값(`mongodb://localhost:27017/todo`)이 사용됩니다.

## 프로젝트 구조

```
ToDo-Backend/
├── models/
│   └── todo.model.js    # Todo 데이터 모델
├── routes/
│   └── todo.routes.js   # Todo API 라우트
├── index.js             # 메인 서버 파일
├── package.json         # 프로젝트 설정 및 의존성
├── .gitignore           # Git 제외 파일 목록
└── README.md            # 프로젝트 문서
```

## 데이터 모델

### Todo 스키마
- `title` (String, 필수): 할일 제목 (최대 200자)
- `description` (String, 선택): 할일 설명 (최대 1000자)
- `completed` (Boolean, 기본값: false): 완료 여부
- `priority` (String, 기본값: 'medium'): 우선순위 (low, medium, high)
- `createdAt` (Date, 자동): 생성 날짜
- `updatedAt` (Date, 자동): 수정 날짜

