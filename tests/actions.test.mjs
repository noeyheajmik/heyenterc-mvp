import test from 'node:test';
import assert from 'node:assert/strict';
import { clientActions } from '../public/actions.js';
const base = () => ({ id: 'one', title: '샘플', status: '제안 검토', proposal: true, reviewed: false, latestVersion: 'v2.0', version: 'v1.0' });
test('comments on an older proposal do not hide the current review; a new version reopens it', () => {
  const p = { ...base(), proposalCommentedVersions: ['v1.0'] };
  assert.equal(clientActions([p])[0].detail, '최신 제안 v2.0');
  p.proposalCommentedVersions.push('v2.0');
  assert.equal(clientActions([p]).length, 0);
  p.latestVersion = 'v3.0';
  assert.equal(clientActions([p]).length, 1);
});
test('only the latest budget and unreviewed deliverables need client attention', () => {
  const p = { ...base(), reviewed: true, budgetSnapshots: [{ version: 'v1.0', reviewStatus: '확인 대기' }, { version: 'v2.0', reviewStatus: '수정 의견 있음' }], deliverables: [{ id: 'a', title: '영상', revision: 2, status: '확인 대기' }, { id: 'b', status: '메모 확인 완료' }] };
  assert.deepEqual(clientActions([p]).map(a => a.kind), ['delivery']);
  p.budgetSnapshots.push({ version: 'v3.0', reviewStatus: '확인 대기' });
  assert.deepEqual(clientActions([p]).map(a => a.kind), ['budget', 'delivery']);
});
test('acknowledging a brief reply hides that revision only, without changing its review status', () => {
  const u = { id: 'reply', reason: '범위 조정', status: '추가 협의 필요', reviewNote: '일정 조율', reviewRevision: 1 };
  const p = { ...base(), reviewed: true, briefUpdates: [u] };
  assert.equal(clientActions([p]).length, 1);
  u.clientSeenRevision = 1;
  assert.equal(clientActions([p]).length, 0);
  assert.equal(u.status, '추가 협의 필요');
  u.reviewRevision = 2;
  assert.equal(clientActions([p]).length, 1);
});
test('draft and completed projects are excluded and ids remain unique between projects', () => {
  assert.equal(clientActions([{ ...base(), status: '초안' }, { ...base(), status: '완료' }]).length, 0);
  const actions = clientActions([base(), { ...base(), id: 'two' }]);
  assert.equal(new Set(actions.map(a => a.id)).size, 2);
});
