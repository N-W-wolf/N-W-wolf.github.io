/**
 * 全站经常变动的信息集中在这里维护。
 * 后续确定招新日期、群号、报名表和二维码后，只需要修改 recruitment。
 */
export const siteConfig = {
  nameZh: '西安交通大学西北狼战队',
  nameEn: 'N.W.wolf',
  groupName: 'RoboCon 四足组',
  github: 'https://github.com/N-W-wolf',
  recruitment: {
    status: '即将开放',
    period: '2026 年 9 月 1 日—9 月 30 日',
    contactLabel: '招新交流群',
    contactValue: '待更新',
    applyUrl: '#join',
    qrCode: '',
  },
} as const;
