import test from 'node:test';
import assert from 'node:assert/strict';
import { staffActions } from '../public/staff-actions.js';
const base = () => ({ id: 'p', title: '캠페인', status: '제안 검토', manager: '담당자', proposal: true, latestVersion: 'v2.0', reviewed: false });
test('client review waiting is not staff work, while current version feedback is', () => {
  const p = base();
  assert.equal(staffActions([p]).length, 0);
  p.proposalFeedback = { 'v1.0': '이전 의견' };
  assert.equal(staffActions([p]).length, 0);
  p.proposalFeedback['v2.0'] = '숏폼 요청';
  assert.equal(staffActions([p])[0].kind, 'proposal');
  p.latestVersion = 'v3.0';
  assert.equal(staffActions([p]).length, 0);
});
test('only current budget and deliverable revisions need changes', () => {
  const p = { ...base(), budgetSnapshots: [{ version: 'v1', reviewStatus: '수정 의견 있음' }, { version: 'v2', reviewStatus: '확인 대기' }], deliverables: [{ id: 'd', title: '영상', revision: 2, status: '수정 의견 있음' }] };
  assert.deepEqual(staffActions([p]).map(item => item.kind), ['delivery']);
  p.deliverables[0].status = '확인 대기';
  assert.equal(staffActions([p]).length, 0);
});
test('brief and assignment work resolves from actual project state', () => {
  const p = { ...base(), manager: '', briefUpdates: [{ id: 'u', reason: '조건', status: '확인 대기' }] };
  assert.deepEqual(staffActions([p]).map(item => item.kind), ['assign', 'brief']);
  p.manager = '담당자'; p.briefUpdates[0].status = '검토 완료';
  assert.equal(staffActions([p]).length, 0);
  p.manager = ''; p.status = '완료';
  assert.equal(staffActions([p]).length, 0);
});
test('declined, unanswered, connected or unrelated collaboration requests are excluded', () => {
  const p = base();
  const request = { id: 'r', projectId: 'p', replied: true, sentResponse: { availability: 'discuss' }, profileName: '파트너', role: '촬영' };
  assert.equal(staffActions([p], [request]).length, 1);
  assert.equal(staffActions([p], [{ ...request, sentResponse: { availability: 'no' } }, { ...request, replied: false }, { ...request, projectId: 'other' }]).length, 0);
  p.participants = [{ requestId: 'r' }];
  assert.equal(staffActions([p], [request]).length, 0);
});
