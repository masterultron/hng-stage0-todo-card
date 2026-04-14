import React from 'react';
import TodoCard from './TodoCard';

function App() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">HNG Stage 1A</h1>
          <p className="mt-2 text-sm text-slate-600">Advanced Stateful Todo Component</p>
        </header>
        
        {/* Render your component here */}
        <TodoCard />
        
      </div>
    </main>
  );
}

export default App;