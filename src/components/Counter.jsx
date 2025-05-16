import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Contador: {count}</h2>
      <div className="space-x-4">
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Incrementar
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Decrementar
        </button>
      </div>
    </div>
  );
} 