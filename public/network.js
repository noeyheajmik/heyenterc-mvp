import { REGIONS, regionSelection } from './regions.js';

import { createCollaborator } from './collaborator.js';

const PARTNER_FIELDS = [['video', '영상 제작', 'film'], ['press', '기사·보도', 'press'], ['design', '디자인', 'pen'], ['print', '인쇄·제작', 'print']];
const ARTIST_FIELDS = [['singer', '가수·공연팀', 'mic'], ['creator', '인플루언서', 'spark'], ['mc', 'MC·진행자', 'person']];
export const PROFILES = [
  { id: 'local-frame', kind: 'partners', name: '로컬 프레임 스튜디오', field: 'video', region: '전남', intro: '장소의 매력을 사람의 이야기로 담습니다.', description: '관광지의 풍경과 현장의 사람을 연결하는 영상 제작팀의 프로필 예시입니다. 인터뷰와 여행 동선을 중심으로 콘텐츠의 방향을 정리합니다.', outputs: ['관광·브랜드 소개 영상', '인터뷰·현장 스케치', 'SNS 숏폼'], checks: ['촬영 일수와 이동 동선', '영상 편수·길이와 수정 범위', '원본 제공·음원·초상권 조건'], samples: ['골목을 걷는 여행', '로컬 브랜드의 하루'] },
  { id: 'story-desk', kind: 'partners', name: '스토리 데스크', field: 'press', region: '전국', intro: '지역의 소식을 읽고 싶은 이야기로 정리합니다.', description: '지역 이슈와 브랜드 스토리를 인터뷰·보도자료로 정리하는 파트너 유형을 소개하는 프로필입니다. 작성과 배포의 범위를 구분해 검토합니다.', outputs: ['보도자료 기획·작성', '인물·브랜드 인터뷰', '배포 방향 정리'], checks: ['취재·작성·배포 범위', '자료 확인과 수정 일정', '게재 여부와 유료 노출 조건'], samples: ['지역 축제의 시작', '만드는 사람의 이야기'] },
  { id: 'form-local', kind: 'partners', name: '폼 로컬 디자인', field: 'design', region: '서울·경기', intro: '지역의 개성을 일관된 시각 언어로 만듭니다.', description: '축제와 로컬 브랜드의 키비주얼을 온라인·오프라인으로 확장하는 디자인 파트너의 협업 범위입니다.', outputs: ['축제 키비주얼', '포스터·카드뉴스', '브랜드 그래픽'], checks: ['제작물 규격과 종류', '시안·수정 횟수', '폰트·이미지 사용권과 원본'], samples: ['우리 동네의 색', '계절을 담은 포스터'] },
  { id: 'paper-route', kind: 'partners', name: '페이퍼 루트', field: 'print', region: '전남', intro: '손에 닿는 홍보물까지 꼼꼼하게 완성합니다.', description: '관광 지도와 리플렛, 행사 인쇄물의 제작 조건을 정리하는 인쇄 파트너의 협업 범위입니다.', outputs: ['관광 지도·리플렛', '포스터·배너', '행사 안내물'], checks: ['수량·재질·규격과 후가공', '인쇄 전 교정 확인', '납기와 배송·설치 범위'], samples: ['한 장의 여행 지도', '축제를 안내하는 인쇄물'] },
  { id: 'on-stage', kind: 'artists', name: '온스테이지', field: 'singer', region: '전국', intro: '관객과 함께 호흡하는 어쿠스틱 무대.', description: '지역 축제와 소규모 공연에서 어쿠스틱 음악을 선보이는 공연팀의 협업 범위입니다.', outputs: ['어쿠스틱 라이브', '축제·브랜드 행사 공연', '콘텐츠 출연'], checks: ['공연 시간과 곡 구성', '무대·음향·리허설 조건', '이동·숙박과 촬영 활용'], samples: ['해 질 무렵의 라이브', '마을에서 만난 음악'] },
  { id: 'walk-note', kind: 'artists', name: '산책노트', field: 'creator', region: '전남', intro: '천천히 머물며 발견하는 지역의 장면들.', description: '로컬 여행과 생활 공간을 소개하는 크리에이터의 콘텐츠 방향을 소개하는 프로필입니다.', outputs: ['여행 브이로그', '로컬 체험 숏폼', '브랜드 협업 콘텐츠'], checks: ['게시 채널·편수와 유지 기간', '광고 표시와 사전 검토 범위', '2차 활용·광고 집행 조건'], samples: ['하루 더 머물고 싶은 곳', '동네의 작은 취향'] },
  { id: 'good-flow', kind: 'artists', name: '좋은흐름 MC', field: 'mc', region: '서울·경기', intro: '행사의 목적과 관객을 연결하는 진행.', description: '지역 축제와 브랜드 행사의 흐름을 설계하는 진행자의 협업 범위를 소개하는 프로필입니다.', outputs: ['축제·기념식 진행', '토크·인터뷰 진행', '현장 이벤트 진행'], checks: ['대본·리허설과 행사 시간', '관객 구성과 진행 언어', '이동·대기·현장 운영 조건'], samples: ['지역을 만나는 토크', '함께 여는 축제'] }
];

