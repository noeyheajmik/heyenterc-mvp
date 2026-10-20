import { createAssignments } from './assignments.js';

export function createCoordination({ hub, profiles, projects, icon, esc, toast, message, log, refresh }) {
  const state = { project: null, drafts: {} };
  const assignments = createAssignments({ hub, projects, icon, esc, toast, log, refresh });
  const blank = () => ({ profileId: profiles[0].id, role: '', scope: '', timing: '', budget: '', conditions: '' });
  const responseLabel = value => ({ yes: '참여 검토 희망', discuss: '조건 협의 필요', no: '참여 어려움' }[value]);
  const text = value => esc(value).replaceAll('\n', '<br>');
  function render(p) {
    state.project = p; const d = state.drafts[p.id] ||= blank();
    const requests = hub.requests.filter(r => r.projectId === p.id);
    const field = (key, label, required = false) => `<div class="field"><label for="coordination-${key}">${label}${required ? ' *' : ' · 선택'}</label><input class="input" id="coordination-${key}" name="${key}" maxlength="160" value="${esc(d[key])}" ${required ? 'required' : ''}></div>`;
    return `<div class="collab-detail-grid coordination-layout"><section class="ws-panel"><span class="eyebrow">THE NEXT CONNECTION</span><h2>협업 요청과 회신</h2><p class="ws-muted">협업 후보에게 요청할 역할과 조건을 정리하고 회신을 확인하세요.</p>${requests.length ? requests.map(r => `<article class="coordination-request"><div class="production-delivery-top"><span class="network-glyph">${icon(r.kind === 'artists' ? 'mic' : 'film')}</span><div><h3>${esc(r.profileName)}</h3><p>${r.kind === 'artists' ? '아티스트' : '제작 파트너'} · ${esc(r.role)}</p></div></div><span class="collab-status">${r.replied ? responseLabel(r.sentResponse.availability) : '회신 전'}</span><p>${text(r.scope)}</p>${r.replied ? `<dl class="collab-facts">${[['가능 일정', r.sentResponse.date || '일정 협의'], ['비용·조건', r.sentResponse.fee || '범위 확인 후 협의'], ['회신 내용', r.sentResponse.note || '추가 메모 없음']].map(([k, v]) => `<div><dt>${k}</dt><dd>${text(v)}</dd></div>`).join('')}</dl>` : ''}<div class="coordination-actions"><a class="btn secondary" href="#/collab/requests/${r.id}?role=${r.kind}">상대 역할에서 확인 ${icon('up-right')}</a>${r.replied && r.sentResponse.availability !== 'no' ? `<button class="btn primary" data-coordination-connect="${r.id}" ${p.participants?.some(person => person.requestId === r.id) ? 'disabled' : ''}>${p.participants?.some(person => person.requestId === r.id) ? '참여자에 연결됨' : '참여자에 연결'} ${icon('check')}</button>` : ''}</div><p class="fine-print collab-form-note">연결한 참여자의 역할과 준비할 작업을 정리할 수 있습니다.</p>${assignments.render(r, p)}</article>`).join('') : '<div class="budget-empty"><p>아직 구성한 협업 요청이 없습니다. 필요한 역할을 먼저 정리해 보세요.</p></div>'}</section><section class="ws-panel"><span class="eyebrow">ASK WITH A CLEAR SCOPE</span><h2>협업 요청 구성</h2><form id="coordination-request-form" data-project="${p.id}"><div class="field"><label for="coordination-profile">협업 후보 · 프로필 예시</label><select id="coordination-profile" name="profileId">${['partners', 'artists'].map(kind => `<optgroup label="${kind === 'artists' ? '아티스트' : '제작 파트너'}">${profiles.filter(profile => profile.kind === kind).map(profile => `<option value="${profile.id}" ${d.profileId === profile.id ? 'selected' : ''}>${profile.name} · ${profile.region}</option>`).join('')}</optgroup>`).join('')}</select></div>${field('role', '요청할 역할', true)}<div class="field"><label for="coordination-scope">작업·출연 범위 *</label><textarea class="input" id="coordination-scope" name="scope" maxlength="2000" required>${esc(d.scope)}</textarea></div>${field('timing', '희망 일정')}${field('budget', '비용 검토 기준')}<div class="field"><label for="coordination-conditions">확인할 조건 · 선택</label><textarea class="input" id="coordination-conditions" name="conditions" maxlength="2000" placeholder="이동, 준비 시간, 촬영·활용 범위를 정리해 주세요.">${esc(d.conditions)}</textarea></div><button class="btn primary full-width" type="submit">협업 요청 공유 ${icon('arrow')}</button></form></section></div>`;
  }
  function capture(event) { const form = event.target.closest('#coordination-request-form'); if (form) Object.assign(state.drafts[form.dataset.project], Object.fromEntries(new FormData(form))); }
  document.addEventListener('input', capture); document.addEventListener('change', capture);
  document.addEventListener('submit', event => {
    const form = event.target; if (form.id !== 'coordination-request-form') return; event.preventDefault(); capture(event);
    const p = projects.find(p => p.id === form.dataset.project); const d = state.drafts[p.id]; const profile = profiles.find(profile => profile.id === d.profileId);
    if (!profile || !d.role.trim() || !d.scope.trim()) { toast('후보·요청 역할·작업 범위를 확인해 주세요.'); return; }
    const request = { id: 'request-' + crypto.randomUUID(), projectId: p.id, profileId: profile.id, profileName: profile.name, title: p.title, region: p.region, kind: profile.kind, role: d.role.trim(), scope: d.scope.trim(), timing: d.timing.trim() || '희망 일정 협의', budget: d.budget.trim() || '범위 확인 후 협의', checks: [d.conditions.trim() || '일정과 작업·출연 범위 확인', '가능한 역할과 비용 조건 확인'], status: '회신 전', response: { availability: 'discuss', date: '', fee: '', note: '' }, sentResponse: null, replied: false };
    hub.requests.unshift(request); state.drafts[p.id] = blank(); log.push(`${p.title} · ${profile.name} 협업 요청 구성`); p.messages.push(message(`${profile.name}에게 ${request.role} 역할의 협업 요청을 워크스페이스에서 구성했습니다.`)); refresh(); toast('상대 역할의 협업 요청 화면에 연결했어요.');
  });
  document.addEventListener('click', event => {
    const el = event.target.closest('[data-coordination-connect],[data-coordination-focus]'); if (!el) return;
    if (el.hasAttribute('data-coordination-focus')) { const field = document.querySelector('#coordination-profile'); field?.scrollIntoView({ block: 'center' }); field?.focus({ preventScroll: true }); return; }
    const r = hub.requests.find(r => r.id === el.dataset.coordinationConnect); const p = projects.find(p => p.id === r?.projectId);
    if (!p || !r.replied || r.sentResponse.availability === 'no' || p.participants?.some(person => person.requestId === r.id)) return;
    p.participants ||= []; p.participants.push({ id: crypto.randomUUID(), requestId: r.id, name: r.profileName, role: r.role, kind: r.kind === 'artists' ? '아티스트' : '제작 파트너', status: '조건 협의' }); log.push(`${p.title} · ${r.profileName} 참여자 연결`); refresh(); toast('협의할 역할을 참여자 화면에 연결했어요.');
  });
  return { render };
}
