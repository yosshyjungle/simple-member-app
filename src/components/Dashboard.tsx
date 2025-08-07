import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleCreateBoard = () => {
    // 現段階では機能を実装せず、UIのみ
    console.log('新規ボード作成ボタンがクリックされました');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">ボード一覧</h1>
            <div className="user-info">
              <span className="welcome-text">
                こんにちは、<strong>{user?.nickname}</strong>さん
              </span>
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                ログアウト
              </button>
            </div>
          </div>
        </header>
        
        <main className="dashboard-main">
          <div className="dashboard-actions">
            <button 
              className="create-board-btn"
              onClick={handleCreateBoard}
            >
              <svg className="plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              新規ボード作成
            </button>
          </div>
          
          <div className="boards-grid">
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>まだボードがありません</h3>
              <p>「新規ボード作成」ボタンから最初のボードを作成しましょう</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
