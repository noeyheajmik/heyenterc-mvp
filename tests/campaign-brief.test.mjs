import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMPAIGN_CHANNELS, campaignRows, campaignText, normalizeCampaign } from '../public/campaign-brief.js';
import { projectDraft } from '../public/client-types.js';
import { projectSummary, projectSummaryText } from '../public/reports.js';

test('existing projects without campaign conditions remain compatible', () => {
  assert.deepEqual(campaignRows(undefined), []);
  assert.equal(campaignText(null), '');
  const p = { title: '기존 프로젝트', status: '초안', tasks: [] };
  assert.ok(!projectSummary(p).sections.some(s => s.title === '캠페인 기획 조건'));
});

test('channels stay unique, valid and in stable order; text is bounded', () => {
  const c = normalizeCampaign({ targetAudience: ' 고객 ', coreMessage: 'a'.repeat(400), channels: ['유료 디지털 광고', '유튜브', '유튜브', '알 수 없는 채널'], usageNotes: 'b'.repeat(800) });
  assert.equal(c.targetAudience, '고객');
  assert.equal(c.coreMessage.length, 300);
  assert.equal(c.usageNotes.length, 600);
  assert.deepEqual(c.channels, ['유튜브', '유료 디지털 광고']);
  assert.deepEqual(normalizeCampaign({ channels: '유튜브' }).channels, []);
});

test('project creation snapshots campaign conditions independently from the draft', () => {
  const campaign = { targetAudience: '신혼 가구', channels: ['유튜브'], usageNotes: '광고 3개월 활용 희망' };
  const draft = projectDraft('company', { displayName: '담당자' }, { campaign });
  const saved = normalizeCampaign(draft.campaign);
  campaign.channels.push('유료 디지털 광고');
  draft.campaign.channels.push('브랜드·기관 SNS');
  draft.campaign.targetAudience = '변경된 대상';
  assert.equal(saved.targetAudience, '신혼 가구');
  assert.deepEqual(saved.channels, ['유튜브']);
});

test('shared summary and exported text retain audience, message, channels and usage conditions', () => {
  const p = { title: '제품 캠페인', status: '브리프 확인', campaign: { targetAudience: '30대 직장인', coreMessage: '간편한 관리', channels: [CAMPAIGN_CHANNELS[0], CAMPAIGN_CHANNELS[3]], usageNotes: 'SNS 6개월, 광고 3개월 희망' } };
  const section = projectSummary(p).sections.find(s => s.title === '캠페인 기획 조건');
  assert.equal(section.rows.length, 4);
  const text = projectSummaryText(p, '확인 시점');
  for (const value of ['30대 직장인', '간편한 관리', '유료 디지털 광고', 'SNS 6개월, 광고 3개월 희망']) assert.ok(text.includes(value));
});
