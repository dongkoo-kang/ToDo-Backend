import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '할일 제목은 필수입니다.'],
    trim: true,
    maxlength: [200, '제목은 200자 이하여야 합니다.']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  dueDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  versionKey: false // __v 필드 제거
});

// 인덱스 설정 (검색 성능 향상)
todoSchema.index({ createdAt: -1 });
todoSchema.index({ completed: 1 });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
