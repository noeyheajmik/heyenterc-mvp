import { clientActions } from './actions.js';

export const PROJECT_STATUSES = ['전체', '진행 중', '확인 필요', '초안', '브리프 확인', '제안 검토', '제작 진행', '완료'];
export const PROJECT_SORTS = { recent: '최근 추가순', attention: '확인할 일 많은순', name: '이름순' };
export function projectListOptions(params) {
  return { q: (params.get('q') || '').slice(0, 100), status: PROJECT_STATUSES.includes(params.get('status')) ? params.get('status') : '전체', sort: Object.hasOwn(PROJECT_SORTS, params.get('sort')) ? params.get('sort') : 'recent' };
}
export function projectListQuery({ q, status, sort }) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (status !== '전체') params.set('status', status);
  if (sort !== 'recent') params.set('sort', sort);
  return params;
}
export function selectProjects(projects, { q = '', status = '전체', sort = 'recent' } = {}) {
  const counts = new Map();
  for (const a of clientActions(projects)) counts.set(a.projectId, (counts.get(a.projectId) || 0) + 1);
  const query = q.trim().toLocaleLowerCase('ko');
  const items = projects.filter(p => (!query || `${p.title} ${p.region}`.toLocaleLowerCase('ko').includes(query)) && (status === '전체' || (status === '확인 필요' ? counts.has(p.id) : status === '진행 중' ? !['초안', '완료'].includes(p.status) : p.status === status)));
  if (sort === 'attention') items.sort((a, b) => (counts.get(b.id) || 0) - (counts.get(a.id) || 0));
  else if (sort === 'name') items.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  return { items, counts };
}
