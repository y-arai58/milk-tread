import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AdminDashboard } from './Admin/AdminDashboard';
import { UserDashboard } from './User/UserDashboard';
import { Login } from './Login/Login';
import './Dashboard.css';
import { User } from '../../types/type';

// メインダッシュボードコンポーネント
export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    fetchCurrentUser();
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  if (loading) {
    return <div className='loading-spinner'>読み込み中...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // ユーザーの権限に基づいてダッシュボードを表示
  const isAdmin = user.roles && user.roles.includes('administrator');

  return (
    <div className='cat-shelter-app'>
      <header>
        <h1>保護猫管理システム</h1>
        <div className='user-info'>
          <span>ようこそ、{user.name}さん</span>
          <span>({isAdmin ? '管理者' : '一般ユーザー'})</span>
          <button className='logout-btn' onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      {isAdmin ? <AdminDashboard user={user} /> : <UserDashboard user={user} />}
    </div>
  );
};
