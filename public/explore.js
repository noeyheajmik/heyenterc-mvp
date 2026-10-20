import { createUIPages } from './ui-pages.js';
import { campaignKeys, campaignPreset } from './campaign-templates.js';
import { companyPage } from './company.js';

const BUDGETS = ['미정', '500만원 미만', '500만~1,000만원', '1,000만~3,000만원', '3,000만~5,000만원', '5,000만원 이상', '직접 입력'];
const GOALS = ['관광·지역 홍보', '축제·행사', '브랜드·콘텐츠'];
const GOAL_KEYS = ['tourism', 'festival', 'brand'];

export function createExplorer({ workspace, network, references: homeReferences, services, icon, esc, showModal, startBrief, closeMenus, toast, getSaved, toggleSaved }) {
  const uiPages = createUIPages({ icon, esc, services, showModal });
  const all = [
    ...homeReferences.map((r, i) => ({ ...r, title: r.title.replace('<br>', ' '), region: '전남', location: '전남 고흥', type: 'real', serviceIds: i === 0 ? ['video', 'artist'] : i === 1 ? ['creator', 'video'] : ['artist'], goal: i === 2 ? 'festival' : 'tourism', outputs: i === 0 ? ['관광 콘텐츠 기획', '출연진 섭외', '유튜브 콘텐츠 제작'] : i === 1 ? ['지역 맞춤 여행 콘텐츠', '브랜드 제품과 콘텐츠 연결', '유튜브 콘텐츠 기획·제작'] : ['아티스트·프로듀서 참여', '관광 브랜드 음악 프로젝트'], approach: i === 0 ? '지역의 장소를 여행자의 일상과 연결하고, 출연진의 시선으로 관광 자원을 소개한 사례입니다.' : i === 1 ? '지역을 여행하는 이야기 속에서 아웃도어 브랜드의 매력을 함께 전달하는 공동 캠페인입니다.' : '지역의 정체성을 음악이라는 매체에 담아 관광 브랜딩으로 연결한 사례입니다.' })),
    { id: 'jeju', client: '제주시 · 모두투어 · 한일고속', title: '여행 예능으로 연결한 제주와 브랜드', image: 'jeju-coast', cover: 'HELLO, JEJU.', category: ['tourism', 'brand'], tags: ['여행 예능', '브랜드 공동 캠페인'], intro: '배우와 크리에이터가 참여한 제주 지역 맞춤형 여행 예능 콘텐츠를 기획·제작한 사례입니다.', range: '여행 예능 기획·제작, 출연진 섭외, 지자체·브랜드 공동 홍보', imageNote: '제주 해안의 분위기 사진이며 해당 예능의 실제 납품 장면이 아닙니다.', region: '제주', location: '제주', type: 'real', serviceIds: ['video', 'artist', 'creator'], goal: 'tourism', outputs: ['지역 맞춤 여행 예능', '출연진 섭외', '지자체·브랜드 공동 홍보'], approach: '관광지와 이동, 여행 경험을 하나의 콘텐츠로 묶고 지역과 기업이 함께 등장하는 구성을 만들었습니다.' },
    { id: 'blooming', client: '블루밍비데', title: '제품의 매력을 선명하게 전하는 브랜드 영상', image: 'forest', cover: 'MAKE YOUR BRAND BLOOM.', category: ['brand', 'artist'], tags: ['브랜드 마케팅', '모델 섭외', '홍보영상'], intro: '강소라 모델 섭외와 브랜드 홍보영상 기획·제작을 함께 진행한 블루밍비데 프로젝트입니다.', range: '모델 섭외, 브랜드 홍보영상 기획·제작', imageNote: '브랜드 콘텐츠 이미지', region: '전국', location: '브랜드 캠페인', type: 'real', serviceIds: ['artist', 'video'], goal: 'brand', outputs: ['브랜드 메시지와 영상 기획', '광고 모델 섭외', '제품 홍보영상 제작'], approach: '제품과 브랜드가 전달하려는 메시지에 맞춰 모델을 연결하고, 소비자가 제품을 이해할 수 있는 홍보영상으로 구성했습니다.' },
    { id: 'product-launch', client: '제품·서비스 론칭 · 기획 예시', title: '출시 메시지를 고객의 첫 관심으로', image: 'forest', cover: 'NEW PRODUCT. NEW STORY.', category: ['brand'], tags: ['신제품 출시', '제품 영상', 'SNS 소재'], intro: '제품의 핵심 장점을 중심으로 브랜드 영상과 SNS용 짧은 콘텐츠를 함께 구성하는 론칭 캠페인 기획입니다.', range: '제품 메시지 정리, 본편·숏폼 구성, 디지털 홍보 소재', imageNote: '브랜드 캠페인 기획을 위한 숲 이미지', region: '전국', location: '전국·온라인', type: 'concept', serviceIds: ['video', 'design'], goal: 'brand', outputs: ['목표 고객과 제품 메시지 정리', '제품 영상·숏폼 구성', '광고·SNS용 소재 규격 검토'], approach: '고객이 제품을 이해할 핵심 메시지를 먼저 정하고, 웹사이트·SNS·광고 채널에 맞는 결과물을 구성합니다.' },
    { id: 'brand-popup', client: '기업·브랜드 행사 · 기획 예시', title: '브랜드를 직접 만나는 팝업의 순간', image: 'festival', cover: 'MEET THE BRAND.', category: ['brand', 'artist'], tags: ['팝업·브랜드 행사', 'MC 섭외', '현장 기록'], intro: '팝업과 브랜드 행사의 사전 홍보부터 진행자 섭외, 현장 기록까지 연결하는 캠페인 기획입니다.', range: '행사 메시지와 홍보물, MC·출연 역할, 현장 콘텐츠', imageNote: '브랜드 행사 기획을 위한 공연 분위기 이미지', region: '전국', location: '장소·일정 협의', type: 'concept', serviceIds: ['artist', 'video', 'design'], goal: 'brand', outputs: ['사전 홍보 콘텐츠·키비주얼', 'MC·출연자 역할과 조건 정리', '현장 스케치·후속 콘텐츠 구성'], approach: '방문 고객이 브랜드를 경험하는 흐름을 중심으로 사전 홍보, 현장 진행, 행사 후 콘텐츠의 역할을 나눠 준비합니다.' },
    { id: 'local-design', client: '지역 축제 · 기획 예시', title: '우리 동네의 색으로 만드는 축제 브랜딩', image: 'forest', cover: 'OUR LOCAL COLOR.', category: ['brand'], tags: ['키비주얼', '디자인·인쇄'], intro: '축제의 주제를 시각 언어로 정리하고 포스터·SNS 이미지·리플렛으로 확장하는 기획 예시입니다.', range: '키비주얼·홍보물 디자인과 인쇄 구성 검토', imageNote: '분위기 사진이며 실제 수행 프로젝트가 아닙니다.', region: '전국', location: '지역 협의', type: 'concept', serviceIds: ['design', 'print'], goal: 'festival', outputs: ['키비주얼 1종', '포스터·SNS 이미지 구성', '리플렛 제작 범위 검토'], approach: '하나의 콘셉트를 온라인과 오프라인에서 일관되게 사용하는 방향을 보여주는 구성 예시입니다.' },
    { id: 'local-story', client: '로컬 브랜드 · 기획 예시', title: '지역 브랜드의 시작을 전하는 콘텐츠', image: 'forest', cover: 'SMALL STORY, BIG START.', category: ['brand'], tags: ['브랜드 스토리', '언론·영상'], intro: '브랜드의 배경과 사람을 인터뷰하고 보도자료와 짧은 영상의 소재로 정리하는 기획 예시입니다.', range: '스토리 인터뷰, 보도자료 및 영상 방향 구성', imageNote: '분위기 사진이며 실제 수행 프로젝트가 아닙니다.', region: '전국', location: '지역 협의', type: 'concept', serviceIds: ['press', 'video'], goal: 'brand', outputs: ['스토리 인터뷰 주제 정리', '보도자료 구성', '영상 콘텐츠 방향 기획'], approach: '같은 메시지를 인터뷰·문서·영상으로 전달하되 제작과 배포의 범위를 구분하는 방식입니다.' }
  ];
  const detailFallback = '실제 계약 금액은 공개되지 않았습니다. 유사한 결과물을 원하시면 범위와 일정을 기준으로 상담합니다.';
  const state = {
    q: '', category: 'all', region: '전체', kind: '전체', service: 'all', budgetFilter: '전체', savedOnly: false, sort: 'recommended',
    listY: 0, route: '', selected: [], onlyDifferences: false,
    plan: { goal: GOALS[0], budget: BUDGETS[3], region: '', amount: '', schedule: '일정 협의', services: ['video', 'creator'] }
  };
  const main = document.querySelector('main');
  const home = document.createElement('div');
  home.className = 'home-content';
  while (main.firstChild) home.append(main.firstChild);
  const outlet = document.createElement('div');
  outlet.id = 'explore-outlet';
  main.append(home, outlet);

  function nav(path) { closeMenus(); if (location.hash === `#${path}`) route(); else location.hash = path; }
  function pageHeading(kicker, title, text, action = '') { return `<div class="explore-heading"><div><span class="eyebrow">${kicker}</span><h1 tabindex="-1">${title}</h1><p>${text}</p></div>${action}</div>`; }
  function breadcrumbs(items) { return `<nav class="explore-breadcrumbs" aria-label="현재 위치"><a href="#/home">홈</a>${items.map(([label, link]) => `<span aria-hidden="true">/</span>${link ? `<a href="${link}">${label}</a>` : `<span aria-current="page">${label}</span>`}`).join('')}</nav>`; }
  function empty(title, text) { return `<div class="catalog-empty">${icon('bookmark')}<h2>${title}</h2><p>${text}</p><button class="btn secondary" data-explore-action="clear-filters">조건 초기화</button></div>`; }
  function card(r) { return `<article class="reference-card catalog-card"><div class="reference-image"><a href="#/references/${r.id}" aria-label="${esc(r.title)} 상세 보기"><img src="./assets/${r.image}.jpg" alt="${esc(r.imageNote)}" loading="lazy" width="600" height="375"><span class="project-cover">${r.cover}</span></a><span class="example-label">${r.type === 'real' ? '프로젝트 사례' : '기획 예시'}</span><button class="reference-save" data-explore-save="${r.id}" aria-label="${esc(r.title)} ${getSaved().includes(r.id) ? '저장 취소' : '저장'}" aria-pressed="${getSaved().includes(r.id)}">${icon('bookmark')}</button></div><div class="reference-body"><div class="reference-meta">${esc(r.client)} <span>· ${r.location}</span></div><h2><a href="#/references/${r.id}">${r.title}</a></h2><div class="reference-tags">${r.tags.map(t => `<span># ${t}</span>`).join('')}</div><div class="reference-bottom"><span>${r.type === 'real' ? '예산 상담 후 안내' : '가격 미정 · 구성 예시'}</span><a href="#/references/${r.id}">자세히 보기 ${icon('arrow')}</a></div></div></article>`; }
  function filtered() {
    let items = all.filter(r => (!state.q || `${r.title} ${r.client} ${r.tags.join(' ')} ${r.range} ${r.location}`.toLowerCase().includes(state.q.toLowerCase())) && (state.category === 'all' || r.category.includes(state.category)) && (state.region === '전체' || r.region === state.region) && (state.kind === '전체' || r.type === state.kind) && (state.service === 'all' || r.serviceIds.includes(state.service)) && (!state.savedOnly || getSaved().includes(r.id)) && (state.budgetFilter === '전체' || state.budgetFilter === '미공개' && r.type === 'real'));
    if (state.budgetFilter === '공개 예산') items = [];
    if (state.sort === 'title') items.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    if (state.sort === 'saved') items.sort((a, b) => Number(getSaved().includes(b.id)) - Number(getSaved().includes(a.id)));
    return items;
  }
  function updateListURL() {
    const params = new URLSearchParams();
    for (const [key, def] of [['q', ''], ['category', 'all'], ['region', '전체'], ['kind', '전체'], ['service', 'all'], ['budgetFilter', '전체'], ['sort', 'recommended']]) if (state[key] !== def) params.set(key, state[key]);
    if (state.savedOnly) params.set('saved', '1');
    history.replaceState(null, '', `#/references${params.size ? `?${params}` : ''}`);
  }
  function results() {
    const items = filtered();
    const area = document.querySelector('#catalog-grid');
    if (!area) return;
    area.innerHTML = items.length ? items.map(card).join('') : empty(state.savedOnly ? '조건에 맞는 저장한 사례가 없어요.' : '조건에 맞는 사례가 없어요.', state.budgetFilter === '공개 예산' ? '현재 공개된 실제 계약 금액이 없습니다. 미공개 사례의 예산은 상담으로 확인할 수 있어요.' : '검색어를 줄이거나 다른 분야와 지역을 선택해 보세요.');
    document.querySelector('#catalog-count').textContent = `${items.length}개의 이야기`;
    const chips = [['검색', state.q], ['분야', state.service !== 'all' ? services.find(s => s.id === state.service)?.name : ''], ['지역', state.region !== '전체' ? state.region : ''], ['예산', state.budgetFilter !== '전체' ? state.budgetFilter : ''], ['종류', state.kind !== '전체' ? state.kind === 'real' ? '실제 사례' : '기획 예시' : ''], ['저장', state.savedOnly ? '저장한 사례만' : '']];
    document.querySelector('#active-filters').innerHTML = chips.filter(([, v]) => v).map(([n, v]) => `<span>${n} · ${esc(v)}</span>`).join('');
    document.querySelectorAll('[data-catalog-topic]').forEach(b => { const on = b.dataset.catalogTopic === state.category; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
    const sb = document.querySelector('[data-explore-action="saved-only"]');
    sb.setAttribute('aria-pressed', String(state.savedOnly));
    sb.innerHTML = `${icon('bookmark')} 저장한 사례 <span>${getSaved().length}</span>`;
    updateListURL();
  }
  function catalog(params) {
    for (const [key, valid, fallback] of [['category', ['all', 'tourism', 'brand', 'artist'], 'all'], ['region', ['전체', '전남', '제주', '전국'], '전체'], ['kind', ['전체', 'real', 'concept'], '전체'], ['service', ['all', ...services.map(s => s.id)], 'all'], ['budgetFilter', ['전체', '미공개', '공개 예산'], '전체'], ['sort', ['recommended', 'title', 'saved'], 'recommended']]) state[key] = valid.includes(params.get(key)) ? params.get(key) : fallback;
    state.q = (params.get('q') || '').slice(0, 100); state.savedOnly = params.get('saved') === '1';
    const select = (id, label, values, selected) => `<div class="field"><label for="${id}">${label}</label><div class="select-wrap"><select id="${id}">${values.map(([v, n]) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${n}</option>`).join('')}</select>${icon('chevron')}</div></div>`;
    outlet.innerHTML = `<div class="container catalog-page">${breadcrumbs([['레퍼런스']])}${pageHeading('BRANDS, CITIES & REAL CONNECTIONS', '좋은 홍보는,<br>좋은 영감에서 시작됩니다.', '제품 영상과 모델 섭외, 크리에이터 협업부터 지역 홍보까지. 목표와 고객에 맞는 다음 프로젝트를 찾아보세요.', '<a class="btn secondary" href="#/budget">내 예산으로 시작하기 ' + icon('arrow') + '</a>')}<div class="catalog-intro"><div><span class="eyebrow">BRAND IN ACTION</span><h2>제품의 이야기와<br>사람의 영향력이 만나면.</h2><p>강소라 모델 섭외와 브랜드 홍보영상 기획·제작.<br>블루밍비데의 브랜드 캠페인을 살펴보세요.</p><a href="#/references/blooming" class="text-link">블루밍비데 브랜드 영상 이야기 ${icon('arrow')}</a></div><a class="catalog-intro-image brand-reference-cover" href="#/references/blooming" aria-label="블루밍비데 사례 보기"><img src="./assets/clients/blooming-official.png" alt="블루밍비데"><span>MAKE YOUR<br>BRAND BLOOM.</span></a></div><nav class="reference-paths" aria-label="목적별 사례 탐색"><a href="#/references?category=brand"><strong>기업·브랜드 캠페인</strong><span>제품 출시 · 브랜드 영상 · 크리에이터 협업</span>${icon('arrow')}</a><a href="#/references?category=tourism"><strong>지자체·관광 홍보</strong><span>지역 브랜딩 · 여행 콘텐츠 · 공동 캠페인</span>${icon('arrow')}</a></nav><div class="catalog-tools"><div class="catalog-search">${icon('spark')}<label for="catalog-search" class="sr-only">레퍼런스 검색</label><input id="catalog-search" type="search" placeholder="브랜드, 제품, 지역, 콘텐츠로 찾아보세요" maxlength="100" value="${esc(state.q)}"></div><button class="btn secondary saved-only" data-explore-action="saved-only" aria-pressed="${state.savedOnly}">${icon('bookmark')} 저장한 사례 <span>${getSaved().length}</span></button></div><div class="reference-filters" role="group" aria-label="홍보 목적">${[['all', '전체'], ['tourism', '지역·관광 홍보'], ['brand', '기업·브랜드'], ['artist', '아티스트·콘텐츠']].map(([v, t]) => `<button class="filter-button ${state.category === v ? 'active' : ''}" data-catalog-topic="${v}" aria-pressed="${state.category === v}">${t}</button>`).join('')}</div><details class="catalog-filter-panel" open><summary>조건으로 좁혀보기 ${icon('chevron')}</summary><div class="catalog-filter-fields">${select('catalog-service', '홍보 분야', [['all', '분야 전체'], ...services.map(s => [s.id, s.name])], state.service)}${select('catalog-region', '지역', ['전체', '전남', '제주', '전국'].map(s => [s, s === '전체' ? '지역 전체' : s]), state.region)}${select('catalog-kind', '사례 종류', [['전체', '종류 전체'], ['real', '프로젝트 사례'], ['concept', '기획 예시']], state.kind)}${select('catalog-budget', '예산 공개', [['전체', '예산 전체'], ['미공개', '실제 예산 미공개'], ['공개 예산', '실제 예산 공개']], state.budgetFilter)}</div></details><div class="catalog-result-bar"><span id="catalog-count" role="status" aria-live="polite"></span><div><button class="text-link" data-explore-action="clear-filters">조건 초기화</button><label class="sr-only" for="catalog-sort">정렬</label><select id="catalog-sort"><option value="recommended">기본순</option><option value="title" ${state.sort === 'title' ? 'selected' : ''}>제목순</option><option value="saved" ${state.sort === 'saved' ? 'selected' : ''}>저장한 사례 먼저</option></select></div></div><div class="active-filters" id="active-filters"></div><div class="references-grid catalog-grid" id="catalog-grid"></div><section class="explore-banner"><div><span class="eyebrow">MAKE IT YOUR STORY</span><h2>우리 브랜드와 지역에는 어떤 구성이 어울릴까요?</h2><p>목표와 예산에서 다음 이야기를 시작해 보세요.</p></div><a class="btn primary" href="#/budget">홍보 구성 살펴보기 ${icon('arrow')}</a></section></div>`;
    results();
  }
  function detail(id) {
    const r = all.find(r => r.id === id);
    if (!r) return notFound();
    const listLink = `#/references${listParams()}`;
    outlet.innerHTML = `<div class="container reference-detail-page">${breadcrumbs([['레퍼런스', listLink], [r.type === 'real' ? '프로젝트 사례' : '기획 예시']])}<div class="detail-heading"><div><span class="eyebrow">${esc(r.client)} · ${r.location}</span><h1 tabindex="-1">${r.title}</h1><p>${r.intro}</p></div><button class="detail-save btn secondary" data-explore-save="${r.id}" aria-pressed="${getSaved().includes(r.id)}">${icon('bookmark')} ${getSaved().includes(r.id) ? '저장됨' : '사례 저장'}</button></div><figure class="detail-cover"><img src="./assets/${r.image}.jpg" alt="${esc(r.imageNote)}" width="1200" height="675"><span>${r.cover}</span></figure><div class="detail-layout"><article class="detail-story"><section id="story-context"><span class="eyebrow">THE STORY</span><h2>어떤 이야기를 전했나요?</h2><p>${r.intro}</p><p>${r.type === 'real' ? '콘텐츠의 목표와 참여자의 역할을 함께 설계해 프로젝트를 완성했습니다.' : '새로운 프로젝트를 구체화하기 위한 구성 예시입니다. 실제 의뢰 기관이나 수행 실적을 의미하지 않습니다.'}</p></section><section id="story-approach"><span class="eyebrow">THE CONNECTION</span><h2>이렇게 연결했습니다.</h2><p>${r.approach}</p><div class="story-services">${r.serviceIds.map(id => { const s = services.find(s => s.id === id); return `<div>${icon(s.icon)}<strong>${s.name}</strong></div>`; }).join('')}</div></section><section id="story-scope"><span class="eyebrow">PROJECT SCOPE</span><h2>프로젝트의 구성</h2><ul class="scope-list">${r.outputs.map((o, i) => `<li><span>0${i + 1}</span><div><h3>${o}</h3><p>${r.type === 'real' ? '세부 제작 범위는 프로젝트 조건에 맞춰 조정합니다.' : '기획 예시 · 구체적인 범위는 상담 후 조정'}</p></div>${icon('check')}</li>`).join('')}</ul></section><section id="story-budget"><span class="eyebrow">BEFORE YOUR NEXT PROJECT</span><h2>비슷한 프로젝트를 준비한다면</h2><p>같은 분야여도 참여 인원, 촬영·운영 일수, 결과물의 수량과 사용 기간에 따라 구성이 달라집니다. 참고하고 싶은 부분과 중요한 조건을 메모해 주세요.</p><div class="detail-caution"><strong>${r.type === 'real' ? '예산 안내' : '기획 예시 안내'}</strong><p>${r.type === 'real' ? detailFallback + ' ' : '금액과 실적을 임의로 부여하지 않습니다. 결과물의 종류를 참고해 프로젝트 목표와 예산을 함께 정리해 보세요.'}</p></div></section></article><aside class="detail-summary"><span class="eyebrow">PROJECT AT A GLANCE</span><h2>프로젝트 한눈에 보기</h2><dl><div><dt>기관·브랜드</dt><dd>${r.client}</dd></div><div><dt>지역</dt><dd>${r.location}</dd></div><div><dt>홍보 분야</dt><dd>${r.serviceIds.map(id => services.find(s => s.id === id).name).join(' · ')}</dd></div><div><dt>프로젝트 예산</dt><dd>${r.type === 'real' ? '실제 계약 금액 미공개' : '구성 예시 · 금액 미정'}</dd></div></dl><button class="btn primary full-width" data-explore-brief-ref="${r.id}">이 사례로 상담 메모 만들기 ${icon('arrow')}</button><a class="summary-secondary" href="#/budget">예산부터 정리해 볼게요 ${icon('arrow')}</a></aside></div><section class="related-references"><div class="section-heading split-heading"><div><span class="eyebrow">MORE CONNECTIONS</span><h2>다음 이야기도 만나보세요.</h2></div><a class="text-link" href="${listLink}">목록으로 돌아가기 ${icon('arrow')}</a></div><div class="references-grid">${all.filter(x => x.id !== r.id && (x.category.some(c => r.category.includes(c)))).slice(0, 3).map(card).join('')}</div></section></div>`;
  }
  function listParams() {
    const p = new URLSearchParams();
    for (const [k, def] of [['q', ''], ['category', 'all'], ['region', '전체'], ['kind', '전체'], ['service', 'all'], ['budgetFilter', '전체'], ['sort', 'recommended']]) if (state[k] !== def) p.set(k, state[k]);
    if (state.savedOnly) p.set('saved', '1');
    return p.size ? `?${p}` : '';
  }

  function planFromParams(params) {
    const goal = params.get('goal'); const budget = params.get('budget'); const schedule = params.get('schedule');
    if (GOALS.includes(goal)) state.plan.goal = goal;
    if (BUDGETS.includes(budget)) state.plan.budget = budget;
    if (['일정 협의', '2주 이내', '1개월 이내', '2개월 이상'].includes(schedule)) state.plan.schedule = schedule;
    if (params.has('region')) state.plan.region = (params.get('region') || '').slice(0, 80);
    if (budget === '직접 입력' && !params.has('amount')) state.plan.amount = '';
    if (params.has('amount')) { const amount = Number(params.get('amount')); state.plan.amount = Number.isInteger(amount) && amount >= 1 && amount <= 1000000 ? String(amount) : ''; }
    if (params.has('services')) state.plan.services = params.get('services').split(',').filter(id => services.some(s => s.id === id));
  }
  function planQuery() {
    const p = new URLSearchParams({ goal: state.plan.goal, budget: state.plan.budget, region: state.plan.region, schedule: state.plan.schedule, services: state.plan.services.join(',') });
    if (state.plan.budget === '직접 입력') p.set('amount', state.plan.amount);
    return p.toString();
  }
  function budgetLabel() { return state.plan.budget === '직접 입력' ? `${Number(state.plan.amount).toLocaleString('ko-KR')}만원` : state.plan.budget === '미정' ? '상담 후 함께 결정' : state.plan.budget; }
  function budgetPage(params) {
    planFromParams(params);
    const p = state.plan;
    outlet.innerHTML = `<div class="planner-page"><div class="container">${breadcrumbs([['홍보 구성']])}${pageHeading('YOUR BUDGET, NEW POSSIBILITIES', '목표와 예산에서,<br>브랜드와 지역의 다음 이야기를.', '제품 출시, 브랜드 캠페인, 지역 홍보까지. 목표 고객과 활용 채널에 맞는 구성을 함께 그려보세요.')}<section class="planner-presets" aria-labelledby="planner-presets-title"><div><span class="eyebrow">START WITH YOUR PROJECT</span><h2 id="planner-presets-title">어떤 프로젝트를 준비하나요?</h2><p>가까운 유형을 고르면 목적과 홍보 분야를 먼저 구성해 드려요.</p></div><div>${campaignKeys.map(key => { const t = campaignPreset(key); return `<button type="button" data-planner-preset="${key}"><strong>${t.title}</strong><span>${t.summary}</span>${icon('arrow')}</button>`; }).join('')}</div></section><div class="planner-layout"><form class="planner-form" id="planner-form"><div class="planner-step"><span>01</span><div><h2>무엇을 알리고 싶으세요?</h2><p>가장 가까운 목적을 선택해 주세요.</p><div class="planner-goals">${GOALS.map((g, i) => `<label><input type="radio" name="goal" value="${g}" ${g === p.goal ? 'checked' : ''}><span>${icon(['pin', 'mic', 'spark'][i])}<strong>${g}</strong><small>${['지역의 매력과 여행 경험', '브랜드 행사와 축제의 순간', '제품 출시와 브랜드 메시지'][i]}</small></span></label>`).join('')}</div><div class="field"><label for="plan-region">활동·홍보 지역 <span class="optional">선택</span></label><input class="input" id="plan-region" name="region" value="${esc(p.region)}" placeholder="예: 전국·온라인, 서울 성수, 전남 고흥" maxlength="80"></div></div></div><div class="planner-step"><span>02</span><div><h2>예산과 일정을 정리해 볼까요?</h2><div class="form-row"><div class="field"><label for="plan-budget">총 예산 · VAT 포함</label><div class="select-wrap"><select id="plan-budget" name="budget">${BUDGETS.map(b => `<option ${p.budget === b ? 'selected' : ''}>${b}</option>`).join('')}</select>${icon('chevron')}</div></div><div class="field"><label for="plan-schedule">희망 준비 일정</label><div class="select-wrap"><select id="plan-schedule" name="schedule">${['일정 협의', '2주 이내', '1개월 이내', '2개월 이상'].map(t => `<option ${t === p.schedule ? 'selected' : ''}>${t}</option>`).join('')}</select>${icon('chevron')}</div></div></div><div class="field custom-budget" id="custom-budget-field" ${p.budget === '직접 입력' ? '' : 'hidden'}><label for="plan-amount">직접 입력 · 만원</label><input id="plan-amount" class="input" name="amount" type="number" min="1" max="1000000" step="1" value="${esc(p.amount)}" ${p.budget === '직접 입력' ? 'required' : ''} placeholder="예: 1500"></div><p class="planner-help">예산과 일정이 미정이어도 괜찮아요. 실제 진행 가능 여부는 제작 범위를 확인한 뒤 검토합니다.</p></div></div><div class="planner-step"><span>03</span><div><h2>관심 있는 홍보 분야가 있나요?</h2><p>여러 개를 고르거나, 선택 없이 구성 방향을 살펴보세요.</p><div class="planner-service-options">${services.map(s => `<label><input type="checkbox" name="service" value="${s.id}" ${p.services.includes(s.id) ? 'checked' : ''}><span>${icon(s.icon)}${s.name}${icon('check')}</span></label>`).join('')}</div></div></div><div class="planner-submit"><span>입력한 조건으로 구성 아이디어를 확인합니다.</span><button class="btn primary" type="submit">홍보 구성 살펴보기 ${icon('arrow')}</button></div></form><aside class="planner-summary"><span class="eyebrow">YOUR STARTING POINT</span><h2>좋은 시작을 위한<br>세 가지 질문.</h2><ol><li><span>01</span><strong>누구에게 전하고 싶나요?</strong><p>제품 구매 고객, 브랜드 팬, 여행객 등<br>가장 중요한 대상을 생각해 보세요.</p></li><li><span>02</span><strong>어떤 결과물이 필요한가요?</strong><p>제품 영상·숏폼·광고 소재의 규격과<br>출연진, 활용 채널을 함께 정리해요.</p></li><li><span>03</span><strong>어디까지 활용할까요?</strong><p>자사 채널과 유료 광고, 2차 사용의<br>범위와 기간을 함께 정리해요.</p></li></ol><a href="#/references" class="text-link">사례에서 영감 얻기 ${icon('arrow')}</a></aside></div></div></div>`;
  }

  function makePlans() {
    const key = GOAL_KEYS[GOALS.indexOf(state.plan.goal)];
    const base = {
      tourism: [
        { id: 'story', title: '지역 스토리 집중형', icon: 'film', description: '지역의 한 가지 매력을 선명한 영상과 짧은 콘텐츠로 전하는 방향입니다.', outputs: ['주제 중심 영상 구성', 'SNS용 짧은 콘텐츠 구성', '제작 전 콘셉트 정리'], serviceIds: ['video', 'design'], quantity: '주제 영상과 파생 콘텐츠 범위 협의', people: '기획·촬영·편집 팀', channel: '기관 SNS·홈페이지 등 협의', review: '촬영 장소·일수와 결과물 편수' },
        { id: 'people', title: '크리에이터 여행형', icon: 'spark', description: '여행자의 시선으로 장소와 경험을 잇고, 크리에이터 채널의 적합성을 살펴봅니다.', outputs: ['여행 주제와 동선 구성', '크리에이터 후보 검토', '게시·활용 조건 협의'], serviceIds: ['creator', 'video'], quantity: '채널 게시물과 편수 협의', people: '여행 크리에이터·제작 팀', channel: '크리에이터 채널과 2차 활용 협의', review: '섭외·이동 일정과 사용권' },
        { id: 'campaign', title: '지역 캠페인 확장형', icon: 'pin', description: '영상과 사람, 디자인을 하나의 캠페인으로 연결하는 복합 구성을 검토합니다.', outputs: ['통합 캠페인 콘셉트', '콘텐츠·출연자 조합', '온라인·오프라인 홍보물 검토'], serviceIds: ['video', 'creator', 'design', 'print'], quantity: '복수 분야의 결과물 목록 협의', people: '전담 매니저·분야별 수행자', channel: '온라인·오프라인 조합 협의', review: '단계별 예산·일정과 운영 범위' }
      ],
      festival: [
        { id: 'story', title: '축제 콘텐츠 집중형', icon: 'film', description: '행사 전후의 홍보와 현장 기록에 필요한 결과물 위주로 범위를 정리합니다.', outputs: ['행사 홍보 콘셉트', '현장 스케치 영상 구성', 'SNS 홍보물 검토'], serviceIds: ['video', 'design'], quantity: '사전 홍보물·현장 기록 범위 협의', people: '영상·디자인 팀', channel: '주최 기관 채널 협의', review: '촬영 시간·현장 동선·납품일' },
        { id: 'people', title: '아티스트와 무대형', icon: 'mic', description: '행사의 콘셉트와 관객에 맞는 공연·진행 역할을 함께 검토합니다.', outputs: ['가수·공연팀 후보 검토', 'MC·진행 구성', '출연·현장 조건 확인'], serviceIds: ['artist', 'video'], quantity: '출연 인원·시간과 기록 범위 협의', people: '가수·MC·현장 담당자', channel: '행사 현장·촬영 활용 조건 협의', review: '가능 일정·장비·이동·대기 조건' },
        { id: 'campaign', title: '축제 통합 홍보형', icon: 'spark', description: '축제 브랜딩과 출연, 기록 콘텐츠의 전체 흐름을 함께 구성합니다.', outputs: ['축제 키비주얼과 홍보물', '출연·진행 역할 구성', '현장 콘텐츠와 결과 정리'], serviceIds: ['artist', 'design', 'print', 'video'], quantity: '현장·사전 홍보의 결과물 목록 협의', people: '전담 매니저·분야별 수행자', channel: '인쇄물·SNS·행사 현장 협의', review: '운영 책임·안전·납기·사용권' }
      ],
      brand: [
        { id: 'story', title: '제품·브랜드 영상형', icon: 'pen', description: '제품의 핵심 장점과 목표 고객을 정리하고, 론칭 영상·숏폼·광고 소재를 일관된 메시지로 구성합니다.', outputs: ['제품·브랜드 메시지 정리', '본편·숏폼 콘텐츠 구성', '광고·SNS 소재 규격 검토'], serviceIds: ['design', 'video'], quantity: '핵심 콘텐츠와 응용물 범위 협의', people: '기획·디자인·영상 팀', channel: '자사 SNS·웹사이트·광고 활용 협의', review: '원본·이미지·폰트·사용 조건' },
        { id: 'people', title: '크리에이터 협업형', icon: 'spark', description: '목표 고객과 제품 분야에 맞는 크리에이터를 찾고 리뷰·브랜드 콘텐츠의 제작과 게시 조건을 정리합니다.', outputs: ['협업 주제 설정', '크리에이터 후보 검토', '게시·광고 활용 조건'], serviceIds: ['creator', 'video'], quantity: '채널·게시 편수와 활용 범위 협의', people: '크리에이터·제작 팀', channel: '협업 채널·2차 광고 활용 협의', review: '출연·게시 유지·광고 표기 조건' },
        { id: 'campaign', title: '브랜드 통합 홍보형', icon: 'press', description: '브랜드 스토리를 콘텐츠와 보도자료, 오프라인 제작물로 확장하는 방향입니다.', outputs: ['스토리 인터뷰·보도자료', '영상·디자인 구성', '인쇄·제작물 검토'], serviceIds: ['press', 'video', 'design', 'print'], quantity: '취재·제작·배포 범위 구분 후 협의', people: '전담 매니저·콘텐츠 수행자', channel: '브랜드 채널·배포 방식 협의', review: '배포와 게재 구분·원본·활용권' }
      ]
    }[key];
    const chosen = state.plan.services;
    return base.map((p, i) => ({ ...p, originalIndex: i, matches: p.serviceIds.filter(id => chosen.includes(id)).length })).sort((a, b) => b.matches - a.matches || a.originalIndex - b.originalIndex);
  }
  function plansPage(params) {
    planFromParams(params);
    if (state.plan.budget === '직접 입력' && !state.plan.amount) state.plan.budget = '미정';
    const plans = makePlans();
    const editLink = `#/budget?${planQuery()}`;
    const constrained = state.plan.budget === '500만원 미만' || state.plan.budget === '직접 입력' && Number(state.plan.amount) < 500;
    outlet.innerHTML = `<div class="plans-page container">${breadcrumbs([['홍보 구성', editLink], ['구성 살펴보기']])}${pageHeading('A PLAN TO START YOUR CONVERSATION', '우리 프로젝트의 방향,<br>이렇게 그려볼 수 있어요.', '결과물과 참여자, 활용 방식의 차이를 비교하고 관심 있는 구성을 골라보세요.', '<a class="btn secondary" href="' + esc(editLink) + '">조건 다시 정하기</a>')}<div class="plan-conditions"><div><span>홍보 목적</span><strong>${state.plan.goal}</strong></div><div><span>지역</span><strong>${esc(state.plan.region || '상담 후 결정')}</strong></div><div><span>검토 예산 · VAT 포함</span><strong>${budgetLabel()}</strong></div><div><span>준비 일정</span><strong>${state.plan.schedule}</strong></div></div><div class="plan-disclaimer"><strong>${constrained ? '중요한 결과물부터, 범위를 좁혀 검토해 보세요.' : '상담을 시작하기 위한 구성 아이디어입니다.'}</strong><p>${constrained ? '여러 분야를 모두 진행하기보다 우선할 콘텐츠와 참여 범위를 정하는 것이 필요합니다. ' : ''}각 구성의 실행 가능 여부와 금액은 확정되지 않았습니다. 실제 견적은 제작 범위·섭외 조건·사용권을 확인한 뒤 안내합니다.</p></div><div class="plan-cards">${plans.map((p, i) => `<article class="plan-card"><span class="plan-number">DIRECTION 0${i + 1}</span>${icon(p.icon)}<h2>${p.title}</h2><p>${p.description}</p><div class="plan-match">${p.matches ? `관심 분야 ${p.matches}개 포함` : '다른 접근으로 살펴보기'}</div><ul>${p.outputs.map(o => `<li>${icon('check')}${o}</li>`).join('')}</ul><div class="plan-card-budget"><span>총 견적</span><strong>범위 확인 후 안내</strong></div><button class="btn primary full-width" data-plan-brief="${p.id}">이 구성으로 상담 메모 ${icon('arrow')}</button><label class="compare-choice"><input type="checkbox" value="${p.id}" name="compare-plan" ${state.selected.includes(p.id) ? 'checked' : ''}>비교할 구성에 담기</label></article>`).join('')}</div><div class="compare-toolbar"><div><strong id="compare-count">${state.selected.length}개 선택</strong><span>2~3개 구성을 나란히 비교해 보세요.</span></div><button class="btn secondary" data-explore-action="compare" ${state.selected.length < 2 ? 'disabled' : ''}>선택한 구성 비교 ${icon('arrow')}</button></div><section class="plan-comparison" id="plan-comparison" hidden></section><section class="plan-next"><div><span class="eyebrow">NEXT STEP</span><h2>비교할 때, 이것도 함께 확인해요.</h2></div><div class="plan-checklist"><div><strong>01 · 제작 범위</strong><p>편수와 길이, 시안과 수정 횟수를 구체적으로 정해요.</p></div><div><strong>02 · 일정과 참여자</strong><p>준비·촬영·출연·검토 일정을 따로 확인해요.</p></div><div><strong>03 · 활용과 제외 항목</strong><p>사용 기간과 채널, 원본, 추가 비용을 구분해요.</p></div></div></section></div>`;
  }
  function comparison() {
    const selected = makePlans().filter(p => state.selected.includes(p.id));
    const box = document.querySelector('#plan-comparison');
    if (selected.length < 2) { box.hidden = true; return; }
    const data = [
      ['홍보 분야', p => p.serviceIds.map(id => services.find(s => s.id === id).name).join(' · ')],
      ['결과물 범위', p => p.quantity], ['주요 참여자', p => p.people], ['활용 채널', p => p.channel], ['확인할 조건', p => p.review],
      ['선택한 검토 예산', () => budgetLabel() + (state.plan.budget === '미정' ? '' : ' · VAT 포함')],
      ['실제 견적', () => '상세 범위 확인 후 안내'], ['섭외·제작 가능 여부', () => '일정과 조건 확인 필요']
    ];
    const rows = data.filter(([, value]) => !state.onlyDifferences || new Set(selected.map(value)).size > 1);
    box.hidden = false;
    box.innerHTML = `<div class="comparison-heading"><div><span class="eyebrow">SIDE BY SIDE</span><h2>구성의 차이를 확인해 보세요.</h2></div><label><input type="checkbox" id="only-differences" ${state.onlyDifferences ? 'checked' : ''}>차이점만 보기</label></div><div class="comparison-table"><table><caption class="sr-only">선택한 홍보 구성 비교</caption><thead><tr><th scope="col">비교 항목</th>${selected.map(p => `<th scope="col">${p.title}</th>`).join('')}</tr></thead><tbody>${rows.map(([n, val]) => `<tr><th scope="row">${n}</th>${selected.map(p => `<td>${val(p)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="comparison-mobile">${selected.map(p => `<article><h3>${p.title}</h3><dl>${rows.map(([n, val]) => `<div><dt>${n}</dt><dd>${val(p)}</dd></div>`).join('')}</dl><button class="text-link" data-plan-brief="${p.id}">이 구성으로 상담 메모 ${icon('arrow')}</button></article>`).join('')}</div><p class="fine-print">동일한 항목은 차이점 보기에서 숨깁니다. 미정인 조건은 확정된 결과로 표시하지 않습니다.</p>`;
  }
  function notFound() { outlet.innerHTML = `<div class="container explore-not-found"><span class="eyebrow">LET’S FIND YOUR NEXT STORY</span><h1 tabindex="-1">이 이야기를 찾을 수 없어요.</h1><p>주소가 변경되었거나 아직 공개되지 않은 콘텐츠입니다.</p><a class="btn primary" href="#/references">레퍼런스 목록으로 ${icon('arrow')}</a></div>`; }
  function route() {
    closeMenus();
    const old = state.route;
    const isPage = location.hash.startsWith('#/');
    const url = new URL(isPage ? location.hash.slice(1) : '/home', 'https://hey.local');
    state.route = url.pathname;
    document.body.classList.remove('workspace-mode');
    const isHome = !isPage || url.pathname === '/home';
    home.hidden = !isHome; outlet.hidden = isHome;
    document.querySelectorAll('.primary-nav a').forEach(a => { const active = !isHome && a.getAttribute('href') === (url.pathname.startsWith('/references') ? '#/references' : ['/budget', '/plans'].includes(url.pathname) ? '#/budget' : url.pathname.startsWith('/partners') ? '#/partners' : url.pathname.startsWith('/artists') ? '#/artists' : ''); if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const serviceToggle = document.getElementById('services-toggle'); if (url.pathname.startsWith('/services') || url.pathname.startsWith('/solutions')) serviceToggle?.setAttribute('aria-current', 'page'); else serviceToggle?.removeAttribute('aria-current');
    if (isHome) {
      document.title = '헤이엔터씨 — 브랜드와 지역의 가능성을 연결합니다';
      if (location.hash && !isPage) { requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView()); } else window.scrollTo(0, 0);
      return;
    }
    if (uiPages.render(outlet, url.pathname, url.searchParams)) { /* Presentation-only page layouts. */ }
    else if (network.render(outlet, url.pathname, url.searchParams)) { /* Public collaborator profiles and onboarding. */ }
    else if (workspace.render(outlet, url.pathname, url.searchParams)) { /* Workspace owns its content. */ }
    else if (url.pathname === '/about') { outlet.innerHTML = companyPage(icon); document.title = '회사소개 — 헤이엔터씨'; }
    else if (url.pathname === '/references') { catalog(url.searchParams); document.title = '레퍼런스 탐색 — 헤이엔터씨'; }
    else if (/^\/references\/[^/]+$/.test(url.pathname)) { detail(url.pathname.split('/')[2]); document.title = `${all.find(r => r.id === url.pathname.split('/')[2])?.title || '레퍼런스'} — 헤이엔터씨`; }
    else if (url.pathname === '/budget') { budgetPage(url.searchParams); document.title = '예산과 목표 정하기 — 헤이엔터씨'; }
    else if (url.pathname === '/plans') { plansPage(url.searchParams); document.title = '홍보 구성 비교 — 헤이엔터씨'; }
    else { uiPages.render(outlet, '/system', new URLSearchParams()); document.title = '페이지를 찾을 수 없습니다 — 헤이엔터씨'; }
    if (url.pathname === '/references' && /^\/references\//.test(old)) window.scrollTo(0, state.listY); else window.scrollTo(0, 0);
    if (old) outlet.querySelector('h1')?.focus({ preventScroll: true });
    if (url.pathname === '/about' && ['#team', '#founder', '#press'].includes(url.hash)) requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView());
  }

  document.addEventListener('click', event => {
    const el = event.target.closest('a,button'); if (!el) return;
    if (el.matches('a[href^="#/references/"]') && state.route === '/references') state.listY = window.scrollY;
    if (el.dataset.exploreSave) {
      const id = el.dataset.exploreSave; const on = toggleSaved(id); toast(on ? '사례를 이 브라우저에 저장했어요.' : '저장을 해제했어요.');
      if (state.route === '/references') results();
      else { document.querySelectorAll(`[data-explore-save="${id}"]`).forEach(b => { b.setAttribute('aria-pressed', String(on)); if (b.classList.contains('detail-save')) b.innerHTML = `${icon('bookmark')} ${on ? '저장됨' : '사례 저장'}`; }); }
      outlet.querySelector(`[data-explore-save="${id}"]`)?.focus(); return;
    }
    if (el.dataset.plannerPreset) { const preset = campaignPreset(el.dataset.plannerPreset); if (!preset) return; readPlanner(); Object.assign(state.plan, { goal: preset.goal, services: preset.services }); const query = planQuery(); history.replaceState(null, '', '#/budget?' + query); budgetPage(new URLSearchParams(query)); document.querySelector(`[data-planner-preset="${el.dataset.plannerPreset}"]`)?.focus({ preventScroll: true }); toast('홍보 목적과 관심 분야를 구성했어요. 예산과 일정은 이어서 조정해 주세요.'); return; }
    if (el.dataset.catalogTopic) { state.category = el.dataset.catalogTopic; results(); return; }
    if (el.dataset.exploreBriefRef) { const r = all.find(r => r.id === el.dataset.exploreBriefRef); startBrief({ type: r.category.includes('brand') ? '기업·브랜드' : '기관·지자체', title: '', region: r.type === 'real' ? r.region === '전국' ? '전국·온라인' : r.location : '', notes: `참고 사례: ${r.title}\n관심 분야: ${r.serviceIds.map(id => services.find(s => s.id === id).name).join(' · ')}\n참고하고 싶은 부분: ` }); return; }
    if (el.dataset.planBrief) { const p = makePlans().find(p => p.id === el.dataset.planBrief); startBrief({ type: state.plan.goal === '브랜드·콘텐츠' ? '기업·브랜드' : '기관·지자체', title: '', region: state.plan.region, budget: state.plan.budget === '직접 입력' ? '미정' : state.plan.budget, notes: `홍보 목표: ${state.plan.goal}\n관심 구성: ${p.title}\n검토 예산(VAT 포함): ${budgetLabel()}\n준비 일정: ${state.plan.schedule}\n관심 분야: ${state.plan.services.map(id => services.find(s => s.id === id).name).join(' · ') || '상담 후 결정'}\n실제 견적과 가능 여부는 상담 후 확인` }); return; }
    const action = el.dataset.exploreAction;
    if (action === 'saved-only') { state.savedOnly = !state.savedOnly; results(); }
    if (action === 'clear-filters') { state.q = ''; state.category = 'all'; state.region = '전체'; state.kind = '전체'; state.service = 'all'; state.budgetFilter = '전체'; state.savedOnly = false; state.sort = 'recommended'; updateListURL(); catalog(new URLSearchParams()); }
    if (action === 'compare') { comparison(); document.querySelector('#plan-comparison').scrollIntoView({ block: 'start' }); }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'catalog-search') { state.q = event.target.value; results(); }
    if (event.target.closest('#planner-form')) readPlanner();
  });
  document.addEventListener('change', event => {
    const map = { 'catalog-service': 'service', 'catalog-region': 'region', 'catalog-kind': 'kind', 'catalog-budget': 'budgetFilter', 'catalog-sort': 'sort' };
    if (map[event.target.id]) { state[map[event.target.id]] = event.target.value; results(); }
    if (event.target.id === 'plan-budget') { const custom = event.target.value === '직접 입력'; document.querySelector('#custom-budget-field').hidden = !custom; document.querySelector('#plan-amount').required = custom; readPlanner(); }
    if (event.target.closest('#planner-form')) readPlanner();
    if (event.target.name === 'compare-plan') { state.selected = [...outlet.querySelectorAll('[name="compare-plan"]:checked')].map(el => el.value); document.querySelector('#compare-count').textContent = `${state.selected.length}개 선택`; document.querySelector('[data-explore-action="compare"]').disabled = state.selected.length < 2; if (!document.querySelector('#plan-comparison').hidden) comparison(); }
    if (event.target.id === 'only-differences') { state.onlyDifferences = event.target.checked; comparison(); }
  });
  function readPlanner() {
    const form = document.querySelector('#planner-form'); if (!form) return;
    const data = new FormData(form);
    Object.assign(state.plan, { goal: data.get('goal'), region: String(data.get('region')).trim(), budget: data.get('budget'), amount: String(data.get('amount') || ''), schedule: data.get('schedule'), services: data.getAll('service') });
  }
  document.addEventListener('submit', event => { if (event.target.id !== 'planner-form') return; event.preventDefault(); readPlanner(); state.selected = []; state.onlyDifferences = false; nav(`/plans?${planQuery()}`); });
  window.addEventListener('hashchange', route);
  route();
  return { navigate: nav, startPlanning(preset) { Object.assign(state.plan, preset); state.selected = []; nav(`/plans?${planQuery()}`); } };
}
