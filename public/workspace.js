import { planningPath } from './mvp.js';
import { campaignForm, campaignRows, campaignText, normalizeCampaign } from './campaign-brief.js';
import { campaignPreset } from './campaign-templates.js';
import { CLIENT_TYPES, clientType, clientOrganization, projectDraft } from './client-types.js';
import { projectOverview } from './overview.js';

import { unreadMessages, markConversationRead, conversationQuery, selectConversations } from './conversations.js';

import { documentTypes, documentLibraryOptions, documentLibraryQuery, selectDocuments } from './document-library.js';

import { PROJECT_STATUSES, PROJECT_SORTS, projectListOptions, projectListQuery, selectProjects } from './project-list.js';

import { clientActions, ACTION_TYPES } from './actions.js';

import { createBriefUpdates } from './brief-updates.js';

import { createClientSettings } from './settings.js';

import { createReports } from './reports.js';

import { clientBudget, budgetTotals, won } from './budget.js';

import { createStaff } from './staff.js';

const BUDGETS = ['미정', '500만원 미만', '500만~1,000만원', '1,000만~3,000만원', '3,000만~5,000만원', '5,000만원 이상'];
const GOALS = ['관광·지역 프로젝트', '축제·행사', '브랜드·콘텐츠'];
const TABS = [['proposals','제안서'],['schedule','일정'],['documents','문서'],['deliverables','결과물']];

