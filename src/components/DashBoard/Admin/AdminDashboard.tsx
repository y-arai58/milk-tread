import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { User, Cat, Application } from '../../../types/type';
import {
  formatApplicationStatus,
  formatCatStatus,
} from '../../../utils/formatter';
import './AdminDashboard.css';
import '../Common/CatCard.css';
import '../Common/ApplicationCard.css';
import './AddCatForm.css';

// 管理者ダッシュボードコンポーネント
export const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [newCat, setNewCat] = useState({
    name: '',
    age: '',
    breed: '',
    description: '',
    health_status: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchCats();
    fetchApplications();
  }, []);

  const fetchCats = async () => {
    try {
      const data = await api.getCats();
      setCats(data);
    } catch (error) {
      console.error('猫データの取得に失敗しました:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await api.getApplications();
      // 日付の降順（新しい順）でソート
      const sortedData = [...data].sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      setApplications(sortedData);
    } catch (error) {
      console.error('申請データの取得に失敗しました:', error);
    }
  };

  const handleAddCat = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newCat).forEach((key) => {
      const value = newCat[key as keyof typeof newCat];
      if (key === 'image') {
        if (value) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      await api.addCat(formData);
      alert('保護猫を追加しました');
      fetchCats();
      setNewCat({
        name: '',
        age: '',
        breed: '',
        description: '',
        health_status: '',
        image: null,
      });
    } catch (error) {
      console.error('猫の追加に失敗しました:', error);
    }
  };

  const handleApproveApplication = async (applicationId: number) => {
    try {
      await api.updateApplicationStatus(applicationId, 'approved');
      alert('申請を承認しました');
      fetchApplications();
      fetchCats();
    } catch (error) {
      console.error('申請の承認に失敗しました:', error);
    }
  };

  const handleRejectApplication = async (applicationId: number) => {
    try {
      await api.updateApplicationStatus(applicationId, 'rejected');
      alert('申請を却下しました');
      fetchApplications();
    } catch (error) {
      console.error('申請の却下に失敗しました:', error);
    }
  };

  return (
    <div className='admin-dashboard'>
      <h2>管理者ダッシュボード</h2>

      {/* 新しい保護猫追加フォーム */}
      <div className='add-cat-section'>
        <h3>新しい保護猫を追加</h3>
        <form onSubmit={handleAddCat}>
          <input
            type='text'
            placeholder='猫の名前'
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            required
          />
          <input
            type='number'
            placeholder='年齢'
            value={newCat.age}
            onChange={(e) => setNewCat({ ...newCat, age: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='品種'
            value={newCat.breed}
            onChange={(e) => setNewCat({ ...newCat, breed: e.target.value })}
            required
          />
          <textarea
            placeholder='説明'
            value={newCat.description}
            onChange={(e) =>
              setNewCat({ ...newCat, description: e.target.value })
            }
            required
          />
          <select
            className='add-cat-health-status'
            value={newCat.health_status}
            onChange={(e) =>
              setNewCat({ ...newCat, health_status: e.target.value })
            }
            required
          >
            <option value=''>健康状態を選択</option>
            <option value='健康'>健康</option>
            <option value='治療中'>治療中</option>
            <option value='要観察'>要観察</option>
          </select>
          <input
            type='file'
            accept='image/*'
            onChange={(e) =>
              setNewCat({
                ...newCat,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
          />
          <button className='add-cat-button' type='submit'>
            保護猫を追加
          </button>
        </form>
      </div>

      {/* 保護猫一覧 */}
      <div className='cats-list'>
        <h3>保護猫一覧</h3>
        <div className='cats-grid'>
          {cats.map((cat) => (
            <div key={cat.id} className='cat-card'>
              {cat.image && <img src={cat.image} alt={cat.name} />}
              <h4>{cat.name}</h4>
              <p>年齢: {cat.age}歳</p>
              <p>品種: {cat.breed}</p>
              <p>ステータス: {formatCatStatus(cat.status)}</p>
              <p>健康状態: {cat.health_status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 申請管理 */}
      <div className='applications-section'>
        <h3>保護申請管理</h3>
        <div className='applications-list'>
          {applications.map((app) => (
            <div key={app.id} className='application-card'>
              <h4>申請ID: {app.id}</h4>
              <p>申請者: {app.user_name}</p>
              <p>猫: {app.cat_name}</p>
              <p>メッセージ: {app.message}</p>
              <p>ステータス: {formatApplicationStatus(app.status)}</p>
              <p>申請日: {new Date(app.created_at).toLocaleDateString()}</p>
              {app.status === 'pending' && (
                <div className='application-actions'>
                  <button
                    onClick={() => handleApproveApplication(app.id)}
                    className='approve-btn'
                  >
                    承認
                  </button>
                  <button
                    onClick={() => handleRejectApplication(app.id)}
                    className='reject-btn'
                  >
                    却下
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
