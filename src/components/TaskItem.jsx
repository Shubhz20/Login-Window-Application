import { CheckCircle2, Circle, Trash2 } from 'lucide-react';

function TaskItem({ task, onToggle, onDelete }) {
  const isCompleted = task.status === 'Completed';

  return (
    <div className={`flex items-center justify-between p-4 border rounded ${isCompleted ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className="text-gray-500 hover:text-blue-600">
          {isCompleted ? <CheckCircle2 className="text-green-500" /> : <Circle />}
        </button>
        <span className={`text-lg ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {task.title}
        </span>
      </div>
      <button onClick={onDelete} className="text-gray-400 hover:text-red-600">
        <Trash2 size={20} />
      </button>
    </div>
  );
}

export default TaskItem;
