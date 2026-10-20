import test from 'node:test';
import assert from 'node:assert/strict';
import { documentTypes, selectDocuments, documentLibraryOptions, documentLibraryQuery } from '../public/document-library.js';
const projects = [
  { id: 'a', title: '영상 캠페인', documents: [{ id: 'same', title: '구성안', kind: '제안서', version: 'v1.0', text: '산책길과 인터뷰' }, { id: 'next', title: '구성안', kind: '제안서', version: 'v2.0', text: '숏폼 추가' }] },
  { id: 'b', title: '축제', documents: [{ id: 'same', title: '예산 메모', kind: '예산', version: 'v1.0', text: '현장 기록 예산' }] },
  { id: 'c', title: '초안', documents: [] }
];
test('search covers body and title and combines with project and type', () => {
  assert.equal(selectDocuments(projects, { q: ' 산책길 ' }).length, 1);
  assert.equal(selectDocuments(projects, { q: '예산', project: 'b', kind: '예산' }).length, 1);
  assert.equal(selectDocuments(projects, { q: '예산', project: 'a' }).length, 0);
});
test('previous versions and project identities survive flattening', () => {
  assert.deepEqual(selectDocuments(projects, { kind: '제안서' }).map(row => row.document.version), ['v1.0', 'v2.0']);
  assert.deepEqual(selectDocuments(projects).filter(row => row.document.id === 'same').map(row => row.project.id), ['a', 'b']);
  assert.equal(selectDocuments(projects, { project: 'c' }).length, 0);
});
test('query restores Unicode filters and invalid selectors normalize to all documents', () => {
  const options = { q: '산책 & 여행', project: 'a', kind: '제안서' };
  assert.deepEqual(documentLibraryOptions(projects, documentLibraryQuery(options)), options);
  assert.deepEqual(documentLibraryOptions(projects, new URLSearchParams('project=missing&kind=missing')), { q: '', project: '', kind: '' });
  assert.equal(documentTypes(projects).length, 2);
});
