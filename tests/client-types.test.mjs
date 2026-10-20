import test from 'node:test';
import assert from 'node:assert/strict';
import { clientType, clientOrganization, projectDraft, roleForBrief } from '../public/client-types.js';

test('brand, personal and institution entries keep distinct defaults', () => {
  assert.equal(roleForBrief('기업·브랜드'), 'company');
  assert.equal(roleForBrief('로컬 브랜드·사업자'), 'personal');
  assert.equal(roleForBrief('기관·지자체'), 'institution');
  assert.equal(clientType('company').goal, '브랜드·콘텐츠');
  assert.equal(clientType('personal').goal, '브랜드·콘텐츠');
  assert.equal(clientType('institution').goal, '관광·지역 프로젝트');
  assert.equal(roleForBrief('파트너 참여'), '');
});

test('a brief carries its brand goal without changing the selected account identity', () => {
  const profile = { displayName: '김담당', organization: '홍보팀', region: '서울' };
  const draft = projectDraft('institution', profile, { type: '기업·브랜드', title: '론칭', budget: '500만원 미만' });
  assert.equal(draft.goal, '브랜드·콘텐츠');
  assert.equal(draft.client.role, 'institution');
  assert.equal(draft.title, '론칭');
  assert.equal(draft.budget, '500만원 미만');
  assert.equal(draft.region, '서울');
});

test('project snapshots retain profile information and service choices independently', () => {
  const profile = { displayName: '브랜드 담당자', organization: '우리 브랜드', department: '마케팅', region: '전국·온라인' };
  const preset = { services: ['video', 'creator'], notes: '제품 출시' };
  const draft = projectDraft('company', profile, preset);
  profile.organization = '수정된 브랜드';
  preset.services.push('design');
  assert.equal(draft.client.organization, '우리 브랜드');
  assert.equal(draft.client.department, '마케팅');
  assert.deepEqual(draft.services, ['video', 'creator']);
  assert.equal(draft.goal, '브랜드·콘텐츠');
  assert.equal(draft.notes, '제품 출시');
});

test('missing organization names never relabel a company or institution as a personal request', () => {
  assert.equal(clientOrganization({ role: 'company', organization: '' }), '기업·브랜드명 미작성');
  assert.equal(clientOrganization({ role: 'institution' }), '기관명 미작성');
  assert.equal(clientOrganization({ role: 'personal', organization: '' }), '개인 의뢰');
  assert.equal(clientOrganization({ role: 'company', organization: '우리 브랜드' }), '우리 브랜드');
});
