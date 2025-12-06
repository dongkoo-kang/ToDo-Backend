import express from 'express';
import Todo from '../models/todo.model.js';

const router = express.Router();

// 모든 할일 조회
router.get('/', async (req, res) => {
  try {
    const { completed, priority } = req.query;
    const filter = {};
    
    // 완료 상태 필터링
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    // 우선순위 필터링
    if (priority) {
      filter.priority = priority;
    }
    
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '할일 목록을 불러오는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 특정 할일 조회
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: '할일을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '할일을 불러오는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 할일 생성
router.post('/', async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '할일 제목은 필수입니다.'
      });
    }
    
    // dueDate를 Date 객체로 변환 (문자열인 경우)
    let dueDateValue = null;
    if (dueDate && dueDate.trim() !== '') {
      dueDateValue = new Date(dueDate);
      // 유효한 날짜인지 확인
      if (isNaN(dueDateValue.getTime())) {
        dueDateValue = null;
      }
    }
    
    const todo = new Todo({
      title: title.trim(),
      priority: priority || 'low',
      dueDate: dueDateValue
    });
    
    const savedTodo = await todo.save();
    
    res.status(201).json({
      success: true,
      message: '할일이 생성되었습니다.',
      data: savedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '할일을 생성하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 할일 수정
router.put('/:id', async (req, res) => {
  try {
    const { title, completed, priority, dueDate } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) {
      // dueDate를 Date 객체로 변환 (문자열인 경우)
      if (dueDate && dueDate.trim() !== '') {
        const dueDateValue = new Date(dueDate);
        // 유효한 날짜인지 확인
        updateData.dueDate = isNaN(dueDateValue.getTime()) ? null : dueDateValue;
      } else {
        updateData.dueDate = null;
      }
    }
    
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: '할일을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      message: '할일이 수정되었습니다.',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '할일을 수정하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 할일 삭제
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: '할일을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      message: '할일이 삭제되었습니다.',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '할일을 삭제하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 할일 완료 상태 토글
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: '할일을 찾을 수 없습니다.'
      });
    }
    
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    
    res.json({
      success: true,
      message: `할일이 ${updatedTodo.completed ? '완료' : '미완료'}로 변경되었습니다.`,
      data: updatedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '할일 상태를 변경하는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

export default router;
