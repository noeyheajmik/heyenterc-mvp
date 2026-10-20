export function createClientSettings({ icon, esc, toast, getRole, refresh }) {
  const values = {
    institution: { displayName: '체험 담당자', organization: '지역 홍보팀', department: '', region: '' },
    personal: { displayName: '개인 의뢰자', organization: '', department: '', region: '' }
  };
  const drafts = {};
  const key = role => role === 'personal' ? 'personal' : 'institution';
  const current = role => values[key(role)];
  function render(role) {
    const type = key(role), saved = values[type], d = drafts[type] ||= { ...saved };
    const field = (name, label, placeholder, required = false) => `<div class="field"><label for="settings-${name}">${label}${required ? ' *' : ' · 선택'}</label><input class="input" id="settings-${name}" name="${name}" value="${esc(d[name])}" placeholder="${placeholder}" maxlength="60" ${required ? 'required' : ''}></div>`;
    return `<div class="client-settings collab-content"><div class="ws-heading"><div><span class="eyebrow">YOUR INFORMATION, WELL CONNECTED</span><h1 tabindex="-1">${type === 'institution' ? '계정·기관 정보' : '계정·브랜드 정보'}</h1><p>프로젝트에 사용할 이름과 기본 정보를 정리해 두세요.</p></div><a class="btn secondary" href="#/workspace">업무 홈으로 ${icon('arrow')}</a></div><div class="settings-layout"><section class="ws-panel"><span class="eyebrow">PROFILE DETAILS</span><h2>${type === 'institution' ? '담당자와 기관 정보' : '나와 브랜드 소개'}</h2><form id="client-settings-form"><p class="settings-required">* 표시는 필수 항목입니다. 체험용 이름으로 작성해도 좋아요.</p>${field('displayName', '담당자 이름·표시 이름', '예: 콘텐츠 담당자', true)}${field('organization', type === 'institution' ? '기관·지자체명' : '브랜드·팀명', type === 'institution' ? '예: 샘플시 관광과' : '예: 우리 동네 브랜드', type === 'institution')}${type === 'institution' ? field('department', '부서·팀', '예: 관광콘텐츠팀') : ''}${field('region', '기본 홍보 지역', '예: 전남 고흥')}<div class="settings-save-state" id="settings-save-state" role="status">${Object.keys(saved).some(name => saved[name] !== d[name]) ? '저장하지 않은 변경사항이 있어요.' : '현재 탭에 저장된 정보입니다.'}</div><div class="settings-form-actions"><button class="btn secondary" type="button" data-settings-cancel>변경 취소</button><button class="btn primary" type="submit">정보 저장 · 체험 ${icon('check')}</button></div></form></section><aside><section class="ws-panel"><span class="network-glyph">${icon(type === 'institution' ? 'folder' : 'person')}</span><h2 class="settings-profile-name">${esc(saved.organization || saved.displayName)}</h2><dl class="collab-facts">${[['체험 역할', type === 'institution' ? '기관·지자체 담당자' : '개인·로컬 브랜드 의뢰자'], ['표시 이름', saved.displayName], ['기본 지역', saved.region || '프로젝트별 입력']].map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><a class="btn secondary full-width" href="#/account">다른 역할로 체험하기 ${icon('up-right')}</a></section><section class="settings-note"><span class="eyebrow">A CLEAR START</span><h2>한 번 정리하고,<br>다음 프로젝트로.</h2><p>저장한 이름과 지역은 새 프로젝트의 기본 정보로 사용합니다. 이미 생성한 프로젝트의 의뢰 정보는 바뀌지 않습니다.</p><p class="fine-print">실제 계정 생성·인증이 아닌 화면 체험입니다. 현재 탭에서만 유지되며 새로고침하면 초기화됩니다.</p></section></aside></div></div>`;
  }
  function capture(form) { const type = key(getRole()); drafts[type] ||= { ...values[type] }; Object.assign(drafts[type], Object.fromEntries(new FormData(form))); }
  document.addEventListener('input', event => {
    const form = event.target.closest('#client-settings-form'); if (!form) return; capture(form);
    const type = key(getRole()); document.querySelector('#settings-save-state').textContent = Object.keys(values[type]).some(name => values[type][name] !== drafts[type][name]) ? '저장하지 않은 변경사항이 있어요.' : '현재 탭에 저장된 정보입니다.';
  });
  document.addEventListener('click', event => { if (event.target.closest('[data-settings-cancel]')) { const type = key(getRole()); drafts[type] = { ...values[type] }; refresh(); document.querySelector('#settings-displayName')?.focus({ preventScroll: true }); } });
  document.addEventListener('submit', event => {
    if (event.target.id !== 'client-settings-form') return; event.preventDefault(); capture(event.target);
    const type = key(getRole()), d = drafts[type]; const next = Object.fromEntries(Object.entries(d).map(([name, value]) => [name, value.trim()]));
    if (!next.displayName || type === 'institution' && !next.organization) { toast('표시 이름과 기관명을 공백 없이 입력해 주세요.'); return; }
    values[type] = next; drafts[type] = { ...next }; refresh(); document.querySelector('#settings-displayName')?.focus({ preventScroll: true }); toast('현재 탭의 계정 정보를 저장했어요. 새 프로젝트에 사용됩니다.');
  });
  return { render, current };
}
