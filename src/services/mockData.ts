import { Cat, Application, User } from '../types/type';

// モックデータ
export const mockCats: Cat[] = [
  {
    id: 1,
    name: 'ミケ',
    age: 2,
    breed: '雑種（三毛）',
    description: '明るく活発な性格で、人懐っこい三毛猫です。',
    health_status: '健康',
    status: 'available',
    image: '/images/cat1.jpg',
  },
  {
    id: 2,
    name: 'クロ',
    age: 1,
    breed: '雑種（黒）',
    description: '人見知りですが、慣れると甘えん坊になります。',
    health_status: '健康',
    status: 'available',
    image: '/images/cat2.jpg',
  },
  {
    id: 3,
    name: 'タマ',
    age: 3,
    breed: 'アメリカンショートヘア',
    description: '穏やかな性格で、他の猫とも仲良くできます。',
    health_status: '治療中',
    status: 'available',
    image: '/images/cat3.jpg',
  },
  {
    id: 4,
    name: 'モモ',
    age: 0,
    breed: '雑種',
    description: '生後3ヶ月の元気な子猫です。遊ぶのが大好きです。',
    health_status: '健康',
    status: 'adopted',
    image: '/images/cat4.jpg',
  },
];

export const mockApplications: Application[] = [
  {
    id: 1,
    cat_id: 2,
    cat_name: 'クロ',
    user_id: 2,
    user_name: '田中太郎',
    message: 'クロちゃんを家族に迎えたいです。静かな環境で大切に育てます。',
    status: 'rejected',
    created_at: '2023-05-08T09:30:00.000Z',
  },
  {
    id: 2,
    cat_id: 1,
    cat_name: 'ミケ',
    user_id: 3,
    user_name: '佐藤花子',
    message:
      '家に庭があり、たくさん遊べるスペースがあります。ミケちゃんを迎えたいです。',
    status: 'approved',
    created_at: '2023-05-10T14:20:00.000Z',
  },
  {
    id: 3,
    cat_id: 3,
    cat_name: 'タマ',
    user_id: 2,
    user_name: '田中太郎',
    message:
      '以前も猫を飼っていた経験があります。タマちゃんのケアをしっかりできます。',
    status: 'pending',
    created_at: '2024-05-15T11:15:00.000Z',
  },
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: '管理者',
    roles: ['administrator'],
  },
  {
    id: 2,
    name: '田中太郎',
    roles: ['subscriber'],
  },
  {
    id: 3,
    name: '佐藤花子',
    roles: ['subscriber'],
  },
];
