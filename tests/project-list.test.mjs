import test from 'node:test';
import assert from 'node:assert/strict';
import { selectProjects, projectListOptions, projectListQuery } from '../public/project-list.js';
const projects = [
  { id: 'a', title: '한강 캠페인', region: '서울', status: '제안 검토', proposal: true, version: 'v1.0', reviewed: false },
  { id: 'b', title: '가을 축제', region: '전남 고흥', status: '제작 진행', budgetSnapshots: [{ version: 'v1.0', reviewStatus: '확인 대기' }], deliverables: [{ id: 'film', title: '영상', revision: 1, status: '확인 대기' }] },
  { id: 'c', title: '로컬 브랜드', region: '전남', status: '초안' }
];
test('search, status and attention filters combine and tolerate surrounding whitespace', () => {
  assert.deepEqual(selectProjects(projects, { q: ' 전남 ', status: '확인 필요' }).items.map(p => p.id), ['b']);
  assert.equal(selectProjects(projects, { q: '서울', status: '초안' }).items.length, 0);
  assert.deepEqual(selectProjects([...projects, { id: 'd', title: '완료', status: '완료' }], { status: '진행 중' }).items.map(p => p.id), ['a', 'b']);
});
test('attention sorting counts current review items without reordering the source', () => {
  assert.deepEqual(selectProjects(projects, { sort: 'attention' }).items.map(p => p.id), ['b', 'a', 'c']);
  assert.deepEqual(projects.map(p => p.id), ['a', 'b', 'c']);
  assert.equal(selectProjects(projects).counts.get('b'), 2);
});
test('name sorting and default ordering remain distinct', () => {
  assert.deepEqual(selectProjects(projects, { sort: 'name' }).items.map(p => p.id), ['b', 'c', 'a']);
  assert.deepEqual(selectProjects(projects).items.map(p => p.id), ['a', 'b', 'c']);
});
test('query restores combined filters and rejects unknown options', () => {
  const options = { q: '지역 & 축제', status: '확인 필요', sort: 'attention' };
  assert.deepEqual(projectListOptions(projectListQuery(options)), options);
  assert.deepEqual(projectListOptions(new URLSearchParams('status=unknown&sort=unknown')), { q: '', status: '전체', sort: 'recent' });
  assert.equal(projectListQuery({ q: ' ', status: '전체', sort: 'recent' }).size, 0);
});
