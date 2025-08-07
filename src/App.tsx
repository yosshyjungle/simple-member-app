import React from 'react';
import './App.css';

function App() {
  const handleCreateBoard = () => {
    // 現段階では機能を実装せず、UIのみ
    console.log('新規ボード作成ボタンがクリックされました');
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1 className="page-title">ボード一覧</h1>
        </header>
        <main className="main-content">
          <button 
            className="create-board-btn"
            onClick={handleCreateBoard}
          >
            新規ボード作成
          </button>
          <div className="boards-grid">
            {/* 現段階ではボードの表示はなし */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
