import { createProduction } from './production.js';

const MANAGERS = ['콘텐츠 매니저 · 가상 담당자', '행사 매니저 · 가상 담당자', '브랜드 매니저 · 가상 담당자'];
export function createStaff({ projects, icon, esc, toast, message, doc, hub, profiles, reports }) {
  const state = { outlet: null, path: '', params: new URLSearchParams(), drafts: {}, assignments: {}, notes: {}, log: [] };
  const production = createProduction({ projects, icon, esc, toast, message, doc, shell, hub, profiles, reports, log: state.log });
  const head = (kicker, title, text, action = '') => `<div class="ws-heading"><div><span class="eyebrow">${kicker}</span><h1 tabindex="-1">${title}</h1><p>${text}</p></div>${action}</div>`;
  const badge = text => `<span class="collab-status">${esc(text)}</span>`;
  const empty = text => `<div class="collab-empty">${icon('folder')}<h2>${text}</h2><p>프로젝트 목록에서 필요한 항목을 확인해 주세요.</p></div>`;
  const select = (id, label, name, values, value) => `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${name}">${values.map(v => `<option value="${esc(v)}" ${v === value ? 'selected' : ''}>${esc(v || '담당자 미배정')}</option>`).join('')}</select></div>`;
  function shell(content, active) {
    document.body.classList.add('workspace-mode'); document.title = '직원 운영 체험 — 헤이엔터씨';
    state.outlet.innerHTML = `<div class="ws-shell collab-shell staff-shell"><header class="ws-topbar"><a class="ws-logo" href="#/home" aria-label="헤이엔터씨 홈"><img src="./assets/logo-green.png" alt="hey! enter c" width="160" height="40"></a><span class="ws-top-title">OPERATIONS WORKSPACE</span><span class="ws-demo-label">데모</span><a class="ws-public-link" href="#/account">역할 선택 ${icon('up-right')}</a><a class="ws-avatar" href="#/staff" aria-label="운영 홈">${icon('person')}</a></header><aside class="ws-sidebar"><div class="ws-organization">${icon('folder')}<div><strong>헤이엔터씨 운영팀</strong><span>직원 운영 화면 체험</span></div></div><nav aria-label="직원 운영 메뉴">${[['home', '/staff', 'folder', '운영 홈'], ['projects', '/staff/projects', 'file', '전체 프로젝트'], ['proposals', '/staff/proposals', 'pen', '제안 관리']].map(([id, path, glyph, title]) => `<a href="#${path}" ${active === id ? 'aria-current="page"' : ''}>${icon(glyph)}${title}</a>`).join('')}</nav><div class="ws-side-note"><strong>프로젝트의 다음 단계까지.</strong><p>담당자와 제안, 검토 의견을<br>하나의 흐름으로 연결합니다.</p></div><a class="ws-exit" href="#/account">다른 역할로 체험하기 ${icon('up-right')}</a></aside><div class="ws-main"><div class="ws-demo-strip">직원 화면 체험 · 실제 관리자 권한이 아닙니다. 모든 변경은 현재 탭의 샘플 프로젝트에만 반영됩니다.</div><div class="ws-content collab-content">${content}</div></div></div>`;
  }
  function rows(items) { return items.map(p => `<a class="collab-request-row" href="#/staff/projects/${p.id}"><span class="network-glyph">${icon('folder')}</span><div><strong>${esc(p.title)}</strong><p>${esc(p.manager || '담당자 미배정')} · ${esc(p.budget)}</p></div>${badge(p.status)}${icon('arrow')}</a>`).join(''); }
  function home() {
    const active = projects.filter(p => p.status !== '초안');
    const unassigned = active.filter(p => !p.manager);
    shell(`${head('A GOOD FLOW FOR EVERY PROJECT', '프로젝트의 다음을 연결해요.', '새 요청과 담당자, 제안 검토 현황을 한눈에 확인하세요.')}<div class="ws-stats">${[['운영 중인 프로젝트', active.length, '/staff/projects'], ['담당자 미배정', unassigned.length, '/staff/projects?manager=unassigned'], ['검토 대기 제안', projects.filter(p => p.proposal && !p.reviewed).length, '/staff/proposals']].map(([t, n, path]) => `<a href="#${path}"><span>${t}</span><strong>${n}<small>개</small></strong>${icon('arrow')}</a>`).join('')}</div><section class="ws-panel"><div class="ws-panel-heading"><h2>이어서 확인할 프로젝트</h2><a class="text-link" href="#/staff/projects">전체 보기 ${icon('arrow')}</a></div>${rows(active)}</section><section class="ws-panel"><div class="ws-panel-heading"><h2>이번 체험의 운영 기록</h2><span class="ws-small-label">${state.log.length}개</span></div>${state.log.length ? `<ul class="staff-log">${state.log.slice().reverse().map(item => `<li>${icon('check')}<span>${esc(item)}</span></li>`).join('')}</ul>` : '<p class="ws-muted">담당자 배정이나 제안 공유를 체험하면 여기에 기록됩니다.</p>'}</section>`, 'home');
  }
  function list(proposals = false) {
    const q = (state.params.get('q') || '').toLowerCase(); const filter = state.params.get('manager') || '';
    const items = projects.filter(p => (!proposals || p.status !== '초안') && (!q || [p.title, p.region, p.manager].join(' ').toLowerCase().includes(q)) && (!filter || (filter === 'unassigned' ? !p.manager : !!p.manager)));
    shell(`${head(proposals ? 'FROM BRIEF TO PROPOSAL' : 'EVERY PROJECT, IN VIEW', proposals ? '제안 관리' : '전체 프로젝트', proposals ? '요청 내용을 바탕으로 구성안을 작성하고 검토 흐름을 이어가세요.' : '의뢰자 화면에서 생성한 프로젝트도 같은 체험 안에서 확인할 수 있어요.')}<form id="staff-filter-form" class="collab-filter"><div class="field"><label for="staff-search">프로젝트 검색</label><input class="input" type="search" id="staff-search" name="q" maxlength="80" placeholder="프로젝트, 지역, 담당자" value="${esc(state.params.get('q') || '')}"></div><div class="field"><label for="staff-manager-filter">담당자 배정</label><select id="staff-manager-filter" name="manager">${[['', '전체'], ['unassigned', '미배정'], ['assigned', '배정 완료']].map(([v, t]) => `<option value="${v}" ${filter === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div><button class="btn primary" type="submit">찾아보기 ${icon('arrow')}</button></form><div class="collab-result-heading"><span role="status">${items.length}개의 프로젝트</span><a class="text-link" href="#/staff/${proposals ? 'proposals' : 'projects'}">조건 초기화</a></div><section class="ws-panel collab-request-list">${items.length ? rows(items) : empty('조건에 맞는 프로젝트가 없어요.')}</section>`, proposals ? 'proposals' : 'projects');
  }
  function detail(id) {
    const p = projects.find(p => p.id === id); if (!p) { shell(empty('프로젝트를 찾을 수 없어요.'), 'projects'); return; }
    const assignment = state.assignments[id] ||= { manager: p.manager, status: p.status };
    const d = state.drafts[id] ||= { title: `${p.title} 구성안`, direction: p.notes, scope: '', conditions: '', cost: '세부 범위 확인 후 협의' };
    const area = (key, label, required = false) => `<div class="field"><label for="staff-${key}">${label}${required ? ' *' : ' · 선택'}</label><textarea class="input" id="staff-${key}" name="${key}" maxlength="2000" ${required ? 'required' : ''}>${esc(d[key])}</textarea></div>`;
    shell(`<a class="text-link collab-back" href="#/staff/projects">전체 프로젝트 ${icon('arrow')}</a>${head('BRING THE NEXT STEP CLOSER', esc(p.title), `${esc(p.region)} · ${esc(p.goal)}`, `<a class="btn secondary" href="#/workspace/projects/${p.id}/overview">의뢰자 화면 확인 ${icon('up-right')}</a>`)}${production.tabs(p, '')}<div class="collab-detail-grid"><div><section class="ws-panel"><span class="eyebrow">PROJECT BRIEF</span><h2>의뢰 내용</h2><dl class="collab-facts">${[['의뢰 담당자', p.client?.displayName || '미정'], ['기관·브랜드', p.client?.organization || '개인 의뢰'], ['부서·팀', p.client?.department || '미작성'], ['검토 예산 · VAT 포함', p.budget], ['희망 완료일', p.date || '일정 협의'], ['알리고 싶은 이야기', p.notes || '미작성'], ['현재 담당자', p.manager || '미배정'], ['현재 상태', p.status]].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v).replaceAll('\n', '<br>')}</dd></div>`).join('')}</dl></section><section class="ws-panel"><span class="eyebrow">PROPOSAL DRAFT</span><h2>홍보 구성안 작성</h2><p class="ws-muted">작성 중인 내용은 화면을 이동해도 유지됩니다. 공유하면 의뢰자 제안서·문서함에서 같은 내용을 확인할 수 있어요.</p><form id="staff-proposal-form" data-project="${p.id}"><div class="field"><label for="staff-title">구성안 제목 *</label><input class="input" id="staff-title" name="title" maxlength="100" value="${esc(d.title)}" required></div>${area('direction', '홍보 방향', true)}${area('scope', '결과물과 작업 범위', true)}${area('conditions', '일정·수정·활용 조건')}<div class="field"><label for="staff-cost">비용 안내 · 선택</label><input class="input" id="staff-cost" name="cost" maxlength="160" value="${esc(d.cost)}"></div><button class="btn primary full-width" type="submit" ${p.status === '초안' ? 'disabled' : ''}>새 검토본 공유 · 체험 ${icon('arrow')}</button><p class="fine-print collab-form-note">${p.status === '초안' ? '작성 중인 의뢰자 초안입니다. 프로젝트 생성 후 제안을 공유할 수 있습니다.' : '현재 탭의 샘플 프로젝트에만 반영되며 실제 제안은 전송되지 않습니다.'}</p></form></section></div><div><section class="ws-panel"><span class="eyebrow">PROJECT OWNER & STATUS</span><h2>담당자와 진행 단계</h2><form id="staff-assignment-form" data-project="${p.id}">${select('staff-manager', '프로젝트 담당자', 'manager', ['', ...MANAGERS], assignment.manager)}${select('staff-status', '진행 상태', 'status', p.status === '초안' ? ['초안'] : ['브리프 확인', '제안 검토', '제작 진행', '완료'], assignment.status)}<button class="btn secondary full-width" type="submit">운영 정보 반영 · 체험 ${icon('check')}</button></form></section><section class="ws-panel"><span class="eyebrow">LATEST REVIEW</span><h2>제안 검토 현황</h2><dl class="collab-facts"><div><dt>최신 검토본</dt><dd>${p.proposal ? esc(p.latestVersion || p.version) : '아직 없음'}</dd></div><div><dt>의뢰자 검토</dt><dd>${!p.proposal ? '제안 작성 전' : p.reviewed ? '구성 검토 완료' : '검토 대기'}</dd></div><div><dt>최근 수정 의견</dt><dd>${esc(p.feedback || '남겨진 의견이 없습니다.').replaceAll('\n', '<br>')}</dd></div></dl>${p.proposal ? `<a class="btn secondary full-width" href="#/workspace/projects/${p.id}/proposals">의뢰자 제안서 보기 ${icon('arrow')}</a>` : ''}</section><section class="ws-panel"><h2>프로젝트 대화</h2><div class="collab-message-list" role="log" aria-label="프로젝트 대화">${p.messages.length ? p.messages.map(m => `<article class="collab-message ${m.who === 'me' ? 'mine' : ''}"><span>${m.who === 'me' ? '의뢰자 · 체험' : '헤이엔터씨 · 체험'}</span><p>${esc(m.text).replaceAll('\n', '<br>')}</p></article>`).join('') : '<p class="ws-muted">아직 대화가 없습니다.</p>'}</div><form id="staff-message-form" data-project="${p.id}"><div class="field"><label for="staff-message">안내 메모</label><textarea class="input" id="staff-message" name="text" maxlength="2000" required>${esc(state.notes[id] || '')}</textarea></div><button class="btn secondary full-width" type="submit">안내 남기기 · 체험 ${icon('message')}</button></form></section></div></div>`, 'projects');
  }
  function refresh() { render(state.outlet, state.path, state.params); }
  function render(outlet, path, params) {
    if (path !== '/staff' && !path.startsWith('/staff/')) return false;
    state.outlet = outlet; state.path = path; state.params = params;
    if (path === '/staff') home();
    else if (path === '/staff/projects' || path === '/staff/proposals') list(path.endsWith('proposals'));
    else if (/^\/staff\/projects\/[^/]+\/(schedule|people|budget|report)$/.test(path)) { const parts = path.split('/'); if (!production.render(parts[3], parts[4])) shell(empty('프로젝트를 찾을 수 없어요.'), 'projects'); }
    else if (/^\/staff\/projects\/[^/]+$/.test(path)) detail(path.split('/')[3]);
    else shell(empty('화면을 찾을 수 없어요.'), 'projects');
    return true;
  }
  function capture(event) {
    const form = event.target.closest('form'); if (!form?.dataset.project || !form.id.startsWith('staff-')) return;
    const id = form.dataset.project, data = Object.fromEntries(new FormData(form));
    if (form.id === 'staff-proposal-form') Object.assign(state.drafts[id], data);
    if (form.id === 'staff-assignment-form') Object.assign(state.assignments[id], data);
    if (form.id === 'staff-message-form') state.notes[id] = data.text;
  }
  document.addEventListener('input', capture); document.addEventListener('change', capture);
  document.addEventListener('submit', event => {
    const form = event.target; if (!form.id.startsWith('staff-')) return; event.preventDefault(); capture(event);
    const data = Object.fromEntries(new FormData(form)), p = projects.find(p => p.id === form.dataset.project);
    if (form.id === 'staff-filter-form') { const q = new URLSearchParams(); for (const [k, v] of Object.entries(data)) if (v.trim()) q.set(k, v.trim()); const hash = '#' + state.path + (q.size ? '?' + q : ''); if (location.hash === hash) refresh(); else location.hash = hash; return; }
    if (!p) return;
    if (form.id === 'staff-assignment-form') { p.manager = data.manager; p.status = data.status; state.log.push(`${p.title} · 담당자·진행 단계 반영`); toast('운영 정보를 체험 프로젝트에 반영했어요.'); }
    if (form.id === 'staff-message-form') { if (!data.text.trim()) { toast('안내 내용을 공백 없이 입력해 주세요.'); return; } p.messages.push(message(data.text.trim())); state.notes[p.id] = ''; toast('의뢰자와 같은 프로젝트 대화에 메모를 남겼어요.'); }
    if (form.id === 'staff-proposal-form') {
      if (p.status === '초안') return;
      if (!data.title.trim() || !data.direction.trim() || !data.scope.trim()) { toast('제목·홍보 방향·작업 범위를 공백 없이 작성해 주세요.'); return; }
      const previous = p.latestVersion || (p.proposal ? p.version : 'v0.0'); const version = `v${Number(previous.match(/\d+/)?.[0] || 0) + 1}.0`;
      p.proposalEntries ||= []; p.proposalEntries.push({ ...data, version }); p.latestVersion = version; p.version = version; p.proposal = true; p.reviewed = false; p.status = '제안 검토'; state.assignments[p.id].status = p.status;
      const document = doc(data.title.trim(), '제안서', `홍보 방향\n${data.direction}\n\n작업 범위\n${data.scope}\n\n협업 조건\n${data.conditions || '상세 조건 협의'}\n\n비용 안내\n${data.cost || '세부 범위 확인 후 협의'}\n\n화면 체험용 검토본 · 실제 견적 아님`); document.version = version; p.documents.unshift(document); p.messages.push(message(`새 검토본 ${version} · ${data.title.trim()}을 체험 프로젝트에 공유했습니다.`)); state.log.push(`${p.title} · 검토본 ${version} 공유`); toast('새 검토본을 의뢰자 제안서와 문서함에 연결했어요.');
    }
    const y = scrollY; refresh(); window.scrollTo(0, y); state.outlet.querySelector('h1')?.focus({ preventScroll: true });
  });
  return { render };
}
