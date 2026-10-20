export const CAMPAIGN_CHANNELS = ['브랜드·기관 SNS', '웹사이트·상세페이지', '유튜브', '유료 디지털 광고', '오프라인·행사', '언론·보도'];
const text = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export function normalizeCampaign(value) {
  const source = value && typeof value === 'object' ? value : {};
  return { targetAudience: text(source.targetAudience, 200), coreMessage: text(source.coreMessage, 300), channels: CAMPAIGN_CHANNELS.filter(channel => Array.isArray(source.channels) && source.channels.includes(channel)), usageNotes: text(source.usageNotes, 600) };
}
export function campaignRows(value) {
  const c = normalizeCampaign(value);
  return [['목표 고객·대상', c.targetAudience], ['핵심 메시지', c.coreMessage], ['희망 활용 채널', c.channels.join(' · ')], ['광고·2차 활용 조건', c.usageNotes]].filter(([, value]) => value);
}
export const campaignText = value => campaignRows(value).map(([label, text]) => `${label}: ${text}`).join('\n');
export function campaignForm(value, esc) {
  const c = normalizeCampaign(value);
  return `<div class="campaign-brief-form"><h2>누구에게, 어떻게 전할까요?</h2><p class="ws-muted">결정한 내용부터 적어 주세요. 모든 항목은 선택 사항이며, 작성한 조건을 기준으로 제작 범위를 함께 정리합니다.</p><div class="field"><label for="campaign-audience">목표 고객·대상 · 선택</label><input class="input" id="campaign-audience" name="targetAudience" maxlength="200" value="${esc(c.targetAudience)}" placeholder="예: 20~30대 직장인, 신혼 가구, 가족 여행객"></div><div class="field"><label for="campaign-message">핵심 메시지 · 선택</label><textarea class="input" id="campaign-message" name="coreMessage" maxlength="300" placeholder="고객에게 기억시키고 싶은 제품의 장점이나 이야기를 적어주세요.">${esc(c.coreMessage)}</textarea></div><fieldset class="campaign-channels"><legend>희망 활용 채널 · 복수 선택</legend><div class="campaign-channel-options">${CAMPAIGN_CHANNELS.map((channel, i) => `<label for="campaign-channel-${i}"><input id="campaign-channel-${i}" type="checkbox" name="campaignChannel" value="${channel}" ${c.channels.includes(channel) ? 'checked' : ''}><span>${channel}</span></label>`).join('')}</div></fieldset><div class="field"><label for="campaign-usage">광고·2차 활용 조건 · 선택</label><textarea class="input" id="campaign-usage" name="usageNotes" maxlength="600" placeholder="예: 자사 SNS 6개월 게시, 유료 광고 3개월 활용 희망, 숏폼 재편집 필요">${esc(c.usageNotes)}</textarea><p class="campaign-field-help">희망 사용 기간, 광고 집행과 재편집 범위를 적어 주세요. 출연자·음원·이미지의 사용 조건은 별도로 협의합니다.</p></div></div>`;
}
