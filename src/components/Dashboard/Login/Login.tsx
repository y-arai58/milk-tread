import React, { useState } from 'react';
import { api } from '../../../services/api';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // ユーザー名に基づいたログイン処理
      await api.login(username, password);
      onLogin();
    } catch (error) {
      console.error('ログインに失敗しました:', error);
      setError('ユーザー名またはパスワードが間違っています');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-form'>
        <h2>保護猫管理システム</h2>
        <h3>ログイン</h3>

        {error && <div className='error-message'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>ユーザー名</label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>パスワード</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type='submit' disabled={isLoading}>
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className='login-help'>
          <p>※ デモ用ログインアカウント:</p>
          <ul>
            <li>管理者: admin / password</li>
            <li>一般ユーザー: user / password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
