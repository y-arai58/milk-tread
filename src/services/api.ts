import { User, Cat, Application } from '../types/type';
import { mockCats, mockApplications, mockUsers } from './mockData';
import { storageService } from './storage';

// 開発環境かどうかを判断する
const isDevelopment = process.env.NODE_ENV === 'development';
// モックAPIを使用するかどうかのフラグ
const useMockApi = isDevelopment;

// アプリケーション初期化時にモックデータをストレージに設定
if (useMockApi) {
  storageService.initializeStorage(mockCats, mockApplications);
}

// APIクライアントの実装
export const api = {
  // ログイン処理
  login: async (username: string, password: string): Promise<User> => {
    if (useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延をシミュレート

      // 簡易的なログイン処理
      let user: User | null = null;
      if (username === 'admin') {
        user = { ...mockUsers[0] }; // 管理者
      } else if (username === 'user') {
        user = { ...mockUsers[1] }; // 一般ユーザー
      } else {
        throw new Error('Invalid credentials');
      }

      // ログイン情報を保存
      storageService.saveUser(user);
      return user;
    } else {
      const response = await fetch('/wp-json/cat-shelter/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // ログイン情報を保存
      storageService.saveUser(data.user);
      return data.user;
    }
  },

  // ログアウト処理
  logout: async (): Promise<void> => {
    if (useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延をシミュレート
      // ユーザー情報をクリア
      storageService.saveUser(null);
    } else {
      await fetch('/wp-json/cat-shelter/v1/logout', {
        method: 'POST',
        credentials: 'include',
      });
      // ユーザー情報をクリア
      storageService.saveUser(null);
    }
  },

  // 猫データの取得
  getCats: async (status?: string): Promise<Cat[]> => {
    if (useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延をシミュレート

      // ストレージから猫データを取得
      const cats = storageService.getCats();

      if (status) {
        return cats.filter((cat) => cat.status === status);
      }
      return [...cats];
    } else {
      const url = status
        ? `/wp-json/cat-shelter/v1/cats?status=${status}`
        : '/wp-json/cat-shelter/v1/cats';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch cats');
      }
      return response.json();
    }
  },

  // 猫データの追加
  addCat: async (catData: FormData): Promise<Cat> => {
    if (useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延をシミュレート

      // FormDataから猫のデータを取得
      const name = catData.get('name') as string;
      const age = parseInt(catData.get('age') as string);
      const breed = catData.get('breed') as string;
      const description = catData.get('description') as string;
      const health_status = catData.get('health_status') as string;
      const imageFile = catData.get('image') as File | null;

      // 画像の処理
      let imageUrl = null;
      if (imageFile) {
        // モック環境では、画像をBase64文字列に変換
        imageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      } else {
        // デフォルトの猫画像を使用
        imageUrl = 'https://placekitten.com/404/304';
      }

      // 現在のデータを取得
      const cats = storageService.getCats();

      // 新しい猫を作成
      const newCat: Cat = {
        id: cats.length > 0 ? Math.max(...cats.map((c) => c.id)) + 1 : 1,
        name,
        age,
        breed,
        description,
        health_status,
        status: 'available',
        image: imageUrl,
      };

      // 新しい猫をリストに追加して保存
      cats.push(newCat);
      storageService.saveCats(cats);

      return newCat;
    } else {
      const response = await fetch('/wp-json/cat-shelter/v1/cats', {
        method: 'POST',
        body: catData,
        headers: {
          'X-WP-Nonce': (window as any).wpApiSettings?.nonce,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add cat');
      }

      return response.json();
    }
  },

  // 申請データの取得
  getApplications: async (userId?: number): Promise<Application[]> => {
    if (useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延をシミュレート

      // ストレージから申請データを取得
      const applications = storageService.getApplications();

      if (userId) {
        return applications.filter((app) => app.user_id === userId);
      }
      return [...applications];
    } else {
      const url = userId
        ? `/wp-json/cat-shelter/v1/applications?user_id=${userId}`
        : '/wp-json/cat-shelter/v1/applications';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      return response.json();
    }
  },

  // 申請の送信
  submitApplication: async (
    catId: number,
    message: string
  ): Promise<Application> => {
    if (useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延をシミュレート

      // 現在のログインユーザー情報を取得
      const currentUser = storageService.getUser();
      if (!currentUser) {
        throw new Error('User not logged in');
      }

      // 猫データを取得
      const cats = storageService.getCats();
      const cat = cats.find((c) => c.id === catId);
      if (!cat) {
        throw new Error('Cat not found');
      }

      // 申請データを取得
      const applications = storageService.getApplications();

      // 新しい申請を作成
      const newApplication: Application = {
        id:
          applications.length > 0
            ? Math.max(...applications.map((a) => a.id)) + 1
            : 1,
        cat_id: catId,
        cat_name: cat.name,
        user_id: currentUser.id,
        user_name: currentUser.name,
        message,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // 新しい申請をリストに追加して保存
      applications.push(newApplication);
      storageService.saveApplications(applications);

      return newApplication;
    } else {
      const response = await fetch('/wp-json/cat-shelter/v1/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': (window as any).wpApiSettings?.nonce,
        },
        body: JSON.stringify({ cat_id: catId, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      return response.json();
    }
  },

  // 申請ステータスの更新
  updateApplicationStatus: async (
    applicationId: number,
    status: 'approved' | 'rejected'
  ): Promise<Application> => {
    if (useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延をシミュレート

      // 申請データと猫データを取得
      const applications = storageService.getApplications();
      const cats = storageService.getCats();

      const applicationIndex = applications.findIndex(
        (app) => app.id === applicationId
      );
      if (applicationIndex === -1) {
        throw new Error('Application not found');
      }

      // 申請ステータスを更新
      applications[applicationIndex].status = status;

      // 承認の場合は猫のステータスも変更
      if (status === 'approved') {
        const catId = applications[applicationIndex].cat_id;
        const catIndex = cats.findIndex((cat) => cat.id === catId);
        if (catIndex !== -1) {
          cats[catIndex].status = 'adopted';
          // 猫データを保存
          storageService.saveCats(cats);
        }
      }

      // 申請データを保存
      storageService.saveApplications(applications);

      return applications[applicationIndex];
    } else {
      const response = await fetch(
        `/wp-json/cat-shelter/v1/applications/${applicationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': (window as any).wpApiSettings?.nonce,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${status} application`);
      }

      return response.json();
    }
  },

  // 現在のユーザー情報の取得
  getCurrentUser: async (): Promise<User | null> => {
    if (useMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延をシミュレート
      // ストレージからユーザー情報を取得
      return storageService.getUser();
    } else {
      try {
        const response = await fetch('/wp-json/wp/v2/users/me', {
          headers: {
            'X-WP-Nonce': (window as any).wpApiSettings?.nonce,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            return null; // 未ログイン
          }
          throw new Error('Failed to fetch user');
        }

        const user = await response.json();
        // 取得したユーザー情報を保存
        storageService.saveUser(user);
        return user;
      } catch (error) {
        console.error('User fetch error:', error);
        return null;
      }
    }
  },
};
