import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Application, Cat, User } from '../../../types/type';
import './UserDashboard.css';
import '../Common/CatCard.css';
import '../Common/ApplicationCard.css';
import '../Common/Modal.css';

// ユーザー（消費者）ダッシュボードコンポーネント
export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [availableCats, setAvailableCats] = useState<Cat[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [applicationMessage, setApplicationMessage] = useState('');

  useEffect(() => {
    fetchAvailableCats();
    fetchMyApplications();
  }, []);

  const fetchAvailableCats = async () => {
    try {
      const data = await api.getCats('available');
      setAvailableCats(data);
    } catch (error) {
      console.error('利用可能な猫データの取得に失敗しました:', error);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const data = await api.getApplications(user.id);
      // 日付の降順（新しい順）でソート
      const sortedData = [...data].sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      setMyApplications(sortedData);
    } catch (error) {
      console.error('申請データの取得に失敗しました:', error);
    }
  };

  const handleApplyForAdoption = async (catId: number) => {
    try {
      await api.submitApplication(catId, applicationMessage);
      alert('保護申請を送信しました');
      setSelectedCat(null);
      setApplicationMessage('');
      fetchAvailableCats();
      fetchMyApplications();
    } catch (error) {
      console.error('申請の送信に失敗しました:', error);
    }
  };

  return (
    <div className='consumer-dashboard'>
      <h2>保護猫を探す</h2>

      {/* 利用可能な保護猫一覧 */}
      <div className='available-cats'>
        <h3>保護を待っている猫たち</h3>
        <div className='cats-grid'>
          {availableCats.map((cat) => (
            <div key={cat.id} className='cat-card'>
              {cat.image && <img src={cat.image} alt={cat.name} />}
              <h4>{cat.name}</h4>
              <p>年齢: {cat.age}歳</p>
              <p>品種: {cat.breed}</p>
              <p>説明: {cat.description}</p>
              <p>健康状態: {cat.health_status}</p>
              <button onClick={() => setSelectedCat(cat)} className='apply-btn'>
                この子を保護したい
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 申請フォームモーダル */}
      {selectedCat && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h3>{selectedCat.name}の保護申請</h3>
            <textarea
              className='modal-application-message'
              placeholder='申請理由やメッセージをお書きください'
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              rows={5}
            />
            <div className='modal-actions'>
              <button
                onClick={() => handleApplyForAdoption(selectedCat.id)}
                className='submit-btn'
              >
                申請を送信
              </button>
              <button
                onClick={() => setSelectedCat(null)}
                className='cancel-btn'
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 自分の申請状況 */}
      <div className='my-applications'>
        <h3>私の申請状況</h3>
        <div className='applications-list'>
          {myApplications.map((app) => (
            <div key={app.id} className='application-card'>
              <h4>{app.cat_name}</h4>
              <p>申請日: {new Date(app.created_at).toLocaleDateString()}</p>
              <p>
                ステータス:
                <span className={`status ${app.status}`}>
                  {app.status === 'pending'
                    ? '審査中'
                    : app.status === 'approved'
                    ? '承認済み'
                    : '却下'}
                </span>
              </p>
              <p>メッセージ: {app.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
