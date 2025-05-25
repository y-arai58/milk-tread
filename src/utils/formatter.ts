/**
 * 申請ステータスを日本語表示に変換
 */
export const formatApplicationStatus = (status: string): string => {
  switch (status) {
    case 'pending':
      return '審査中';
    case 'approved':
      return '承認済み';
    case 'rejected':
      return '却下';
    default:
      return status;
  }
};

/**
 * 猫のステータスを日本語表示に変換
 */
export const formatCatStatus = (status: string): string => {
  switch (status) {
    case 'available':
      return '里親募集中';
    case 'adopted':
      return '譲渡済み';
    default:
      return status;
  }
};