export function createWorkspace({ icon, esc, services, toast, showModal, closeMenus, hub, profiles }) {
  const message = (text, who = 'manager') => ({ id: crypto.randomUUID(), text, who, at: who === 'manager' ? '담당자' : '기록' });
  const doc = (title, kind, text) => ({ id: crypto.randomUUID(), title, kind, text, version: 'v1.0' });
  const projects = [
    { id: 'autumn', title: '우리 지역, 가을 여행 캠페인', region: '전남 · 지역', goal: GOALS[0], budget: BUDGETS[3], date: '', status: '제안 검토', services: ['video', 'creator'], notes: '지역의 숨은 산책길과 머물고 싶은 공간을 여행 콘텐츠로 소개하고 싶어요. 주 시청자는 주말 여행을 계획하는 20~40대입니다.', manager: '콘텐츠 매니저 · 담당자', tasks: [{ title: '브리프와 제작 범위 확인', stage: '완료', due: '1단계' }, { title: '프로젝트 구성안 검토', stage: '검토 중', due: '2단계' }, { title: '촬영 일정과 출연 조건 협의', stage: '예정', due: '협의 후' }, { title: '시안 및 결과물 검토', stage: '예정', due: '제작 후' }], messages: [message('관광 콘텐츠와 크리에이터 협업을 함께 검토하는 제안서를 준비했어요. 영상의 활용 채널과 우선할 결과물을 확인해 주세요.'), message('기관 SNS와 홈페이지에서 활용하고 싶어요. 짧은 콘텐츠도 함께 검토해 주세요.', 'me')], documents: [doc('캠페인 브리프', '브리프', '목적: 지역 관광 자원의 인지도 향상\n대상: 주말 여행을 계획하는 20~40대\n관심 분야: 영상 제작, 크리에이터 협업\n검토 예산: 1,000만~3,000만원 · VAT 포함'), doc('여행 콘텐츠 구성안', '제안서', '지역의 한 가지 매력을 중심으로 여행 동선과 이야기를 구성합니다.\n주제 영상과 짧은 파생 콘텐츠의 편수·길이는 협의합니다.\n출연·촬영 일정과 2차 활용 조건을 확인해야 합니다.\n실제 계약·견적은 아닌 제안입니다.')], proposal: true, reviewed: false, reviewedVersions: [], feedback: '', version: 'v2.0', latestVersion: 'v2.0' },
    { id: 'festival', title: '가을 로컬 페스티벌 프로젝트', region: '지역 협의', goal: GOALS[1], budget: BUDGETS[4], date: '', status: '제작 진행', services: ['festival', 'artist', 'print', 'video'], notes: '공연과 로컬 브랜드가 어우러지는 축제의 사전 제작물과 현장 기록을 준비합니다.', manager: '행사 매니저 · 담당자', tasks: [{ title: '프로젝트 콘셉트 정리', stage: '완료', due: '1단계' }, { title: '키비주얼 시안 검토', stage: '검토 중', due: '2단계' }, { title: '출연진·현장 조건 확인', stage: '예정', due: '확인 후' }], messages: [message('키비주얼 시안을 검토하는 단계의 프로젝트 예시입니다. 일정과 결과물 탭에서 검토 의견을 남겨보세요.')], documents: [doc('축제 프로젝트 기획 메모', '기획', '축제의 주제와 관객을 먼저 정리합니다.\n공연·진행·제작물·기록 영상의 업무 범위를 나눠 검토합니다.\n이 내용은 프로젝트 예시의 구성 예시입니다.')], proposal: true, reviewed: true, reviewedVersions: ['v1.0'], feedback: '', version: 'v1.0', latestVersion: 'v1.0' },
    { id: 'local-brand', title: '로컬 브랜드 스토리 콘텐츠', region: '지역 미정', goal: GOALS[2], budget: BUDGETS[0], date: '', status: '초안', services: ['press', 'video'], notes: '브랜드의 시작과 만드는 사람의 이야기를 콘텐츠로 정리하고 싶어요.', manager: '', tasks: [], messages: [], documents: [], proposal: false, reviewed: false, feedback: '', version: 'v1.0' }
  ];
  const briefUpdates = createBriefUpdates({ projects, budgets: BUDGETS, icon, esc, toast, doc, message });
  const reports = createReports({ projects, icon, esc, toast, doc, message });
  const staff = createStaff({ reports, briefUpdates, projects, icon, esc, toast, message, doc, hub, profiles });
  const state = { role: 'company', next: '/workspace/projects', outlet: null, path: '', params: null, q: '', filter: '전체', sort: 'recent', draft: null, step: 0, context: false, messageDrafts: {}, feedbackDrafts: {}, deliveryDrafts: {}, costReviewDrafts: {} };
  const settings = createClientSettings({ icon, esc, toast, getRole: () => state.role, refresh });
  projects.forEach(p => { p.client = { ...settings.current('institution'), role: 'institution' }; });
  const newDraft = () => projectDraft(state.role, settings.current(state.role));
  const nav = path => { closeMenus(); document.querySelector('#modal')?.close(); if (location.hash === `#${path}`) render(state.outlet, path.split('?')[0], new URLSearchParams(path.split('?')[1])); else location.hash = path; };
  const href = (p, tab = 'proposals') => `#/workspace/projects/${p.id}/${tab}`;
  const owner = () => esc(settings.current(state.role).organization || settings.current(state.role).displayName);
  const badge = status => `<span class="ws-badge ${status === '제안 검토' ? 'review' : status === '제작 진행' ? 'working' : status === '초안' ? 'draft' : ''}">${status}</span>`;
  const names = ids => ids.map(id => services.find(s => s.id === id)?.name).filter(Boolean).join(' · ') || '함께 정할게요';
  const heading = (kicker, title, text, action = '') => `<div class="ws-heading"><div><span class="eyebrow">${kicker}</span><h1 tabindex="-1">${title}</h1>${text ? `<p>${text}</p>` : ''}</div>${action}</div>`;
  const empty = (title, text, action = '') => `<div class="ws-empty">${icon('folder')}<h2>${title}</h2><p>${text}</p>${action}</div>`;
  function account() {
    document.title = '워크스페이스 — 헤이엔터씨';
    state.outlet.innerHTML = `<div class="ws-entry container"><div><span class="eyebrow">YOUR PROJECT, ALL CONNECTED</span><h1 tabindex="-1">우리 프로젝트의 모든 과정,<br>하나의 워크스페이스에서.</h1><p>제안서와 일정, 문서와 결과물이 이어지는<br> 헤이엔터씨에서 프로젝트의 모든 과정을 관리하세요.</p><div class="ws-entry-preview"><span>${icon('folder')} PROJECT WORKSPACE</span><div><i></i>제안서<strong>일정 · 문서</strong>결과물</div><p>필요한 정보는 가까이,<br>프로젝트의 흐름은 명확하게.</p></div></div><section class="ws-entry-card"><div class="ui-account-actions"><a href="#/login">로그인</a><a href="#/signup">회원가입</a></div><h2>어떤 입장에서 시작할까요?</h2><p>의뢰 목적에 맞는 업무 공간으로 시작하세요.</p>${Object.entries(CLIENT_TYPES).map(([role, type]) => `<button data-ws-role="${role}">${icon(type.glyph)}<span><strong>${type.label}</strong><small>${role === 'company' ? '제품 영상·캠페인·모델 협업과 제작 과정 관리' : role === 'institution' ? '관광·축제·정책 프로젝트와 진행 과정 관리' : '매장·창작 콘텐츠와 행사에 필요한 사람 연결'}</small></span>${icon('arrow')}</button>`).join('')}<a class="text-link" href="#/home">서비스 먼저 둘러보기 ${icon('arrow')}</a></section></div>`;
  }
  function shell(content, active = 'home') {
    document.body.classList.add('workspace-mode');
    state.outlet.innerHTML = `<div class="ws-shell"><header class="ws-topbar"><a class="ws-logo" href="#/home" aria-label="헤이엔터씨 홈"><img src="./assets/logo-green.png" alt="hey! enter c" width="160" height="40"></a><span class="ws-top-title">PROJECT WORKSPACE</span><a class="ws-public-link" href="#/home">서비스 사이트 ${icon('up-right')}</a><button class="ws-avatar" data-ws-action="profile" aria-label="계정 정보">${clientType(state.role).avatar}</button></header><div class="ws-sidebar"><div class="ws-organization">${icon(clientType(state.role).glyph)}<div><strong>${owner()}</strong><span>${clientType(state.role).workspace}</span></div></div><nav aria-label="워크스페이스 메뉴">${[['projects', '/workspace/projects', 'folder', '내 프로젝트'], ['settings', '/workspace/settings', 'person', '계정 정보']].map(([id, path, glyph, label]) => `<a href="#${path}" ${active === id ? 'aria-current="page"' : ''}>${icon(glyph)}${label}${id === 'projects' ? `<span>${projects.length}</span>` : id === 'actions' && clientActions(projects).length ? `<span>${clientActions(projects).length}</span>` : id === 'messages' && projects.some(p => unreadMessages(p).length) ? `<span aria-label="미확인 메시지 ${projects.reduce((sum, p) => sum + unreadMessages(p).length, 0)}개">${projects.reduce((sum, p) => sum + unreadMessages(p).length, 0)}</span>` : ''}</a>`).join('')}</nav><a class="btn primary" href="#${planningPath({client:state.role,goal:state.role==='institution'?'관광·지역 프로젝트':'브랜드·콘텐츠'})}">${icon('plus')}새 프로젝트</a><div class="ws-side-note"><strong>작은 아이디어도 좋아요.</strong><p>목표와 필요한 결과물부터<br>차근차근 정리해 보세요.</p><a href="#/references">사례에서 영감 얻기 ${icon('arrow')}</a><a href="#/workspace/settings">${clientType(state.role).accountTitle} ${icon('person')}</a></div><button class="ws-exit" data-ws-action="exit">워크스페이스 나가기 ${icon('up-right')}</button></div><div class="ws-main"><div class="ws-content">${content}</div></div></div>`;
  }
  function projectRows(items) {
    const { counts } = selectProjects(projects);
    return items.map(p => `<a class="ws-project-row" href="${href(p, 'proposals')}"><span class="ws-project-symbol">${icon('folder')}</span><div><strong>${esc(p.title)}</strong><span>${esc(p.region)} · ${names(p.services)}</span>${counts.get(p.id) ? `<small class="project-attention">${icon('check')}확인할 일 ${counts.get(p.id)}개</small>` : p.status === '초안' ? '<small class="project-draft-hint">초안 이어쓰기</small>' : ''}</div>${badge(p.status)}<div class="ws-row-budget"><span>검토 예산 · VAT 포함</span><strong>${esc(p.budget)}</strong></div>${icon('arrow')}</a>`).join('');
  }
  function actionRows(items) {
    return items.map(item => `<a class="ws-action-row" href="#/workspace/projects/${item.projectId}/${item.tab}" ${item.kind === 'proposal' ? `data-ws-latest="${item.projectId}"` : ''}><span>${icon(item.glyph)}</span><div><small class="action-kind">${ACTION_TYPES[item.kind]}</small><strong>${item.title}</strong><p>${esc(item.projectTitle)} · ${esc(item.detail)}</p></div>${icon('arrow')}</a>`).join('');
  }
  function actionsPage(params) {
    document.title = '확인할 일 — 헤이엔터씨';
    const type = Object.hasOwn(ACTION_TYPES, params.get('type')) ? params.get('type') : 'all';
    const project = projects.some(p => p.id === params.get('project') && !['초안', '완료'].includes(p.status)) ? params.get('project') : '';
    const all = clientActions(projects), scoped = all.filter(item => !project || item.projectId === project);
    const items = scoped.filter(item => type === 'all' || item.kind === type);
    const filterLink = key => '#/workspace/actions?' + new URLSearchParams({ type: key, ...(project ? { project } : {}) });
    shell(`${heading('YOUR NEXT STEP, CLEARLY', '확인할 일', '새 검토본과 회신을 확인하고 다음 단계로 이어가세요.')}<div class="action-tools"><div class="field"><label for="action-project">프로젝트</label><select id="action-project"> <option value="">전체 프로젝트</option>${projects.filter(p => !['초안', '완료'].includes(p.status)).map(p => `<option value="${p.id}" ${p.id === project ? 'selected' : ''}>${esc(p.title)}</option>`).join('')}</select></div><nav class="action-filters" aria-label="확인할 일 유형">${Object.entries(ACTION_TYPES).map(([key, title]) => `<a href="${filterLink(key)}" ${type === key ? 'aria-current="page"' : ''}>${title}<span>${scoped.filter(item => key === 'all' || item.kind === key).length}</span></a>`).join('')}</nav></div><div class="action-result-count" role="status">${items.length}개의 확인할 일</div><section class="ws-panel action-list">${items.length ? actionRows(items) : empty(all.length ? '이 조건에는 확인할 일이 없어요.' : '지금 확인할 일을 모두 마쳤어요.', all.length ? '다른 유형이나 프로젝트를 선택해 보세요.' : '새 제안·예산·결과물 메모 또는 브리프 회신이 공유되면 여기에 표시됩니다.', all.length ? '<a class="btn secondary" href="#/workspace/actions">전체 확인할 일 보기</a>' : '<a class="btn secondary" href="#/workspace/projects">프로젝트 살펴보기</a>')}</section><p class="fine-print action-disclosure">검토 의견을 남기거나 브리프 회신을 확인하면 목록에서 빠집니다. 새 검토본·수정 회신이 공유되면 다시 표시됩니다. 초안·완료 프로젝트는 제외합니다.</p>`, 'actions');
  }
  function campaignStarters() {
    if (state.role === 'institution') return '';
    return `<section class="workspace-campaigns"><div class="ws-panel-heading"><div><span class="eyebrow">FROM YOUR BUSINESS GOAL</span><h2>어떤 캠페인을 준비하나요?</h2><p>목표에 가까운 유형에서 브리프를 시작하세요.</p></div></div><div>${['launch', 'creator', 'brand-event'].map(key => { const t = campaignPreset(key); return `<a href="#/workspace/new?template=${key}" data-ws-template="${key}"><span class="network-glyph">${icon(key === 'creator' ? 'spark' : key === 'launch' ? 'film' : 'mic')}</span><h3>${t.title}</h3><p>${t.summary}</p><span class="text-link">브리프 시작 ${icon('arrow')}</span></a>`; }).join('')}</div></section>`;
  }
  function dashboard() {
    document.title = '업무 홈 — 헤이엔터씨';
    const pending = clientActions(projects);
    shell(`${heading('YOUR NEXT STORY', '반가워요, ' + owner() + '님.', state.role === 'institution' ? '우리 지역의 다음 이야기를 함께 만들어가요.' : '브랜드와 아이디어가 고객을 만나는 과정을 함께 만들어요.', '<a class="btn primary" href="#' + planningPath({client:state.role,goal:state.role === 'institution' ? '관광·지역 프로젝트' : '브랜드·콘텐츠'}) + '">새 프로젝트 만들기 ' + icon('plus') + '</a>')}<div class="ws-stats">${[['진행 중인 프로젝트', projects.filter(p => !['초안', '완료'].includes(p.status)).length, 'projects', '?status=진행 중'], ['확인할 일', pending.length, 'actions', ''], ['작성 중인 초안', projects.filter(p => p.status === '초안').length, 'projects', '?status=초안']].map(([label, count, route, query]) => `<a href="#/workspace/${route}${query}"><span>${label}</span><strong>${count}<small>개</small></strong>${icon('arrow')}</a>`).join('')}</div>${campaignStarters()}<div class="ws-home-columns"><section class="ws-panel ws-todo"><div class="ws-panel-heading"><h2>먼저 확인해 주세요.</h2><a class="text-link" href="#/workspace/actions">전체 보기 ${icon('arrow')}</a></div>${pending.length ? actionRows(pending.slice(0, 4)) : '<p class="ws-muted">지금 확인할 일을 모두 마쳤어요. 새 검토본과 회신이 공유되면 여기에 표시됩니다.</p>'}</section><aside class="ws-start-card"><span class="eyebrow">MAKE IT A GOOD START</span><h2>무엇부터<br>준비하면 좋을까요?</h2><p>목표 고객과 결과물, 유료 광고 활용 여부를 정리하면<br>제안을 더 구체적으로 살펴볼 수 있어요.</p><a class="text-link" href="#/budget">예산별 프로젝트 구성 살펴보기 ${icon('arrow')}</a></aside></div><section class="ws-panel"><div class="ws-panel-heading"><h2>이어서 진행할 프로젝트</h2><a class="text-link" href="#/workspace/projects">전체 보기 ${icon('arrow')}</a></div>${projectRows(projects.filter(p => p.status !== '완료').slice(0, 4))}</section>`, 'home');
  }
  function projectList(params) {
    const options = projectListOptions(params); state.q = options.q; state.filter = options.status; state.sort = options.sort;
    document.title = '내 프로젝트 — 헤이엔터씨';
    shell(`${heading('MY PROJECTS', '내 프로젝트', '아이디어부터 결과물까지, 프로젝트의 흐름을 한눈에.', '<a class="btn primary" href="#' + planningPath({client:state.role,goal:state.role === 'institution' ? '관광·지역 프로젝트' : '브랜드·콘텐츠'}) + '">새 프로젝트 ' + icon('plus') + '</a>')}<div class="project-list-tools"><div class="field"><label for="ws-project-search">프로젝트 검색</label><input class="input" id="ws-project-search" type="search" value="${esc(state.q)}" placeholder="프로젝트 이름 또는 지역" maxlength="100"></div><div class="field"><label for="ws-status-filter">프로젝트 상태</label><select id="ws-status-filter">${PROJECT_STATUSES.map(v => `<option ${v === state.filter ? 'selected' : ''}>${v}</option>`).join('')}</select></div><div class="field"><label for="ws-project-sort">정렬</label><select id="ws-project-sort">${Object.entries(PROJECT_SORTS).filter(([v])=>v!=='attention').map(([v, name]) => `<option value="${v}" ${v === state.sort ? 'selected' : ''}>${name}</option>`).join('')}</select></div></div><div class="project-list-caption"><div class="ws-result-count" id="ws-project-count" role="status" aria-live="polite"></div><button class="text-link" data-ws-action="clear-search">조건 초기화 ${icon('close')}</button></div><section class="ws-panel" id="ws-project-results"></section>`, 'projects');
    listResults();
  }
  function listResults() {
    const { items } = selectProjects(projects, { q: state.q, status: state.filter, sort: state.sort });
    state.outlet.querySelector('#ws-project-count').textContent = `전체 ${projects.length}개 중 ${items.length}개 프로젝트`;
    state.outlet.querySelector('#ws-project-results').innerHTML = items.length ? projectRows(items) : empty('조건에 맞는 프로젝트가 없어요.', '검색어나 상태를 바꾸거나 조건을 초기화해 보세요.', '<button class="btn secondary" data-ws-action="clear-search">검색 조건 초기화</button>');
  }
  function syncListQuery(push = false) {
    const params = projectListQuery({ q: state.q, status: state.filter, sort: state.sort });
    const hash = '#/workspace/projects' + (params.size ? '?' + params : '');
    if (location.hash !== hash) history[push ? 'pushState' : 'replaceState'](null, '', hash);
    state.params = params;
  }
  function wizard() {
    state.draft ||= newDraft(); const d = state.draft;
    document.title = '새 프로젝트 — 헤이엔터씨';
    const field = (label, id, input) => `<div class="field"><label for="${id}">${label}</label>${input}</div>`;
    const select = (name, values, value) => `<select class="input" id="ws-new-${name}" name="${name}">${values.map(v => `<option ${v === value ? 'selected' : ''}>${v}</option>`).join('')}</select>`;
    let fields;
    if (state.step === 0) fields = `<h2>어떤 이야기를 시작할까요?</h2><p class="ws-muted">프로젝트 이름과 활동 지역, 가장 중요한 프로젝트 목표를 알려주세요.</p>${field('프로젝트 이름 *', 'ws-new-title', `<input class="input" id="ws-new-title" name="title" maxlength="80" required value="${esc(d.title)}" placeholder="${state.role === 'institution' ? '예: 우리 지역, 봄 여행 콘텐츠' : '예: 신제품 론칭 영상, 매장 오픈 캠페인'}">`)}${field('진행 지역 *', 'ws-new-region', `<input class="input" id="ws-new-region" name="region" maxlength="60" required value="${esc(d.region)}" placeholder="예: 전국·온라인, 서울 성수, 전남 고흥">`)}${field('프로젝트 목표', 'ws-new-goal', select('goal', GOALS, d.goal))}`;
    else if (state.step === 1) fields = `<h2>필요한 조건을 정리해요.</h2><p class="ws-muted">미정인 항목은 함께 다듬어갈 수 있어요.</p><div class="form-row">${field('총 검토 예산 · VAT 포함', 'ws-new-budget', select('budget', BUDGETS, d.budget))}${field('희망 완료일 · 선택', 'ws-new-date', `<input class="input" id="ws-new-date" type="date" name="date" value="${esc(d.date)}">`)}</div><fieldset class="ws-service-field"><legend>관심 있는 필요한 서비스 · 복수 선택</legend><div class="planner-service-options">${services.map(s => `<label><input type="checkbox" name="service" value="${s.id}" ${d.services.includes(s.id) ? 'checked' : ''}><span>${icon(s.icon)}${s.name}${icon('check')}</span></label>`).join('')}</div></fieldset>${field('프로젝트 배경·참고 내용 · 선택', 'ws-new-notes', `<textarea class="input" id="ws-new-notes" name="notes" maxlength="2000" placeholder="제품·서비스, 출시·행사 일정, 참고 사례와 필요한 결과물을 알려주세요.">${esc(d.notes)}</textarea>`)}`;
    else if (state.step === 2) fields = campaignForm(d.campaign, esc);
    else fields = `<h2>요청 내용을 확인해 주세요.</h2><p class="ws-muted">아래 내용을 프로젝트로 생성합니다.</p>${briefSummary(d)}<div class="ws-note"><strong>목표와 활용 범위를 한 번 더 확인해 주세요.</strong><p>제작할 콘텐츠와 활용 채널, 희망 일정을 구체적으로 남기면 프로젝트 방향을 더 명확하게 정리할 수 있습니다.</p></div>`;
    shell(`${heading('START A NEW PROJECT', d.id ? '프로젝트 초안 이어쓰기' : '새 프로젝트', '좋은 프로젝트의 시작은, 좋은 질문에서.')}<ol class="ws-wizard-steps">${['기본 정보', '예산·분야', '캠페인 조건', '내용 확인'].map((t, i) => `<li ${state.step === i ? 'aria-current="step"' : ''}><span>${i + 1}</span>${t}</li>`).join('')}</ol><div class="ws-wizard-layout"><form class="ws-panel ws-wizard-form" id="ws-project-form">${fields}<div class="ws-wizard-actions"><div>${state.step ? '<button type="button" class="btn secondary" data-ws-action="wizard-prev">이전</button>' : '<a class="btn secondary" href="#/workspace/projects">목록으로</a>'}<button class="text-link" type="button" data-ws-action="save-draft">초안 저장</button></div><button type="submit" class="btn primary">${state.step === 3 ? '프로젝트 생성' : '다음 단계'} ${icon('arrow')}</button></div></form><aside class="ws-wizard-aside"><span class="eyebrow">A LITTLE HELP</span><h2>아직 결정되지<br>않아도 괜찮아요.</h2><p>필요한 결과물과 활용 채널을 먼저 생각해 보세요. 참고한 사례나 프로젝트 구성이 있다면 이야기 칸에 함께 남겨주세요.</p><a href="#/references" class="text-link">레퍼런스 둘러보기 ${icon('arrow')}</a><p class="ws-muted">목표와 예산, 참고 사례를 정리해 프로젝트를 준비하세요.</p></aside></div>`, 'projects');
  }
  function briefSummary(p) { return `<dl class="ws-brief-summary">${[['프로젝트', p.title || '이름 미정'], ['프로젝트 지역', p.region || '지역 미정'], ['의뢰 담당자', p.client?.displayName || '미정'], ['기관·브랜드', clientOrganization(p.client)], ...(p.client?.department ? [['부서·팀', p.client.department]] : []), ['프로젝트 목표', p.goal], ['검토 예산 · VAT 포함', p.budget], ['희망 완료일', p.date || '일정 협의'], ['관심 분야', names(p.services)], ['알리고 싶은 이야기', p.notes || '상담 시 함께 정리'], ...campaignRows(p.campaign)].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v).replaceAll('\n', '<br>')}</dd></div>`).join('')}</dl>`; }
  function overview(p) {
    const view = projectOverview(p);
    const metrics = [
      ['제작 일정', view.taskTotal ? `${view.taskDone} / ${view.taskTotal}` : '등록 전', view.taskTotal ? '등록한 일정 중 완료한 항목' : '일정과 제작 범위를 협의해요.', 'schedule', 'folder'],
      ['공유 예산', view.budget?.version || '공유 전', view.budget ? `${won(budgetTotals(view.budget).total)} · VAT 포함` : '공유한 예산 검토본이 없어요.', 'budget', 'file'],
      ['결과물', `${view.deliveries}개`, view.deliveries ? `확인 대기 ${view.deliveryPending}개 · 실제 납품 파일 아님` : '공유한 검토메모가 없어요.', 'schedule', 'check'],
      ['협업 참여자', `${view.participants}`, view.participants ? '연결한 참여자·팀 기준' : '연결한 제작 파트너·아티스트가 없어요.', 'people', 'person']
    ];
    const unread = unreadMessages(p).length;
    return `<section class="ws-panel ws-project-intro overview-intro"><span class="eyebrow">PROJECT OVERVIEW</span><h2>${view.title}</h2><p>${view.description}</p>${p.status === '초안' ? `<button class="btn primary" data-ws-edit="${p.id}">초안 이어쓰기 ${icon('pen')}</button>` : `<a class="btn secondary" href="${href(p, 'summary')}">진행 요약 보기 ${icon('file')}</a>`}</section>${view.actions.length ? `<section class="ws-panel overview-next-actions"><div class="ws-panel-heading"><h2>지금 확인할 내용</h2><a class="text-link" href="#/workspace/actions?project=${p.id}">전체 ${view.actions.length}개 보기 ${icon('arrow')}</a></div>${actionRows(view.actions.slice(0, 3))}</section>` : ''}<div class="overview-metrics">${metrics.map(([label, value, detail, tab, glyph]) => `<a href="${href(p, tab)}"><span class="network-glyph">${icon(glyph)}</span><span class="overview-metric-label">${label}</span><strong>${esc(value)}</strong><p>${esc(detail)}</p>${icon('arrow')}</a>`).join('')}</div><div class="ws-overview-grid"><section class="ws-panel"><div class="ws-panel-heading"><h2>프로젝트 진행</h2><a class="text-link" href="${href(p, 'schedule')}">일정 보기 ${icon('arrow')}</a></div>${timeline(p)}</section><section class="ws-panel"><div class="ws-panel-heading"><h2>최근 대화</h2><a class="text-link" href="${href(p, 'messages')}">대화 열기 ${icon('arrow')}</a></div>${unread ? `<p class="overview-unread">미확인 안내 ${unread}개가 있어요.</p>` : ''}${p.messages.length ? `<p class="ws-message-preview">${esc(p.messages.at(-1).text)}</p><span class="ws-muted">${p.messages.at(-1).who === 'me' ? '나' : '담당 매니저'} · ${p.messages.at(-1).at}</span>` : '<p class="ws-muted">아직 대화가 없습니다. 질문이나 전달할 내용을 먼저 남겨보세요.</p>'}</section></div>`;
  }
  function timeline(p) { return p.tasks.length ? `<ol class="ws-timeline">${p.tasks.map(t => `<li class="${t.stage === '완료' ? 'done' : ''}"><span>${icon(t.stage === '완료' ? 'check' : 'folder')}</span><div><strong>${esc(t.title)}</strong><p>${esc(t.date || t.due || '일정 협의')}</p></div><small>${t.stage}</small></li>`).join('')}</ol>` : '<p class="ws-muted">제작 범위를 확인한 뒤 단계별 일정을 정합니다. 현재 확정된 일정은 없습니다.</p>'; }
  function proposal(p) {
    if (!p.proposal) return empty('아직 공유된 제안서가 없어요.', '프로젝트 예시에서 구성안 검토 흐름을 살펴볼 수 있어요.', `<a class="btn secondary" href="#/workspace/projects/autumn/proposals">제안서 보기 ${icon('arrow')}</a>`);
    const old = p.version !== p.latestVersion;
    const versionReviewed = p.reviewedVersions?.includes(p.version);
    const custom = p.proposalEntries?.find(entry => entry.version === p.version);
    const versions = [...new Set([...(p.proposalEntries || []).map(entry => entry.version).reverse(), ...(p.latestVersion === 'v2.0' || p.proposalEntries?.length && p.proposalEntries[0].version !== 'v1.0' ? ['v2.0', 'v1.0'] : ['v1.0'])])];
    return `<section class="ws-panel ws-proposal"><div class="ui-proposal-links"></div><div class="ws-proposal-top"><div><span class="eyebrow">SAMPLE PROPOSAL</span><h2>${esc(custom?.title || p.title)}<br>프로젝트 구성 제안</h2></div><label>검토 버전<select class="input" id="ws-proposal-version">${versions.map(v => `<option ${p.version === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>${old ? '<div class="ws-note">이전 검토본입니다. 최신 버전은 ' + esc(p.latestVersion) + '입니다.</div>' : `<p class="ws-muted">${p.version} · ${p.latestVersion === 'v2.0' ? '결과물 활용 범위와 파생 콘텐츠 조건을 보완한' : '제작 범위를 검토하기 위한'} 구성입니다.</p>`}<div class="ws-proposal-section"><h3>01 · 프로젝트 방향</h3><p>${esc(custom?.direction || p.notes).replaceAll('\n', '<br>')}</p></div><div class="ws-proposal-section"><h3>02 · 제안 구성</h3>${custom ? `<p>${esc(custom.scope).replaceAll('\n', '<br>')}</p>` : ''}<div class="ws-deliverable-grid">${p.services.map(id => { const s = services.find(s => s.id === id); return `<div><span class="ws-service-glyph">${icon(s.icon)}</span><strong>${s.name}</strong><p>${s.examples[0]}</p><small>편수·인원·세부 범위 협의</small></div>`; }).join('')}</div></div><div class="ws-proposal-section"><h3>03 · 예산과 포함 조건</h3><dl class="ws-brief-summary"><div><dt>의뢰자의 검토 예산 · VAT 포함</dt><dd>${p.budget}</dd></div><div><dt>실제 제안 금액</dt><dd>${esc(custom?.cost || '상세 범위 확인 후 안내 · 미확정')}</dd></div><div><dt>별도 확인 사항</dt><dd>촬영·출연 일정, 이동·숙박, 결과물 편수, 원본과 2차 활용권, 수정 횟수</dd></div></dl></div><div class="ws-proposal-section"><h3>04 · ${old ? '우선 확인할 조건' : '변경·검토할 조건'}</h3><p>${esc(custom?.conditions || (old ? '소개할 장소와 우선할 영상 주제를 정합니다.' : '기관 SNS·홈페이지 활용 외 광고 집행 여부, 파생 콘텐츠의 편수와 길이를 함께 검토합니다.')).replaceAll('\n', '<br>')}</p></div><div class="ws-review-status" role="status">${versionReviewed ? icon('check') + ' 구성 검토 완료' : '제안의 구성과 범위를 확인하고 의견을 남겨주세요.'}</div><form id="ws-feedback-form" data-project="${p.id}" class="ws-feedback-form"><label for="ws-feedback">수정 의견 또는 확인할 질문</label><textarea class="input" id="ws-feedback" name="feedback" maxlength="2000" required placeholder="예: 짧은 콘텐츠를 우선하고 활용 기간을 확인하고 싶어요.">${esc(state.feedbackDrafts[p.id] || '')}</textarea><div><button class="btn secondary" type="submit">의견 남기기</button><button class="btn primary" type="button" data-ws-review="${p.id}" ${versionReviewed ? 'disabled' : ''}>${versionReviewed ? '검토 완료됨' : '구성 검토 완료'} ${icon('check')}</button></div><p class="fine-print">제안의 버전과 확인할 내용을 함께 정리해 주세요.</p></form></section>`;
  }
  function messages(p) { markConversationRead(p); return `<section class="ws-panel ws-conversation"><div class="ws-panel-heading"><div><h2>프로젝트 대화</h2><span class="ws-muted">${p.manager || '담당 매니저 배정 전'} · 고객과 담당자 맥락</span></div></div><div class="ws-message-list" aria-label="대화 내역">${p.messages.length ? p.messages.map(m => `<article class="ws-message ${m.who === 'me' ? 'mine' : ''}"><div class="ws-message-avatar">${m.who === 'me' ? '나' : 'H'}</div><div><header><strong>${m.who === 'me' ? esc(p.client?.displayName || '의뢰자') : '담당 매니저'}</strong><span>${m.at}</span></header><p>${esc(m.text).replaceAll('\n', '<br>')}</p></div></article>`).join('') : empty('첫 대화를 남겨보세요.', '아직 오가는 메시지가 없습니다.')}<div id="ws-message-end"></div></div><form class="ws-message-compose" id="ws-message-form" data-project="${p.id}"><label for="ws-message">프로젝트 메시지</label><textarea id="ws-message" name="message" class="input" maxlength="2000" required placeholder="전달할 내용이나 궁금한 점을 남겨주세요.">${esc(state.messageDrafts[p.id] || '')}</textarea><div><span>프로젝트의 맥락과 필요한 조건을 남겨주세요.</span><button class="btn primary" type="submit">메시지 남기기 ${icon('arrow')}</button></div></form></section>`; }
  function documents(p) { return `<section class="ws-panel"><div class="ws-panel-heading"><h2>프로젝트 문서</h2><button class="btn secondary small" data-ws-add-doc="${p.id}">자료 메모 추가 ${icon('plus')}</button></div>${p.documents.length ? `<div class="ws-documents">${p.documents.map(d => `<button class="ws-document-row" data-ws-doc="${d.id}" data-project="${p.id}">${icon('file')}<div><strong>${esc(d.title)}</strong><span>${d.kind} · ${d.version} · 텍스트 미리보기</span></div><span>열기 ${icon('arrow')}</span></button>`).join('')}</div>` : empty('아직 공유한 문서가 없어요.', '자료 메모를 추가해 필요한 정보를 한곳에 정리하세요.')}</section>`; }
  function deliveryReviews(p) {
    return `<section class="ws-panel"><div class="ws-panel-heading"><h2>결과물</h2><span class="ws-small-label">${p.deliverables?.length || 0}개</span></div><p class="ws-muted">공유된 결과물의 구성과 확인할 내용을 검토해 주세요.</p>${p.deliverables?.length ? p.deliverables.map(item => {
      const key = item.id + ':' + item.revision;
      return `<article class="production-delivery"><div class="production-delivery-top"><span class="network-glyph">${icon('file')}</span><div><h3>${esc(item.title)}</h3><p>${item.kind} · 검토메모 v${item.revision}.0 · ${esc(item.date || '확인 일정 협의')}</p></div></div><span class="collab-status">${item.status}</span><p>${esc(item.scope).replaceAll('\n', '<br>')}</p>${item.reviewNote ? `<div class="production-feedback"><strong>남긴 의견</strong><p>${esc(item.reviewNote).replaceAll('\n', '<br>')}</p></div>` : ''}<form class="production-review-form" id="ws-delivery-${item.id}" data-project="${p.id}" data-delivery="${item.id}" data-revision="${item.revision}"><label for="review-${item.id}">검토 의견 · 선택</label><textarea class="input" id="review-${item.id}" name="note" maxlength="2000" placeholder="구성·수정 범위 등 확인할 내용을 남겨주세요.">${esc(state.deliveryDrafts[key] || '')}</textarea><div class="production-review-actions"><button class="btn secondary" type="submit" value="revise">수정 의견 남기기</button><button class="btn primary" type="submit" value="confirm" ${item.status === '메모 확인 완료' ? 'disabled' : ''}>${item.status === '메모 확인 완료' ? '메모 확인 완료됨' : '메모 확인 완료'} ${icon('check')}</button></div><p class="fine-print">실제 결과물 승인·납품 검수·프로젝트 완료를 뜻하지 않습니다.</p></form></article>`;
    }).join('') : '<p class="ws-muted">공유된 결과물이 아직 없습니다. 제작이 완료되면 이곳에서 확인할 수 있습니다.</p>'}</section>`;
  }
  function detail(p, tab) {
    document.title = `${p.title} — 헤이엔터씨`;
    let content;
    if (tab === 'summary') content = reports.render(p);
    else if (tab === 'brief') content = `<section class="ws-panel"><div class="ws-panel-heading"><h2>프로젝트 브리프</h2>${p.status === '초안' ? `<button class="btn secondary small" data-ws-edit="${p.id}">초안 수정 ${icon('pen')}</button>` : ''}</div>${briefSummary(p)}</section>` + briefUpdates.client(p, refresh);
    else if (tab === 'proposals') content = proposal(p);
    else if (tab === 'messages') content = messages(p);
    else if (tab === 'documents') content = documents(p);
    else if (tab === 'schedule') content = `<section class="ws-panel"><div class="ws-panel-heading"><div><span class="eyebrow">PROJECT SCHEDULE</span><h2>프로젝트 일정</h2></div><span class="ws-small-label">진행 단계</span></div>${timeline(p)}<div class="ws-note"><strong>제작부터 검토까지, 단계별 일정을 확인하세요.</strong><p>공유된 결과물은 결과물 탭에서 별도로 확인할 수 있습니다.</p></div></section>`;
    else if (tab === 'deliverables') content = deliveryReviews(p);
    else if (tab === 'budget') content = clientBudget(p, { esc, icon, draft: state.costReviewDrafts[p.id + ':' + p.budgetSnapshots?.at(-1)?.version] || '' });
    else if (tab === 'people') content = `<section class="ws-panel"><h2>프로젝트를 함께하는 사람들</h2><div class="ws-person-row"><span class="ws-avatar">${clientType(state.role).avatar}</span><div><strong>${esc(p.client?.organization || p.client?.displayName || '의뢰자')}</strong><p>의뢰 담당자 · 담당자</p></div></div><div class="ws-person-row"><span class="ws-avatar manager">H</span><div><strong>${p.manager || '담당 매니저 배정 전'}</strong><p>${p.manager ? '프로젝트 소통과 기획을 연결하는 담당자' : ''}</p></div></div>${(p.participants || []).map(person => `<div class="ws-person-row"><span class="network-glyph">${icon(person.kind === '아티스트' ? 'mic' : 'person')}</span><div><strong>${esc(person.name)}</strong><p>${person.kind} · ${esc(person.role)}</p><span class="collab-status">${person.status}</span></div></div>`).join('')}<div class="ws-note">담당 매니저 지정은 헤이엔터씨 내부 운영 권한의 업무입니다. 의뢰자 화면에서는 현재 담당자와 역할을 확인합니다.</div></section>`;
    else content = overview(p);
    if (tab === 'people') content += `<section class="ws-panel"><div class="ws-panel-heading"><h2>참여자와 공유 범위</h2><a class="btn secondary" href="#/invite">참여 초대 ${icon('plus')}</a></div><dl class="ui-facts"><div><dt>의뢰 담당자</dt><dd>프로젝트 브리프·제안·공개 일정·자료</dd></div><div><dt>담당 매니저</dt><dd>프로젝트 구성·검토·참여자 관리</dd></div><div><dt>제작 파트너·아티스트</dt><dd>공유받은 담당 업무와 관련 자료</dd></div></dl></section>`;
    shell(`<a class="ws-back" href="#/workspace/projects">${icon('arrow')}내 프로젝트</a><div class="ws-detail-heading"><div><div>${badge(p.status)}<span class="ws-small-label">${p.id.startsWith('demo-') ? '프로젝트' : '프로젝트 예시'}</span></div><h1 tabindex="-1">${esc(p.title)}</h1><p>${esc(p.region)} · ${p.goal}</p></div></div><div class="ws-project-facts"><span>검토 예산 <strong>${p.budget}</strong></span><span>완료 일정 <strong>${p.date || '협의 중'}</strong></span><span>담당 <strong>${esc(p.manager || '배정 전')}</strong></span></div><nav class="ws-project-tabs" aria-label="프로젝트 메뉴">${TABS.map(([id, name]) => `<a href="${href(p, id)}" ${tab === id ? 'aria-current="page"' : ''}>${name}${id === 'messages' && p.messages.length ? `<span>${p.messages.length}</span>` : ''}</a>`).join('')}</nav><div class="ws-detail-layout ${state.context ? 'context-open' : ''}"><div class="ws-detail-main">${content}</div></div>`, 'projects');
  }
  function documentLibrary(params) {
    document.title = '문서함 — 헤이엔터씨';
    const options = documentLibraryOptions(projects, params), types = documentTypes(projects);
    const items = selectDocuments(projects, options), total = selectDocuments(projects).length;
    const selected = projects.find(p => p.id === options.project);
    shell(`${heading('EVERY DOCUMENT, IN CONTEXT', '문서함', '프로젝트의 브리프와 검토본, 자료 메모를 한곳에서 찾아보세요.')}<form id="ws-library-filter" class="document-library-filter"><div class="field"><label for="library-search">문서 검색</label><input class="input" type="search" name="q" id="library-search" maxlength="100" value="${esc(options.q)}" placeholder="문서 제목 또는 내용"></div><div class="field"><label for="library-project">프로젝트</label><select id="library-project" name="project"><option value="">전체 프로젝트</option>${projects.map(p => `<option value="${p.id}" ${p.id === options.project ? 'selected' : ''}>${esc(p.title)} · ${p.documents.length}개</option>`).join('')}</select></div><div class="field"><label for="library-kind">문서 유형</label><select id="library-kind" name="kind"><option value="">전체 유형</option>${types.map(type => `<option ${type === options.kind ? 'selected' : ''}>${esc(type)}</option>`).join('')}</select></div><button class="btn primary" type="submit">찾아보기 ${icon('arrow')}</button></form><div class="library-result-heading"><span role="status">전체 ${total}개 중 ${items.length}개 문서</span><a class="text-link" href="#/workspace/documents">조건 초기화 ${icon('close')}</a></div>${selected ? `<div class="library-project-context"><a class="text-link" href="${href(selected, 'documents')}">${esc(selected.title)} 문서 ${icon('arrow')}</a><button class="btn secondary" data-ws-add-doc="${selected.id}">자료 메모 추가 ${icon('plus')}</button></div>` : ''}${items.length ? `<div class="library-document-grid">${items.map(({ project: p, document: d }) => `<article class="library-document-card"><button class="library-document-open" data-ws-doc="${d.id}" data-project="${p.id}" aria-label="${esc(d.title)} ${esc(d.version)} 미리보기"><span class="network-glyph">${icon('file')}</span><div><span class="library-document-meta">${esc(d.kind)} · ${esc(d.version)}</span><h2>${esc(d.title)}</h2></div>${icon('arrow')}<p>${esc((d.text || '').replaceAll('\n', ' ').slice(0, 180))}</p></button><a class="library-document-project" href="${href(p, 'documents')}">${icon('folder')}<span>${esc(p.title)}</span>${icon('up-right')}</a></article>`).join('')}</div>` : `<section class="ws-panel">${empty('조건에 맞는 문서가 없어요.', '검색어·프로젝트·유형을 바꾸거나 조건을 초기화해 보세요.', '<a class="btn secondary" href="#/workspace/documents">전체 문서 보기</a>')}</section>`}`, 'documents');
  }
  function inbox(params) {
    document.title = '메시지 — 헤이엔터씨';
    const options = { q: (params.get('q') || '').slice(0, 100), unread: params.get('unread') === '1' };
    const selected = projects.find(p => p.id === params.get('project'));
    if (selected) markConversationRead(selected);
    const items = selectConversations(projects, options);
    const listParams = conversationQuery(options);
    const listHref = '#/workspace/messages' + (listParams.size ? '?' + listParams : '');
    shell(`${heading('KEEP EVERY CONVERSATION CLOSE', '메시지', '프로젝트별 대화와 새 안내를 한곳에서 확인하세요.')}<form id="ws-thread-filter" class="conversation-filter"><div class="field"><label for="thread-search">대화 검색</label><input class="input" id="thread-search" name="q" type="search" maxlength="100" value="${esc(options.q)}" placeholder="프로젝트 이름, 지역 또는 대화 내용"></div><label class="conversation-unread"><input type="checkbox" name="unread" value="1" ${options.unread ? 'checked' : ''}><span>미확인 대화만</span></label><button class="btn primary" type="submit">찾아보기 ${icon('arrow')}</button><a class="text-link" href="#/workspace/messages">조건 초기화</a></form><div class="conversation-result" role="status">${items.length}개의 프로젝트 대화</div><div class="ws-inbox conversation-inbox ${selected ? 'has-selection' : ''}"><nav class="ws-inbox-list" aria-label="프로젝트 대화 선택">${items.length ? items.map(({ project: p, unread, preview }) => `<a href="#/workspace/messages?${conversationQuery({ ...options, project: p.id })}" ${selected?.id === p.id ? 'aria-current="page"' : ''}><span class="conversation-list-heading"><strong>${esc(p.title)}</strong>${unread ? `<small class="conversation-unread-count" aria-label="미확인 메시지 ${unread}개">${unread}</small>` : ''}</span><p class="conversation-preview">${preview ? (preview.who === 'me' ? '나: ' : '담당자: ') + esc(preview.text) : '아직 대화가 없습니다. 첫 질문을 남겨보세요.'}</p><span class="conversation-list-meta">${p.messages.length}개의 메시지 · ${unread ? '미확인 안내 있음' : '새 안내 없음'}</span></a>`).join('') : `<div class="conversation-list-empty"><strong>${options.unread ? '미확인 대화가 없어요.' : '검색 결과가 없어요.'}</strong><p>검색어나 필터를 바꿔보세요.</p><a class="text-link" href="#/workspace/messages">전체 대화 보기 ${icon('arrow')}</a></div>`}</nav><div class="ws-inbox-content">${selected ? `<a class="ws-inbox-back text-link" href="${listHref}">대화 목록으로 ${icon('arrow')}</a><a class="ws-inbox-project text-link" href="${href(selected, 'messages')}">${esc(selected.title)} 프로젝트 대화 ${icon('up-right')}</a>${messages(selected)}` : empty('대화를 선택해 주세요.', '왼쪽 목록에서 프로젝트의 안내와 질문을 이어서 확인하세요.')}</div></div>`, 'messages');
  }
  function render(outlet, path, params) {
    if (staff.render(outlet, path, params)) return true;
    if (path !== '/account' && path !== '/workspace' && !path.startsWith('/workspace/')) return false;
    state.outlet = outlet; state.path = path; state.params = params;
    document.body.classList.remove('workspace-mode');
    if (path === '/account' || !state.role) { if (path !== '/account') state.next = path + (params.size ? '?' + params : ''); account(); return true; }
    if (path === '/workspace') projectList(params);
    else if (path === '/workspace/settings') { document.title = clientType(state.role).accountTitle + ' — 헤이엔터씨'; shell(settings.render(state.role), 'settings'); }
    else if (path === '/workspace/projects') projectList(params);
    else if (path === '/workspace/actions') actionsPage(params);
    else if (path === '/workspace/new') { const preset = campaignPreset(params.get('template')); if (!state.draft && preset) { state.draft = projectDraft(state.role, settings.current(state.role), preset); state.step = 0; } wizard(); }
    else if (path === '/workspace/documents') documentLibrary(params);
    else if (path === '/workspace/messages') inbox(params);
    else {
      const [, , , id, tab = 'proposals'] = path.split('/'); const p = projects.find(p => p.id === id);
      if (path.startsWith('/workspace/projects/') && p && TABS.some(([key]) => key === tab)) detail(p, tab);
      else shell(empty('이 프로젝트를 찾을 수 없어요.', '프로젝트 목록에서 이름과 상태를 확인해 주세요.', '<a class="btn primary" href="#/workspace/projects">내 프로젝트로</a>'), 'projects');
    }
    return true;
  }
  function refresh() { render(state.outlet, state.path, state.params); }
  function captureDraft() {
    const form = document.querySelector('#ws-project-form'); if (!form || !state.draft) return;
    const data = new FormData(form);
    for (const key of ['title', 'region', 'goal', 'budget', 'date', 'notes']) if (data.has(key)) state.draft[key] = String(data.get(key));
    if (state.step === 1) state.draft.services = data.getAll('service');
    if (state.step === 2) state.draft.campaign = normalizeCampaign({ targetAudience: data.get('targetAudience'), coreMessage: data.get('coreMessage'), channels: data.getAll('campaignChannel'), usageNotes: data.get('usageNotes') });
  }
  function saveDraft(final = false) {
    captureDraft(); const d = state.draft;
    let p = projects.find(p => p.id === d.id);
    if (!p) { p = { id: 'demo-' + crypto.randomUUID(), manager: '', tasks: [], messages: [], documents: [], proposal: false, reviewed: false, feedback: '', version: 'v1.0' }; projects.unshift(p); }
    Object.assign(p, d, { id: p.id, title: d.title.trim() || '이름 없는 프로젝트', region: d.region.trim() || '지역 미정', status: final ? '브리프 확인' : '초안', services: [...d.services], campaign: normalizeCampaign(d.campaign), client: { ...(d.client || settings.current(state.role)) } });
    if (final) { p.documents = p.documents.filter(x => x.kind !== '브리프'); p.documents.unshift(doc('프로젝트 브리프', '브리프', `${p.title}\n의뢰 담당자: ${p.client.displayName}\n기관·브랜드: ${clientOrganization(p.client)}${p.client.department ? '\n부서·팀: ' + p.client.department : ''}\n지역: ${p.region}\n목표: ${p.goal}\n검토 예산(VAT 포함): ${p.budget}\n분야: ${names(p.services)}\n\n${p.notes}${campaignText(p.campaign) ? '\n\n캠페인 기획 조건\n' + campaignText(p.campaign) : ''}\n\n프로젝트 브리프`)); state.draft = null; state.step = 0; }
    else state.draft.id = p.id;
    toast(final ? '프로젝트를 생성했어요. ' : '초안을 저장했어요.');
    nav(`/workspace/projects/${p.id}/overview`);
  }
  document.addEventListener('click', event => {
    const el = event.target.closest('button,a'); if (!el) return;
    if (el.dataset.wsTemplate) { const preset = campaignPreset(el.dataset.wsTemplate); if (preset) { state.draft = projectDraft(state.role, settings.current(state.role), preset); state.step = 0; } }
    if (el.dataset.wsRole) { state.role = el.dataset.wsRole; if (state.draft && !state.draft.id) { state.draft.client = { ...settings.current(state.role), role: state.role }; state.draft.region ||= settings.current(state.role).region; } document.querySelectorAll('[data-action="account"]').forEach(b => b.innerHTML = `${icon('person')}내 워크스페이스`); nav(state.next); return; }
    if (el.dataset.wsLatest) { const p = projects.find(p => p.id === el.dataset.wsLatest); if (p) p.version = p.latestVersion || p.version; }
    const action = el.dataset.wsAction;
    if (action === 'new') { location.hash=planningPath({client:state.role}); event.preventDefault(); return; }
    if (action === 'legacy-new') { if (state.path === '/workspace/new') { event.preventDefault(); return; } if (!state.draft || state.draft.id) { state.draft = newDraft(); state.step = 0; } }
    if (action === 'exit') { state.role = ''; state.next = '/workspace/projects'; document.querySelectorAll('[data-action="account"]').forEach(b => b.innerHTML = `${icon('person')}워크스페이스`); nav('/home'); }
    if (action === 'profile') { nav('/workspace/settings'); return; }
    if (action === 'context') { state.context = !state.context; const box = state.outlet.querySelector('.ws-detail-layout'); box.classList.toggle('context-open', state.context); el.setAttribute('aria-expanded', String(state.context)); }
    if (action === 'clear-search') { state.q = ''; state.filter = '전체'; state.sort = 'recent'; syncListQuery(true); projectList(state.params); document.querySelector('#ws-project-search')?.focus(); }
    if (action === 'wizard-prev') { captureDraft(); state.step--; refresh(); state.outlet.querySelector('h1').focus(); }
    if (action === 'save-draft') saveDraft();
    if (el.dataset.wsEdit) { const p = projects.find(p => p.id === el.dataset.wsEdit); state.draft = { ...p, services: [...p.services], campaign: normalizeCampaign(p.campaign) }; state.step = 0; nav('/workspace/new'); }
    if (el.dataset.wsReview) { const p = projects.find(p => p.id === el.dataset.wsReview); p.reviewedVersions ||= []; p.reviewedVersions.push(p.version); p.reviewed = p.reviewedVersions.includes(p.latestVersion); if (p.reviewed) p.tasks.filter(t => t.title === '프로젝트 구성안 검토').forEach(t => t.stage = '완료'); p.messages.push(message(`제안 ${p.version}의 구성 검토를 완료했습니다.`, 'me')); refresh(); toast('구성 검토 완료를 워크스페이스에 반영했어요.'); }
    if (el.dataset.wsDoc) { const p = projects.find(p => p.id === el.dataset.project); const d = p.documents.find(d => d.id === el.dataset.wsDoc); showModal(esc(d.title), `<div class="ws-document-meta">${d.kind} · ${d.version} · 문서</div><pre class="ws-document-preview">${esc(d.text)}</pre><p class="fine-print"></p><div class="modal-actions"><button class="btn secondary" data-action="close-modal">닫기</button><button class="btn primary" data-ws-download="${d.id}" data-project="${p.id}">텍스트로 저장 ${icon('download')}</button></div>`, 'DOCUMENT PREVIEW'); }
    if (el.dataset.wsDownload) { const p = projects.find(p => p.id === el.dataset.project); const d = p.documents.find(d => d.id === el.dataset.wsDownload); const url = URL.createObjectURL(new Blob(['\ufeff헤이엔터씨 문서\n\n', d.title, '\n\n', d.text], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = d.title.replace(/[\\/:*?"<>|]/g, '-') + '.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    if (el.dataset.wsAddDoc) showModal('프로젝트에 자료 메모 추가', `<p>파일 업로드 없이 자료의 내용을 텍스트 메모로 정리해 봅니다.</p><form class="modal-form" id="ws-document-form" data-project="${el.dataset.wsAddDoc}"><div class="field"><label for="ws-document-title">자료 제목 *</label><input class="input" id="ws-document-title" name="title" maxlength="80" required></div><div class="field"><label for="ws-document-text">내용 *</label><textarea class="input" id="ws-document-text" name="text" maxlength="4000" required></textarea></div><p class="fine-print">프로젝트 안에서만 유지됩니다. 기관 실자료나 개인정보를 입력하지 않아도 됩니다.</p><button type="submit" class="btn primary">자료 메모 추가</button></form>`, 'ADD A PROJECT NOTE');
  });
  document.addEventListener('input', event => {
    if (event.target.closest('#ws-project-form')) captureDraft();
    if (event.target.id === 'ws-project-search') { state.q = event.target.value; syncListQuery(); listResults(); }
    if (event.target.id === 'ws-message') state.messageDrafts[event.target.closest('form').dataset.project] = event.target.value;
    if (event.target.closest('.production-review-form')?.dataset.delivery) { const form = event.target.closest('form'); state.deliveryDrafts[form.dataset.delivery + ':' + form.dataset.revision] = event.target.value; }
    if (event.target.closest('#ws-budget-review-form')) { const form = event.target.closest('form'); state.costReviewDrafts[form.dataset.project + ':' + form.dataset.version] = event.target.value; }
    if (event.target.id === 'ws-feedback') state.feedbackDrafts[event.target.closest('form').dataset.project] = event.target.value;
  });
  document.addEventListener('change', event => {
    if (event.target.closest('#ws-project-form')) captureDraft();
    if (event.target.id === 'action-project') { const params = new URLSearchParams(state.params); if (event.target.value) params.set('project', event.target.value); else params.delete('project'); nav('/workspace/actions?' + params); }
    if (event.target.id === 'ws-status-filter' || event.target.id === 'ws-project-sort') { if (event.target.id === 'ws-status-filter') state.filter = event.target.value; else state.sort = event.target.value; syncListQuery(true); listResults(); }
    if (event.target.id === 'ws-proposal-version') { const p = projects.find(p => state.path.includes('/' + p.id + '/')); p.version = event.target.value; refresh(); }
  });
  document.addEventListener('submit', event => {
    const form = event.target; if (!form.id.startsWith('ws-')) return; event.preventDefault();
    const data = new FormData(form);
    if (form.id === 'ws-thread-filter') { const params = conversationQuery({ q: String(data.get('q') || ''), unread: data.has('unread') }); nav('/workspace/messages' + (params.size ? '?' + params : '')); return; }
    if (form.id === 'ws-library-filter') { const params = documentLibraryQuery(Object.fromEntries(data)); nav('/workspace/documents' + (params.size ? '?' + params : '')); return; }
    const p = projects.find(p => p.id === form.dataset.project);
    if (form.classList.contains('production-review-form') && form.dataset.delivery) { const item = p.deliverables.find(item => item.id === form.dataset.delivery); const note = String(data.get('note')).trim(); const action = event.submitter?.value; if (action === 'revise' && !note) { toast('수정할 내용을 입력해 주세요.'); return; } item.status = action === 'revise' ? '수정 의견 있음' : '메모 확인 완료'; item.reviewNote = note; p.messages.push(message(`결과물 ${item.title} · v${item.revision}.0 · ${item.status}${note ? '\n' + note : ''}`, 'me')); state.deliveryDrafts[item.id + ':' + item.revision] = ''; refresh(); toast('검토메모의 확인 상태를 워크스페이스에 반영했어요.'); }
    if (form.id === 'ws-budget-review-form') { const snapshot = p.budgetSnapshots?.find(item => item.version === form.dataset.version); if (!snapshot) return; const note = String(data.get('note')).trim(); const action = event.submitter?.value; if (action === 'revise' && !note) { toast('수정할 내용을 입력해 주세요.'); return; } snapshot.reviewStatus = action === 'revise' ? '수정 의견 있음' : '구성 확인 완료'; snapshot.feedback = note; p.messages.push(message(`예산 검토본 ${snapshot.version} · ${snapshot.reviewStatus}${note ? '\n' + note : ''}`, 'me')); state.costReviewDrafts[p.id + ':' + snapshot.version] = ''; refresh(); toast('예산 구성의 검토 상태를 워크스페이스에 반영했어요.'); }
    if (form.id === 'ws-project-form') { captureDraft(); if (!state.draft.title.trim() || !state.draft.region.trim()) { state.step = 0; refresh(); toast('프로젝트 이름과 지역을 입력해 주세요.'); return; } if (state.step < 3) { state.step++; refresh(); state.outlet.querySelector('h1').focus(); window.scrollTo(0, 0); } else saveDraft(true); }
    if (form.id === 'ws-message-form') { const text = String(data.get('message')).trim(); if (!text) { toast('메시지를 입력해 주세요.'); return; } p.messages.push(message(text, 'me')); state.messageDrafts[p.id] = ''; refresh(); document.querySelector('#ws-message-end').scrollIntoView({ block: 'nearest' }); toast('메시지를 워크스페이스에 남겼어요. '); }
    if (form.id === 'ws-feedback-form') { const text = String(data.get('feedback')).trim(); if (!text) { toast('검토 의견을 입력해 주세요.'); return; } p.proposalFeedback ||= {}; p.proposalFeedback[p.version] = text; p.feedback = p.proposalFeedback[p.latestVersion || p.version] || ''; p.proposalCommentedVersions ||= []; if (!p.proposalCommentedVersions.includes(p.version)) p.proposalCommentedVersions.push(p.version); p.messages.push(message(`제안 ${p.version} 검토 의견\n${text}`, 'me')); state.feedbackDrafts[p.id] = ''; refresh(); toast('의견을 프로젝트 대화에 기록했어요. '); }
    if (form.id === 'ws-document-form') { const title = String(data.get('title')).trim(); const text = String(data.get('text')).trim(); if (!title || !text) { toast('제목과 내용을 공백 없이 입력해 주세요.'); return; } p.documents.unshift(doc(title, '자료 메모', text)); document.querySelector('#modal').close(); refresh(); toast('프로젝트 문서함에 자료 메모를 추가했어요.'); }
  });
  return { render, enter() { state.next = '/workspace/projects'; nav(state.role ? '/workspace/projects' : '/account'); }, startProject(preset = {}) { state.draft = { ...projectDraft(state.role, settings.current(state.role), preset), budget: BUDGETS.includes(preset.budget) ? preset.budget : '미정', region: preset.region?.trim() || settings.current(state.role).region || '', services: [...(preset.services || [])] }; state.step = 0; state.next = '/workspace/new'; nav(state.role ? '/workspace/new' : '/account'); } };
}
