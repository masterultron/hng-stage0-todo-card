import React, { useState, useEffect, useRef } from 'react';

const TodoCard = () => {
  // --- 1. CORE DATA STATE ---
  const [todo, setTodo] = useState({
    title: "Implement Stage 1a State Logic",
    description: "Refactor the vanilla JavaScript implementation into a fully stateful React component. Ensure all status controls are synchronized and the dynamic time interval handles overdue states gracefully without memory leaks.",
    priority: "High",
    status: "Pending", // "Pending", "In Progress", or "Done"
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), // 2 days from now
    tags: ["react", "state", "urgent"]
  });

  // --- 2. UI STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(todo); 
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [timeText, setTimeText] = useState("Calculating...");
  const [isOverdue, setIsOverdue] = useState(false);

  const editButtonRef = useRef(null); 

  // --- 3. TIME MANAGEMENT LOGIC ---
  useEffect(() => {
    const updateTimer = () => {
      if (todo.status === "Done") {
        setTimeText("Completed");
        setIsOverdue(false);
        return;
      }

      const now = Date.now();
      const target = new Date(todo.dueDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsOverdue(true);
        const hoursOver = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
        setTimeText(`Overdue by ${hoursOver} hour${hoursOver !== 1 ? 's' : ''}`);
        return;
      }

      setIsOverdue(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      if (days > 0) {
        setTimeText(`Due in ${days} day${days > 1 ? 's' : ''}`);
      } else if (hours > 0) {
        setTimeText(`Due in ${hours} hour${hours > 1 ? 's' : ''}`);
      } else {
        setTimeText(`Due in ${minutes} minute${minutes !== 1 ? 's' : ''}`);
      }
    };

    updateTimer(); 
    const interval = setInterval(updateTimer, 30000); 
    return () => clearInterval(interval); 
  }, [todo.dueDate, todo.status]);

  // --- 4. HANDLERS ---
  const handleStatusChange = (newStatus) => {
    setTodo(prev => ({ ...prev, status: newStatus }));
  };

  const handleCheckboxToggle = () => {
    const newStatus = todo.status === "Done" ? "Pending" : "Done";
    handleStatusChange(newStatus);
  };

  const startEditing = () => {
    setEditForm(todo); 
    setIsEditing(true);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setTodo(editForm);
    setIsEditing(false);
    setTimeout(() => editButtonRef.current?.focus(), 0); 
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTimeout(() => editButtonRef.current?.focus(), 0);
  };

  const priorityColors = {
    Low: "bg-slate-200",
    Medium: "bg-yellow-400",
    High: "bg-red-500"
  };

  // ==========================================
  // RENDER: EDIT MODE
  // ==========================================
  if (isEditing) {
    return (
      <form data-testid="test-todo-edit-form" onSubmit={saveEdit} className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-4">
        <h3 className="font-bold text-lg border-b pb-2 text-slate-800">Edit Task</h3>
        
        <div>
          <label htmlFor="title-input" className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
          <input id="title-input" required data-testid="test-todo-edit-title-input" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div>
          <label htmlFor="desc-input" className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea id="desc-input" required data-testid="test-todo-edit-description-input" rows="3" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="priority-input" className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
            <select id="priority-input" data-testid="test-todo-edit-priority-select" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})} className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="date-input" className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
            <input id="date-input" required type="datetime-local" data-testid="test-todo-edit-due-date-input" value={editForm.dueDate} onChange={e => setEditForm({...editForm, dueDate: e.target.value})} className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button type="button" data-testid="test-todo-cancel-button" onClick={cancelEdit} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded transition-colors">Cancel</button>
          <button type="submit" data-testid="test-todo-save-button" className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition-colors">Save Changes</button>
        </div>
      </form>
    );
  }

  // ==========================================
  // RENDER: DISPLAY MODE
  // ==========================================
  return (
    <article data-testid="test-todo-card" className={`w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-200 relative overflow-hidden transition-all ${todo.status === 'Done' ? 'opacity-75 bg-slate-50' : ''}`}>
      
      {/* Priority Indicator */}
      <div data-testid="test-todo-priority-indicator" className={`absolute left-0 top-0 w-1.5 h-full ${priorityColors[todo.priority]}`} />
      
      {/* Header Area */}
      <div className="flex justify-between items-start mb-3 pl-3">
        <div>
          <h3 data-testid="test-todo-title" className={`text-xl font-bold text-slate-800 ${todo.status === 'Done' ? 'line-through text-slate-400' : ''}`}>
            {todo.title}
          </h3>
          <span data-testid="test-todo-status" className={`text-xs font-bold uppercase px-2 py-0.5 rounded mt-1 inline-block ${todo.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
            {todo.status}
          </span>
          <span data-testid="test-todo-priority" className="text-xs font-semibold text-slate-500 ml-2">
            Priority: {todo.priority}
          </span>
        </div>

        <div className="flex gap-2 shrink-0">
          <button ref={editButtonRef} data-testid="test-todo-edit-button" onClick={startEditing} className="text-slate-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1" aria-label="Edit Task">
            ✏️
          </button>
          <button data-testid="test-todo-delete-button" onClick={() => alert("Delete trigger")} className="text-slate-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1" aria-label="Delete Task">
            🗑️
          </button>
        </div>
      </div>

      {/* Description & Expand Toggle */}
      <div className="my-4 pl-3">
        <div id="desc-container" data-testid="test-todo-collapsible-section" className={`text-slate-600 text-sm overflow-hidden transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
          <p data-testid="test-todo-description">{todo.description}</p>
        </div>
        
        {todo.description.length > 90 && (
          <button 
            data-testid="test-todo-expand-toggle" 
            aria-expanded={isExpanded} 
            aria-controls="desc-container"
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-xs font-bold text-indigo-600 hover:underline mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
          >
            {isExpanded ? "Collapse" : "Read Full Description"}
          </button>
        )}
      </div>

      {/* Time & Dates */}
      <div className="mb-4 pl-3 bg-slate-50 p-3 rounded border border-slate-100">
        <time data-testid="test-todo-due-date" dateTime={todo.dueDate} className="text-xs font-medium text-slate-500 block mb-1">
          Due: {new Date(todo.dueDate).toLocaleString()}
        </time>
        <div className="flex items-center gap-2">
          <span data-testid="test-todo-time-remaining" aria-live="polite" className={`text-sm font-bold ${isOverdue && todo.status !== "Done" ? 'text-red-600' : 'text-indigo-600'}`}>
            {timeText}
          </span>
          {isOverdue && todo.status !== "Done" && (
            <span data-testid="test-todo-overdue-indicator" className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-bold uppercase animate-pulse">Overdue</span>
          )}
        </div>
      </div>

      {/* Status Controls (Footer) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-200 pl-3 gap-3">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            data-testid="test-todo-complete-toggle" 
            checked={todo.status === "Done"} 
            onChange={handleCheckboxToggle} 
            className="w-5 h-5 accent-indigo-600 cursor-pointer focus:ring-2 focus:ring-indigo-500 rounded"
            aria-label="Toggle task completion"
          />
          <span className="text-sm font-medium text-slate-700 select-none group-hover:text-indigo-600 transition-colors">Mark Done</span>
        </label>
        
        <select 
          data-testid="test-todo-status-control" 
          aria-label="Change Status"
          value={todo.status} 
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-sm border-slate-300 rounded-md py-1.5 px-3 border bg-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm font-medium text-slate-700"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Tags */}
      <ul data-testid="test-todo-tags" role="list" className="flex flex-wrap gap-2 mt-4 pl-3">
        {todo.tags.map(tag => (
          <li key={tag} data-testid={`test-todo-tag-${tag}`} className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
            #{tag}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default TodoCard;