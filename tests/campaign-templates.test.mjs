import test from 'node:test';
import assert from 'node:assert/strict';
import { campaignKeys, campaignPreset } from '../public/campaign-templates.js';
import { projectDraft } from '../public/client-types.js';

test('campaign links reject unknown and prototype keys', () => {
  for (const key of [null, '', 'missing', '__proto__', 'constructor']) assert.equal(campaignPreset(key), null);
  assert.equal(campaignKeys.length, 4);
});

test('campaign drafts combine business questions and services with the selected client profile', () => {
  const profile = { displayName: '김담당', organization: '우리 브랜드', region: '전국·온라인' };
  const preset = campaignPreset('creator');
  const draft = projectDraft('company', profile, preset);
  assert.equal(draft.goal, '브랜드·콘텐츠');
  assert.equal(draft.client.organization, '우리 브랜드');
  assert.equal(draft.region, '전국·온라인');
  assert.match(draft.notes, /희망 크리에이터·콘텐츠 형식/);
  assert.deepEqual(draft.services, ['creator', 'video']);
  draft.services.push('design');
  assert.deepEqual(campaignPreset('creator').services, ['creator', 'video']);
  assert.equal(campaignPreset('tourism').goal, '관광·지역 프로젝트');
});