export function createNetwork({ icon, esc, toast, startBrief, closeMenus, hub }) {
  let outlet, currentPath = '', params = new URLSearchParams();
  const selected = new Set();
  const blankProfile = role => ({ role, name: '', field: role === 'artists' ? 'singer' : 'video', ...regionSelection(), intro: '', scope: '', portfolio: '', conditions: '' });
  const draft = blankProfile('partners');
  const profileCache = { partners: null, artists: null };
  let step = 0, completed = false;
  function switchRole(role) {
    if (draft.role === role) return;
    profileCache[draft.role] = { ...draft };
    Object.assign(draft, profileCache[role] || blankProfile(role));
    step = 0; completed = false;
  }
  const collaborator = createCollaborator({ icon, esc, toast, hub,
    getProfile: role => !role || role === draft.role ? draft : profileCache[role] || blankProfile(role),
    editProfile(role) { switchRole(role); completed = false; step = 0; nav('/join?role=' + role); }
  });
  const fields = kind => kind === 'artists' ? ARTIST_FIELDS : PARTNER_FIELDS;
  const meta = p => fields(p.kind).find(f => f[0] === p.field);
  const nav = path => { closeMenus(); document.querySelector('#modal')?.close(); if (location.hash === '#' + path) refresh(); else location.hash = path; };
  const head = (eyebrow, title, description, action = '') => `<div class="network-heading"><div><span class="eyebrow">${eyebrow}</span><h1 tabindex="-1">${title}</h1><p>${description}</p></div>${action}</div>`;
  const crumb = (label, kind = '') => `<nav class="explore-breadcrumbs" aria-label="현재 위치"><a href="#/home">홈</a><span aria-hidden="true">/</span>${kind ? `<a href="#/${kind}">${kind === 'artists' ? '아티스트' : '제작 파트너'}</a><span aria-hidden="true">/</span>` : ''}<span>${label}</span></nav>`;
  const tag = text => `<span class="network-tag">${esc(text)}</span>`;
  const select = (id, label, options, value) => `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id.replace('network-', '')}">${options.map(([v, t]) => `<option value="${v}" ${value === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div>`;
  function shortlist() {
    return `<section class="network-shortlist" aria-label="협업 후보"><div><strong>협업 후보 <span>${selected.size}명·팀</span></strong><p>${selected.size ? [...selected].map(id => esc(PROFILES.find(p => p.id === id).name)).join(' · ') : '관심 있는 프로필을 후보에 담아 함께 검토해 보세요.'}</p></div><button class="btn primary" data-network-action="brief" ${selected.size ? '' : 'disabled'}>후보로 상담 메모 만들기 ${icon('arrow')}</button></section>`;
  }
  function cards(kind) {
    const q = (params.get('q') || '').trim().toLowerCase();
    const result = PROFILES.filter(p => p.kind === kind && (!params.get('field') || p.field === params.get('field')) && (!params.get('region') || p.region === params.get('region')) && (!q || [p.name, p.intro, p.region, ...p.outputs].join(' ').toLowerCase().includes(q)));
    document.querySelector('#network-count').textContent = `${result.length}개의 예시 프로필`;
    document.querySelector('#network-results').innerHTML = result.length ? result.map(p => `<article class="network-card"><div class="network-card-top"><span class="network-glyph">${icon(meta(p)[2])}</span><span class="network-example">프로필 예시</span></div><span class="network-category">${meta(p)[1]} · ${p.region}</span><h2><a href="#/${kind}/${p.id}">${p.name}</a></h2><p>${p.intro}</p><div class="network-tags">${p.outputs.slice(0, 2).map(tag).join('')}</div><div class="network-card-bottom"><a class="text-link" href="#/${kind}/${p.id}">프로필 보기 ${icon('arrow')}</a><button class="network-save" data-network-save="${p.id}" aria-pressed="${selected.has(p.id)}" aria-label="${p.name} ${selected.has(p.id) ? '후보에서 제외' : '후보에 담기'}">${icon(selected.has(p.id) ? 'check' : 'plus')}</button></div></article>`).join('') : `<div class="network-empty">${icon('person')}<h2>조건에 맞는 프로필이 없어요.</h2><p>검색어를 바꾸거나 조건을 초기화해 보세요.</p><button class="btn secondary" data-network-action="reset">조건 초기화</button></div>`;
    document.querySelector('#network-selection').innerHTML = shortlist();
  }
  function listing(kind) {
    const artist = kind === 'artists';
    document.title = `${artist ? '아티스트' : '제작 파트너'} 탐색 — 헤이엔터씨`;
    outlet.innerHTML = `<div class="container network-page">${crumb(artist ? '아티스트' : '제작 파트너')}${head(artist ? 'PEOPLE MAKE THE MOMENT' : 'GOOD WORK, TOGETHER', artist ? '브랜드와 지역의 순간을,<br>더 특별하게 만드는 사람들.' : '좋은 이야기를 함께 만들,<br>우리 프로젝트의 파트너.', artist ? '제품 캠페인의 모델·인플루언서부터 브랜드 행사와 축제의 가수·MC까지. 목표 고객과 콘텐츠에 맞는 역할을 찾아보세요.' : '제품·브랜드 영상부터 광고 소재, 보도자료와 인쇄물까지. 캠페인에 필요한 전문 분야를 살펴보세요.', '<div class="network-heading-actions"><a class="btn secondary" href="#/collab?role=' + kind + '">협업 업무 공간 ' + icon('arrow') + '</a><a class="btn secondary" href="#/join?role=' + kind + '">협업 프로필 만들기 ' + icon('up-right') + '</a></div>')}<div class="network-notice">${icon('person')}<p>모든 프로필은 협업 범위를 소개하는 구성 예시입니다. 실제 소속·활동 이력·섭외 가능 여부를 나타내지 않습니다.</p></div><form id="network-search-form" class="network-filters"><div class="field network-search"><label for="network-q">키워드</label><input class="input" type="search" id="network-q" name="q" value="${esc(params.get('q') || '')}" placeholder="이름, 콘텐츠, 키워드" maxlength="80"></div>${select('network-field', '전문 분야', [['', '분야 전체'], ...fields(kind).map(([v, t]) => [v, t])], params.get('field'))}${select('network-region', '활동 지역', [['', '지역 전체'], ...['전남', '서울·경기', '전국'].map(v => [v, v])], params.get('region'))}<button class="btn primary" type="submit">찾아보기 ${icon('arrow')}</button></form><div class="network-results-heading"><span id="network-count" role="status" aria-live="polite"></span><button class="text-link" data-network-action="reset">조건 초기화</button></div><div id="network-results" class="network-grid"></div><div id="network-selection" aria-live="polite"></div><section class="network-banner"><div><span class="eyebrow">START WITH THE RIGHT QUESTIONS</span><h2>누구와 함께할지, 아직 막연한가요?</h2><p>목표와 예산을 먼저 정리하면 필요한 역할이 더 선명해집니다.</p></div><a class="btn secondary" href="#/budget">홍보 구성부터 살펴보기 ${icon('arrow')}</a></section></div>`;
    cards(kind);
  }
  function detail(kind, id) {
    const p = PROFILES.find(p => p.id === id && p.kind === kind);
    if (!p) { document.title = '프로필을 찾을 수 없습니다 — 헤이엔터씨'; outlet.innerHTML = `<div class="container network-page">${head('PROFILE NOT FOUND', '프로필을 찾을 수 없어요.', '탐색 화면에서 다른 프로필을 확인해 주세요.', `<a class="btn primary" href="#/${kind}">목록으로 돌아가기</a>`)}</div>`; return; }
    document.title = `${p.name} — 헤이엔터씨`;
    outlet.innerHTML = `<div class="container network-page">${crumb(p.name, kind)}${head('A GOOD CONNECTION', esc(p.name), p.intro)}<div class="network-detail-layout"><div><section class="network-panel network-profile-intro"><div class="network-profile-mark">${icon(meta(p)[2])}<span>EXAMPLE PROFILE</span></div><div><span class="network-example">프로필 예시</span><h2>${meta(p)[1]}의 새로운 연결.</h2><p>${p.description}</p><div class="network-tags">${tag(p.region)}${p.outputs.map(tag).join('')}</div></div></section><section class="network-panel"><span class="eyebrow">WHAT WE CAN MAKE</span><h2>함께할 수 있는 일</h2><ul class="network-scope">${p.outputs.map((v, i) => `<li><span>0${i + 1}</span><strong>${v}</strong>${icon('check')}</li>`).join('')}</ul></section><section class="network-panel"><span class="eyebrow">PORTFOLIO DIRECTION</span><h2>포트폴리오 구성 예시</h2><div class="network-portfolio">${p.samples.map((v, i) => `<article><div>${icon(meta(p)[2])}<span>CONCEPT 0${i + 1}</span></div><h3>${v}</h3><p>실제 수행 이력이 아닌 콘텐츠 방향 예시입니다.</p></article>`).join('')}</div></section></div><aside class="network-detail-aside"><section class="network-panel"><span class="eyebrow">BEFORE WE START</span><h2>먼저 확인할 조건</h2><ul class="network-checklist">${p.checks.map(v => `<li>${icon('check')}<span>${v}</span></li>`).join('')}</ul><dl class="network-conditions"><div><dt>예산</dt><dd>범위 확인 후 협의</dd></div><div><dt>일정</dt><dd>프로젝트별 확인 필요</dd></div></dl><button class="btn secondary full-width" data-network-save="${p.id}" aria-pressed="${selected.has(p.id)}">${icon(selected.has(p.id) ? 'check' : 'plus')}${selected.has(p.id) ? '후보에서 제외' : '협업 후보에 담기'}</button><button class="btn primary full-width" data-network-brief="${p.id}">이 프로필로 상담 메모 ${icon('arrow')}</button><p class="fine-print">후보 선택은 섭외 요청이나 예약이 아닙니다.</p></section><a class="text-link" href="#/${kind}">다른 프로필 살펴보기 ${icon('arrow')}</a></aside></div></div>`;
  }
  function capture() { const form = document.querySelector('#network-join-form'); if (!form) return; const data = Object.fromEntries(new FormData(form)); if (data.role && data.role !== draft.role) switchRole(data.role); else { Object.assign(draft, data); if (Object.hasOwn(data, 'province')) Object.assign(draft, regionSelection(data.province, data.district || '')); } }
  function activityRegion() {
    const parent = REGIONS.find(p => p.id === draft.province);
    const districts = parent?.districts || [];
    return `<fieldset class="join-region"><legend>활동 지역</legend><div class="join-region-selects"><div class="field"><label for="join-province">시·도</label><select id="join-province" name="province" aria-describedby="join-region-help"><option value="">전국</option>${REGIONS.map(p => `<option value="${p.id}" ${draft.province === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></div><div class="field"><label for="join-district">시·군·구</label><select id="join-district" name="district" ${!districts.length ? 'disabled' : ''} aria-describedby="join-region-help"><option value="">${parent ? esc(parent.name) + ' 전체' : '전국 활동'}</option>${districts.map(d => `<option value="${d.id}" ${draft.district === d.id ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}</select></div></div><p id="join-region-help" class="join-region-help">시·도 전체 또는 특정 시·군·구를 선택해 주세요. 전국 활동도 선택할 수 있어요.</p><p class="join-region-selected" role="status" aria-live="polite">선택한 활동 지역: ${esc(draft.region)}</p></fieldset>`;
  }
  function join() {
    document.title = '협업 프로필 만들기 — 헤이엔터씨';
    const roleFields = fields(draft.role);
    const input = (key, label, placeholder, required = true) => `<div class="field"><label for="join-${key}">${label}${required ? ' <span aria-hidden="true">*</span>' : ' · 선택'}</label><input class="input" id="join-${key}" name="${key}" value="${esc(draft[key])}" placeholder="${placeholder}" maxlength="${key === 'intro' ? 160 : 80}" ${required ? 'required' : ''}></div>`;
    const area = (key, label, placeholder) => `<div class="field"><label for="join-${key}">${label} · 선택</label><textarea class="input" id="join-${key}" name="${key}" placeholder="${placeholder}" maxlength="1500">${esc(draft[key])}</textarea></div>`;
    let body;
    if (completed) body = `<section class="network-panel network-complete"><span class="network-glyph">${icon('check')}</span><span class="eyebrow">READY FOR THE NEXT CONNECTION</span><h2>협업 프로필 초안을 정리했어요.</h2><p>내용을 수정하거나 텍스트로 저장해 두세요.<br></p>${review()}<a class="btn primary full-width network-workspace-link" href="#/collab?role=${draft.role}">협업 업무 공간 ${icon('arrow')}</a><div class="network-form-actions"><button class="btn secondary" data-network-action="edit">초안 수정하기</button><button class="btn primary" data-network-action="download">텍스트로 저장 ${icon('download')}</button></div></section>`;
    else body = `<ol class="network-steps" aria-label="등록 초안 단계">${['기본 정보', '협업 범위', '내용 확인'].map((v, i) => `<li ${i === step ? 'aria-current="step"' : ''}><span>${i < step ? icon('check') : '0' + (i + 1)}</span>${v}</li>`).join('')}</ol><form id="network-join-form" class="network-panel network-join-form"><span class="eyebrow">STEP 0${step + 1}</span><h2 tabindex="-1">${['어떤 일을 함께할까요?', '나의 협업 범위를 알려주세요.', '공개할 정보를 확인해 주세요.'][step]}</h2>${step === 0 ? `<fieldset class="network-role"><legend>참여 유형</legend>${[['partners', '제작 파트너', '영상·기사·디자인·인쇄'], ['artists', '아티스트', '가수·인플루언서·MC']].map(([v, t, d]) => `<label><input type="radio" name="role" value="${v}" ${draft.role === v ? 'checked' : ''}><span><strong>${t}</strong><small>${d}</small></span></label>`).join('')}</fieldset>${input('name', draft.role === 'artists' ? '활동명·팀명' : '업체·스튜디오명', '예: 로컬 프레임 스튜디오')}${select('network-field', '주요 분야', roleFields.map(([v, t]) => [v, t]), draft.field)}${activityRegion()}${input('intro', '한 줄 소개', '어떤 이야기와 일을 잘하는지 소개해 주세요.')}` : step === 1 ? `${area('scope', '제공 가능한 작업·역할', '예: 제품·브랜드 영상, 광고 소재, 인터뷰 콘텐츠')}${area('portfolio', '포트폴리오 소개', '공개 가능한 작업 주제와 나의 역할을 적어 주세요.')}${area('conditions', '협업 전 확인할 조건', '예: 활동 지역, 준비 기간, 촬영·활용 범위, 장비 조건')}` : review()}<div class="network-form-actions">${step > 0 ? '<button class="btn secondary" type="button" data-network-action="prev">이전 단계</button>' : '<a class="text-link" href="#/' + draft.role + '">탐색으로 돌아가기</a>'}<button class="btn primary" type="submit">${step === 2 ? '프로필 초안 만들기' : '다음 단계'} ${icon('arrow')}</button></div></form>`;
    outlet.innerHTML = `<div class="container network-page network-join">${crumb('협업 프로필 만들기')}${head('MAKE SOMETHING TOGETHER', '브랜드와 지역의 다음 이야기,<br>함께 만들어가요.', '나의 전문 분야와 협업 조건을 하나의 프로필로 정리해 보세요.')}<div class="network-join-layout"><div>${body}</div><aside class="network-join-note"><span class="network-glyph">${icon('person')}</span><h2>좋은 연결은,<br>명확한 소개에서.</h2><p>잘하는 일과 가능한 범위를 구체적으로 적으면 프로젝트의 방향을 함께 정하기 쉬워집니다.</p><ul><li>직접 수행할 수 있는 전문 분야</li><li>공개 가능한 작업과 나의 역할</li><li>일정·지역·활용에 필요한 조건</li></ul></aside></div></div>`;
  }
  function review() { return `<dl class="network-review">${[['참여 유형', draft.role === 'artists' ? '아티스트' : '제작 파트너'], ['이름', draft.name], ['분야·지역', `${fields(draft.role).find(f => f[0] === draft.field)?.[1] || ''} · ${draft.region}`], ['한 줄 소개', draft.intro], ['작업·역할', draft.scope], ['포트폴리오 소개', draft.portfolio], ['협업 조건', draft.conditions]].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v || '아직 작성하지 않았어요.').replaceAll('\n', '<br>')}</dd></div>`).join('')}</dl>`; }
  function refresh() { render(outlet, currentPath, params); }
  function render(target, path, query) {
    if (collaborator.render(target, path, query)) return true;
    if (!/^\/(partners|artists)(\/[^/]+)?$/.test(path) && path !== '/join') return false;
    outlet = target; currentPath = path; params = query;
    if (path === '/join') { if (query.has('role')) switchRole(query.get('role') === 'artists' ? 'artists' : 'partners'); join(); }
    else { const [, kind, id] = path.split('/'); if (id) detail(kind, id); else listing(kind); }
    return true;
  }
  document.addEventListener('click', event => {
    const el = event.target.closest('[data-network-action],[data-network-save],[data-network-brief]'); if (!el) return;
    if (el.dataset.networkSave) { const id = el.dataset.networkSave; if (!PROFILES.some(p => p.id === id)) return; if (selected.has(id)) selected.delete(id); else selected.add(id); const y = scrollY; refresh(); window.scrollTo(0, y); document.querySelector(`[data-network-save="${id}"]`)?.focus({ preventScroll: true }); toast(selected.has(id) ? '협업 후보에 담았어요.' : '후보에서 제외했어요.'); return; }
    const action = el.dataset.networkAction;
    if (action === 'reset') nav(currentPath);
    if (action === 'brief' || el.dataset.networkBrief) { const items = el.dataset.networkBrief ? [PROFILES.find(p => p.id === el.dataset.networkBrief)] : [...selected].map(id => PROFILES.find(p => p.id === id)); if (!items.length) return; startBrief({ notes: `관심 있는 협업 후보 (프로필 예시)\n${items.map(p => `- ${p.name} · ${meta(p)[1]}`).join('\n')}\n\n프로젝트 목적과 일정, 필요한 역할을 함께 검토하고 싶습니다.` }); }
    if (action === 'prev') { capture(); step = Math.max(0, step - 1); join(); outlet.querySelector('#network-join-form h2')?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    if (action === 'edit') { completed = false; step = 0; join(); }
    if (action === 'download') { const content = `헤이엔터씨 협업 프로필 초안\n\n${draft.name}\n${draft.role === 'artists' ? '아티스트' : '제작 파트너'} · ${fields(draft.role).find(f => f[0] === draft.field)?.[1]} · ${draft.region}\n\n소개\n${draft.intro}\n\n작업·역할\n${draft.scope}\n\n포트폴리오\n${draft.portfolio}\n\n협업 조건\n${draft.conditions}`; const url = URL.createObjectURL(new Blob(['\ufeff', content], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = '헤이엔터씨_협업프로필_초안.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('프로필 초안을 텍스트로 저장합니다.'); }
  });
  document.addEventListener('change', event => { if (event.target.matches('#join-province,#join-district')) { capture(); const y = scrollY; const focusId = event.target.id === 'join-province' && draft.province && REGIONS.find(p => p.id === draft.province)?.districts.length ? 'join-district' : event.target.id; join(); window.scrollTo(0, y); document.getElementById(focusId)?.focus({ preventScroll: true }); return; } if (event.target.matches('#network-join-form input[name="role"]')) { capture(); params.set('role', draft.role); history.replaceState(null, '', '#/join?' + params.toString()); join(); document.querySelector(`#network-join-form input[value="${draft.role}"]`)?.focus(); } });
  document.addEventListener('input', event => { if (event.target.closest('#network-join-form') && event.target.name !== 'role') capture(); });
  document.addEventListener('submit', event => {
    if (event.target.id === 'network-search-form') { event.preventDefault(); const data = new FormData(event.target); const query = new URLSearchParams(); for (const [k, v] of data) if (v.trim()) query.set(k, v.trim()); const path = currentPath + (query.size ? '?' + query.toString() : ''); if (location.hash === '#' + path) refresh(); else nav(path); }
    if (event.target.id === 'network-join-form') { event.preventDefault(); capture(); if (step === 0 && (!draft.name.trim() || !draft.intro.trim())) { toast('이름과 한 줄 소개를 공백 없이 입력해 주세요.'); return; } if (step < 2) step++; else completed = true; join(); outlet.querySelector('h1')?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  });
  return { render };
}
