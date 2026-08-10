/**
 * 全站经常变动的信息集中在这里维护。
 * 后续确定招新日期、群号、报名表和二维码后，只需要修改 recruitment。
 */
export const siteConfig = {
  nameZh: '西安交通大学西北狼战队',
  nameEn: 'N.W.wolf',
  groupName: 'XJTUROBOCON 四足组',
  github: 'https://github.com/N-W-wolf',
  recruitment: {
    status: '招新中',
    period: '8月10日 - 待定',
    contactLabel: '招新交流群',
    contactValue: '待更新',
    applyUrl: '#join',
    // 将二维码图片放入 public/assets/recruitment/ 后，在此填写以 /assets/ 开头的公开路径。
    qrCode: '/assets/recruitment/qrcode.png',
    showMaintenanceNote: false,
  },
} as const;
