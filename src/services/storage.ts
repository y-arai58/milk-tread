import { User, Cat, Application } from '../types/type';

// ストレージキーの定義
const STORAGE_KEYS = {
  CURRENT_USER: 'cat_shelter_current_user',
  CATS: 'cat_shelter_cats',
  APPLICATIONS: 'cat_shelter_applications',
};

/**
 * ローカルストレージサービス
 * データの永続化を担当
 */
export const storageService = {
  // ユーザー情報の保存
  saveUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // ユーザー情報の取得
  getUser: (): User | null => {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  },

  // 猫データの保存
  saveCats: (cats: Cat[]): void => {
    localStorage.setItem(STORAGE_KEYS.CATS, JSON.stringify(cats));
  },

  // 猫データの取得
  getCats: (): Cat[] => {
    const catsJson = localStorage.getItem(STORAGE_KEYS.CATS);
    return catsJson ? JSON.parse(catsJson) : [];
  },

  // 申請データの保存
  saveApplications: (applications: Application[]): void => {
    localStorage.setItem(
      STORAGE_KEYS.APPLICATIONS,
      JSON.stringify(applications)
    );
  },

  // 申請データの取得
  getApplications: (): Application[] => {
    const applicationsJson = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return applicationsJson ? JSON.parse(applicationsJson) : [];
  },

  // 初期データをストレージに設定（初回のみ）
  initializeStorage: (
    mockCats: Cat[],
    mockApplications: Application[]
  ): void => {
    if (!localStorage.getItem(STORAGE_KEYS.CATS)) {
      localStorage.setItem(STORAGE_KEYS.CATS, JSON.stringify(mockCats));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(
        STORAGE_KEYS.APPLICATIONS,
        JSON.stringify(mockApplications)
      );
    }
  },

  // すべてのデータを消去（ログアウト時など）
  clearAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    // 必要に応じて他のデータも削除
    // localStorage.removeItem(STORAGE_KEYS.CATS);
    // localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
  },
};
