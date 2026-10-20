import test from 'node:test';
import assert from 'node:assert/strict';
import { projectOverview } from '../public/overview.js';
const base = () => ({ id: 'p', title: '캠페인', status: '브리프 확인', manager: '', tasks: [], messages: [] });
test('assigned briefs never claim the manager is still unassigned', () => {
  const p = base();
  assert.match(projectOverview(p).description, /배정되지 않았/);
  p.manager = '가상 담당자';
  assert.match(projectOverview(p).description, /배정되어/);
  assert.doesNotMatch(projectOverview(p).description, /배정되지 않았/);
});
test('draft and completed states do not prompt a new proposal review', () => {
  const p = { ...base(), proposal: true, reviewed: false, version: 'v1.0', status: '초안' };
  assert.equal(projectOverview(p).actions.length, 0);
  p.status = '완료';
  assert.equal(projectOverview(p).actions.length, 0);
  assert.match(projectOverview(p).title, /기록/);
});
test('overview uses shared budget snapshots and current task and review counts', () => {
  const p = { ...base(), tasks: [{ stage: '완료' }, { stage: '진행 중' }], budgetSnapshots: [{ version: 'v1.0' }, { version: 'v2.0' }], costPlan: { cap: 999 }, deliverables: [{ status: '확인 대기' }, { status: '메모 확인 완료' }], participants: [{ id: 'one' }] };
  const view = projectOverview(p);
  assert.equal(view.taskDone, 1); assert.equal(view.taskTotal, 2);
  assert.equal(view.budget.version, 'v2.0');
  assert.equal(view.deliveryPending, 1); assert.equal(view.deliveries, 2);
  assert.equal(view.participants, 1);
});
test('reviewed or commented proposals do not produce a false new-proposal prompt', () => {
  const p = { ...base(), status: '제안 검토', proposal: true, latestVersion: 'v2.0', version: 'v1.0', reviewed: false };
  assert.equal(projectOverview(p).actions.length, 1);
  p.proposalCommentedVersions = ['v2.0'];
  assert.equal(projectOverview(p).actions.length, 0);
  assert.match(projectOverview(p).title, /다음 단계/);
});
