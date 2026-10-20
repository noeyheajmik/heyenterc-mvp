import { createCoordination } from './coordination.js';

import { createBudgetEditor } from './budget.js';

export function createProduction({ projects, icon, esc, toast, message, doc, shell, log, hub, profiles }) {
  const state = { project: null, tab: '', taskDrafts: {}, peopleDrafts: {}, deliveryDrafts: {} };
  const budgetEditor = createBudgetEditor({ projects, icon, esc, toast, message, doc, layout, log });
  const coordination = createCoordination({ hub, profiles, projects, icon, esc, toast, message, log, refresh });
  const blankTask = () => ({ id: '', title: '', date: '', due: '', stage: '예정' });
  const blankPerson = () => ({ id: '', name: '', kind: '제작 파트너', role: '', status: '후보 검토' });
  const blankDelivery = () => ({ id: '', title: '', kind: '영상', scope: '', date: '' });
  const link = (p, tab = '') => `#/staff/projects/${p.id}${tab ? '/' + tab : ''}`;
  const text = value => esc(value).replaceAll('\n', '<br>');
  const field = (id, label, name, value, required = false, type = 'text') => `<div class="field"><label for="${id}">${label}${required ? ' *' : ' · 선택'}</label><input class="input" id="${id}" name="${name}" type="${type}" maxlength="${type === 'date' ? '' : '100'}" value="${esc(value)}" ${required ? 'required' : ''}></div>`;
  const select = (id, label, name, values, value) => `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${name}">${values.map(v => `<option ${v === value ? 'selected' : ''}>${v}</option>`).join('')}</select></div>`;
  const empty = text => `<p class="ws-muted production-empty">${text}</p>`;
  function ensure(p) { p.tasks.forEach(t => { t.id ||= crypto.randomUUID(); }); p.participants ||= []; p.deliverables ||= []; }
  function tabs(p, active) { return `<nav class="production-tabs" aria-label="운영 프로젝트 메뉴">${[['', '브리프·제안'], ['schedule', '일정·결과물'], ['people', '참여자'], ['budget', '예산']].map(([id, title]) => `<a href="${link(p, id)}" ${id === active ? 'aria-current="page"' : ''}>${title}</a>`).join('')}</nav>`; }
  function layout(p, tab, body) {
    shell(`<a class="text-link collab-back" href="#/staff/projects">전체 프로젝트 ${icon('arrow')}</a><div class="ws-heading"><div><span class="eyebrow">KEEP EVERY DETAIL CONNECTED</span><h1 tabindex="-1">${esc(p.title)}</h1><p>${esc(p.region)} · ${esc(p.goal)}</p></div><a class="btn secondary" href="#/workspace/projects/${p.id}/${tab === 'people' ? 'people' : tab === 'budget' ? 'budget' : 'schedule'}">의뢰자 화면 확인 ${icon('up-right')}</a></div>${tabs(p, tab)}${body}`, 'projects');
  }
  function schedule(p) {
    const d = state.taskDrafts[p.id] ||= blankTask();
    const delivery = state.deliveryDrafts[p.id] ||= blankDelivery();
    layout(p, 'schedule', `<div class="collab-detail-grid"><div><section class="ws-panel"><div class="ws-panel-heading"><h2>제작 일정</h2><span class="ws-small-label">${p.tasks.filter(t => t.stage === '완료').length} / ${p.tasks.length} 완료</span></div>${p.tasks.length ? `<div class="production-rows">${p.tasks.map(t => `<article><span class="network-glyph">${icon(t.stage === '완료' ? 'check' : 'folder')}</span><div><h3>${esc(t.title)}</h3><p>${esc(t.date || t.due || '일정 협의')} · ${t.stage}</p></div><button class="production-edit" data-production-task="${t.id}" aria-label="${esc(t.title)} 수정">수정 ${icon('pen')}</button></article>`).join('')}</div>` : empty('등록한 일정이 없습니다. 첫 제작 일정을 추가해 보세요.')}</section><section class="ws-panel"><span class="eyebrow">REVIEW THE NEXT VERSION</span><h2>결과물 검토메모</h2><p class="ws-muted">실제 파일 대신 결과물의 구성과 확인할 내용을 공유하는 체험입니다.</p>${p.deliverables.length ? p.deliverables.map(item => `<article class="production-delivery"><div class="production-delivery-top"><span class="network-glyph">${icon('file')}</span><div><h3>${esc(item.title)}</h3><p>${item.kind} · 검토메모 v${item.revision}.0</p></div></div><span class="collab-status">${item.status}</span><p>${text(item.scope)}</p>${item.reviewNote ? `<div class="production-feedback"><strong>의뢰자 의견</strong><p>${text(item.reviewNote)}</p></div>` : ''}${item.history?.length ? `<details class="production-history"><summary>지난 검토 기록 ${item.history.length}개 ${icon('chevron')}</summary>${item.history.map(record => `<div><strong>v${record.revision}.0 · ${record.status}</strong><p>${text(record.scope)}</p>${record.reviewNote ? `<p><b>의뢰자 의견</b><br>${text(record.reviewNote)}</p>` : ''}</div>`).join('')}</details>` : ''}<button class="btn secondary" data-production-delivery="${item.id}">다음 검토메모 작성 ${icon('pen')}</button></article>`).join('') : empty('아직 공유한 결과물 검토메모가 없습니다.')}</section></div><div><section class="ws-panel"><span class="eyebrow">PLAN THE NEXT STEP</span><h2>${d.id ? '제작 일정 수정' : '제작 일정 추가'}</h2><form id="production-task-form" data-project="${p.id}">${field('production-task-title', '할 일·결과물 이름', 'title', d.title, true)}${field('production-task-date', '목표 날짜', 'date', d.date, false, 'date')}${field('production-task-due', '일정 안내', 'due', d.due)}${select('production-task-stage', '진행 상태', 'stage', ['예정', '진행 중', '검토 중', '완료'], d.stage)}<div class="production-form-actions"><button class="btn primary full-width" type="submit">${d.id ? '일정 수정 반영' : '일정 추가'} · 체험 ${icon('check')}</button>${d.id ? '<button class="text-link" type="button" data-production-reset="task">수정 취소</button>' : ''}</div></form></section><section class="ws-panel"><span class="eyebrow">SHARE A REVIEW NOTE</span><h2>검토메모 ${delivery.id ? '보완하기' : '공유하기'}</h2><form id="production-delivery-form" data-project="${p.id}">${field('production-delivery-title', '검토메모 제목', 'title', delivery.title, true)}${select('production-delivery-kind', '결과물 분야', 'kind', ['영상', '디자인', '인쇄', '보도 콘텐츠', '공연·출연', '기타'], delivery.kind)}${field('production-delivery-date', '희망 확인일', 'date', delivery.date, false, 'date')}<div class="field"><label for="production-delivery-scope">구성과 확인할 내용 *</label><textarea class="input" id="production-delivery-scope" name="scope" maxlength="2000" required>${esc(delivery.scope)}</textarea></div><button class="btn primary full-width" type="submit">검토메모 공유 · 체험 ${icon('arrow')}</button>${delivery.id ? '<button class="text-link production-cancel" type="button" data-production-reset="delivery">새 검토메모로 전환</button>' : ''}<p class="fine-print collab-form-note">의뢰자의 일정·결과물 탭과 문서함에 연결됩니다. 실제 납품 파일은 아닙니다.</p></form></section></div></div>`);
  }
  function people(p) {
    const d = state.peopleDrafts[p.id] ||= blankPerson();
    layout(p, 'people', `<div class="coordination-shortcut"><p>함께할 후보의 역할과 가능 조건을 먼저 확인해 보세요.</p><button class="btn secondary" type="button" data-coordination-focus>협업 요청 구성하기 ${icon('arrow')}</button></div><div class="collab-detail-grid"><section class="ws-panel"><span class="eyebrow">THE PEOPLE BEHIND THE STORY</span><h2>프로젝트 참여자</h2><div class="production-owner">${icon('person')}<div><strong>${esc(p.manager || '담당 매니저 미배정')}</strong><p>헤이엔터씨 · 프로젝트 운영</p></div></div>${p.participants.length ? `<div class="production-rows">${p.participants.map(person => `<article><span class="network-glyph">${icon(person.kind === '아티스트' ? 'mic' : 'person')}</span><div><h3>${esc(person.name)}</h3><p>${person.kind} · ${esc(person.role)}</p><span class="collab-status">${person.status}</span></div><button class="production-edit" data-production-person="${person.id}" aria-label="${esc(person.name)} 수정">수정 ${icon('pen')}</button></article>`).join('')}</div>` : empty('제작 파트너나 아티스트를 추가하고 맡은 역할을 정리해 보세요.')}<p class="fine-print collab-form-note">입력한 이름과 상태는 가상 참여자 정보입니다. 실제 섭외·계약이나 계정 초대는 이루어지지 않습니다.</p></section><section class="ws-panel"><span class="eyebrow">THE RIGHT ROLE, CLEARLY</span><h2>${d.id ? '참여자 정보 수정' : '참여자 추가'}</h2><form id="production-person-form" data-project="${p.id}">${field('production-person-name', '이름·팀명', 'name', d.name, true)}${select('production-person-kind', '참여 유형', 'kind', ['제작 파트너', '아티스트'], d.kind)}${field('production-person-role', '담당 역할', 'role', d.role, true)}${select('production-person-status', '참여 상태', 'status', ['후보 검토', '조건 협의', '참여 예정', '참여 중', '참여 종료'], d.status)}<button class="btn primary full-width" type="submit">${d.id ? '참여자 수정 반영' : '참여자 추가'} · 체험 ${icon('check')}</button>${d.id ? '<button class="text-link production-cancel" type="button" data-production-reset="person">수정 취소</button>' : ''}</form></section></div>${coordination.render(p)}`);
  }
  function render(id, tab) { const p = projects.find(p => p.id === id); if (!p) return false; ensure(p); state.project = p; state.tab = tab; if (tab === 'schedule') schedule(p); else if (tab === 'budget') budgetEditor.render(p); else people(p); return true; }
  function refresh() { render(state.project.id, state.tab); }
  function capture(event) {
    const form = event.target.closest('form'); if (!form?.id.startsWith('production-')) return;
    const maps = { 'production-task-form': state.taskDrafts, 'production-person-form': state.peopleDrafts, 'production-delivery-form': state.deliveryDrafts };
    if (maps[form.id]) Object.assign(maps[form.id][form.dataset.project], Object.fromEntries(new FormData(form)));
  }
  document.addEventListener('input', capture); document.addEventListener('change', capture);
  document.addEventListener('click', event => {
    const el = event.target.closest('[data-production-task],[data-production-person],[data-production-delivery],[data-production-reset]'); if (!el) return;
    const p = state.project;
    if (el.dataset.productionTask) state.taskDrafts[p.id] = { ...blankTask(), ...p.tasks.find(t => t.id === el.dataset.productionTask) };
    if (el.dataset.productionPerson) state.peopleDrafts[p.id] = { ...p.participants.find(t => t.id === el.dataset.productionPerson) };
    if (el.dataset.productionDelivery) state.deliveryDrafts[p.id] = { ...p.deliverables.find(t => t.id === el.dataset.productionDelivery) };
    if (el.dataset.productionReset === 'task') state.taskDrafts[p.id] = blankTask();
    if (el.dataset.productionReset === 'person') state.peopleDrafts[p.id] = blankPerson();
    if (el.dataset.productionReset === 'delivery') state.deliveryDrafts[p.id] = blankDelivery();
    refresh(); const selector = state.tab === 'people' ? '#production-person-name' : el.dataset.productionDelivery || el.dataset.productionReset === 'delivery' ? '#production-delivery-title' : '#production-task-title'; document.querySelector(selector)?.focus();
  });
  document.addEventListener('submit', event => {
    const form = event.target; if (!form.id.startsWith('production-')) return; event.preventDefault(); capture(event);
    const p = state.project;
    if (form.id === 'production-task-form') {
      const d = state.taskDrafts[p.id]; if (!d.title.trim()) { toast('일정 이름을 공백 없이 작성해 주세요.'); return; }
      const item = { ...d, id: d.id || crypto.randomUUID(), title: d.title.trim() }; const index = p.tasks.findIndex(t => t.id === d.id); if (index < 0) p.tasks.push(item); else p.tasks[index] = item;
      state.taskDrafts[p.id] = blankTask(); log.push(`${p.title} · 제작 일정 반영`); toast('의뢰자 화면과 같은 제작 일정에 반영했어요.');
    }
    if (form.id === 'production-person-form') {
      const d = state.peopleDrafts[p.id]; if (!d.name.trim() || !d.role.trim()) { toast('이름과 담당 역할을 공백 없이 작성해 주세요.'); return; }
      const item = { ...d, id: d.id || crypto.randomUUID(), name: d.name.trim(), role: d.role.trim() }; const index = p.participants.findIndex(t => t.id === d.id); if (index < 0) p.participants.push(item); else p.participants[index] = item;
      state.peopleDrafts[p.id] = blankPerson(); log.push(`${p.title} · 참여자 역할 반영`); toast('참여자 정보를 의뢰자 화면에 함께 반영했어요.');
    }
    if (form.id === 'production-delivery-form') {
      const d = state.deliveryDrafts[p.id]; if (!d.title.trim() || !d.scope.trim()) { toast('제목과 검토 내용을 공백 없이 작성해 주세요.'); return; }
      const old = p.deliverables.find(t => t.id === d.id); const revision = (old?.revision || 0) + 1;
      const item = { id: old?.id || crypto.randomUUID(), title: d.title.trim(), kind: d.kind, scope: d.scope.trim(), date: d.date, revision, status: '확인 대기', reviewNote: '', history: [...(old?.history || []), ...(old ? [{ revision: old.revision, status: old.status, reviewNote: old.reviewNote, scope: old.scope }] : [])] };
      const index = p.deliverables.findIndex(t => t.id === item.id); if (index < 0) p.deliverables.unshift(item); else p.deliverables[index] = item;
      const file = doc(item.title, '결과물 검토메모', `결과물 분야: ${item.kind}\n희망 확인일: ${item.date || '일정 협의'}\n\n확인할 내용\n${item.scope}\n\n화면 체험용 메모 · 실제 납품 파일 아님`); file.version = `v${revision}.0`; p.documents.unshift(file); p.messages.push(message(`결과물 검토메모 ${item.title} · v${revision}.0을 공유했습니다. 일정·결과물 탭에서 확인해 주세요.`));
      state.deliveryDrafts[p.id] = blankDelivery(); log.push(`${p.title} · 결과물 검토메모 v${revision}.0 공유`); toast('검토메모를 의뢰자 화면과 문서함에 연결했어요.');
    }
    refresh(); const h = document.querySelector('.staff-shell h1'); h?.focus({ preventScroll: true }); window.scrollTo(0, 0);
  });
  return { render, tabs };
}
