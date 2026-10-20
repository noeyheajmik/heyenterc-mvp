import { normalizeCampaign } from './campaign-brief.js';
export const CLIENT_TYPES = {
  institution: { label: '기관·지자체 담당자', workspace: '기관 담당자 업무 공간', glyph: 'folder', avatar: '로', accountTitle: '계정·기관 정보', displayName: '프로젝트 담당자', organization: '지역 프로젝트팀', goal: '관광·지역 프로젝트' },
  company: { label: '기업·브랜드 담당자', workspace: '기업·브랜드 업무 공간', glyph: 'folder', avatar: 'B', accountTitle: '계정·브랜드 정보', displayName: '브랜드 담당자', organization: '', goal: '브랜드·콘텐츠' },
  personal: { label: '개인·로컬 브랜드 의뢰자', workspace: '개인·로컬 브랜드 공간', glyph: 'person', avatar: '나', accountTitle: '계정·브랜드 정보', displayName: '개인 의뢰자', organization: '', goal: '브랜드·콘텐츠' }
};
export const clientType = role => CLIENT_TYPES[role] || CLIENT_TYPES.institution;
export function roleForBrief(type) {
  return type === '기업·브랜드' ? 'company' : ['개인', '로컬 브랜드·사업자'].includes(type) ? 'personal' : type === '기관·지자체' ? 'institution' : '';
}
export function projectDraft(role, profile, preset = {}) {
  const draftRole = role || roleForBrief(preset.type) || 'institution';
  return { id: '', title: '', region: profile.region || '', goal: clientType(roleForBrief(preset.type) || draftRole).goal, budget: '미정', date: '', notes: '', ...preset, client: { ...profile, role: draftRole }, services: [...(preset.services || [])], campaign: normalizeCampaign(preset.campaign) };
}

export function clientOrganization(client) { return client?.organization || (client?.role === 'company' ? '기업·브랜드명 미작성' : client?.role === 'institution' ? '기관명 미작성' : '개인 의뢰'); }
