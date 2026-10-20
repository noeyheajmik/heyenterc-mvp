import { planningPath } from './mvp.js';
import { createWorkspace } from './workspace.js';
import { createExplorer } from './explore.js';
import { createNetwork, PROFILES } from './network.js';

const $ = selector => document.querySelector(selector);
const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const services = [
  { id: 'video', name: '영상 제작', icon: 'film', short: '브랜드와 지역의 이야기를 기억할 콘텐츠로.', description: '제품·브랜드 영상부터 관광 콘텐츠, 숏폼까지. 전하고 싶은 이야기에 맞춰 기획과 촬영, 편집의 범위를 구성합니다.', examples: ['관광·브랜드 홍보영상', '유튜브·여행 콘텐츠', 'SNS 숏폼·현장 스케치'], conditions: '편수와 길이, 촬영 일수, 출연진, 사용 채널·기간, 수정 범위를 함께 정합니다.' },
  { id: 'artist', name: '아티스트 섭외', icon: 'mic', short: '행사의 순간을 특별하게 만드는 만남.', description: '가수와 MC, 프로젝트에 맞는 출연진을 함께 검토합니다. 행사 목적과 관객, 지역과 일정을 바탕으로 적합한 역할을 구성합니다.', examples: ['가수·공연팀 섭외', 'MC·행사 진행자', '콘텐츠 출연진'], conditions: '출연료와 가능 일정, 공연 시간, 이동·숙박, 촬영과 활용 조건을 확인한 뒤 진행합니다.' },
  { id: 'creator', name: '인플루언서 협업', icon: 'spark', short: '사람의 시선으로 전하는 브랜드의 매력.', description: '제품과 지역의 이야기를 자신만의 시선으로 전할 크리에이터를 연결합니다. 채널의 특성과 콘텐츠 형식에 맞게 협업을 기획합니다.', examples: ['여행 크리에이터', '로컬 체험 콘텐츠', '브랜드 공동 캠페인'], conditions: '게시 채널과 편수, 게시 유지 기간, 2차 활용과 광고 집행 조건을 구분해 협의합니다.' },
  { id: 'press', name: '언론·보도 콘텐츠', icon: 'press', short: '브랜드와 지역의 새로운 소식을 더 멀리.', description: '알리고 싶은 지역 소식과 브랜드 이야기를 인터뷰와 보도자료로 정리합니다. 목적에 맞는 소재와 배포 방향을 함께 검토합니다.', examples: ['보도자료 기획·작성', '스토리 인터뷰', '배포와 홍보 방향 제안'], conditions: '취재·작성·배포·유료 노출 여부를 구분합니다. 기사 게재는 매체의 판단과 별도 조건에 따릅니다.' },
  { id: 'festival', name: '축제 운영', icon: 'festival', short: '기획한 순간을 완성도 있는 현장으로.', description: '지역 축제와 브랜드 행사의 기획부터 현장 운영까지 연결합니다. 프로그램과 동선, 출연진과 운영 인력을 함께 구성해 행사의 흐름을 만듭니다.', examples: ['축제·행사 프로그램 기획', '무대·현장 운영', '운영 인력·동선 구성'], conditions: '행사 규모와 장소, 운영 기간, 인력과 장비, 안전 관리 역할과 책임 범위를 함께 확인합니다.' },
  { id: 'print', name: '인쇄·디자인', icon: 'print', short: '브랜드의 인상을 디자인하고 제작합니다.', description: '브랜드와 축제의 키비주얼부터 포스터·SNS 콘텐츠·리플렛까지. 시각 디자인과 인쇄 제작을 하나의 흐름으로 구성합니다.', examples: ['키비주얼·브랜딩 디자인', '포스터·SNS 콘텐츠', '리플렛·인쇄 홍보물'], conditions: '시안·수정 횟수와 원본 사용권, 제작 규격·재질·수량, 후가공과 납기·배송을 함께 확인합니다.' }
];

const references = [
  { id: 'goheung', client: '고흥군', title: '여행자의 시선으로 만나는<br>고흥의 새로운 매력', image: 'jeju-coast', cover: 'GO, HEUNG.', category: ['tourism', 'artist'], tags: ['관광 브랜딩', '유튜브 콘텐츠'], intro: '김기리·문지인 부부의 출연과 문지인 유튜브 콘텐츠 기획·제작으로 고흥의 관광 매력을 전한 프로젝트입니다.', range: '콘텐츠 기획·제작, 출연진 섭외, 지역 관광 브랜딩', imageNote: '이미지는 제주 해안의 분위기 사진으로, 해당 프로젝트의 실제 촬영 장면이 아닙니다.' },
  { id: 'blackyak', client: '고흥군 × 블랙야크', title: '지역과 브랜드가 함께한<br>특별한 여행 이야기', image: 'forest', cover: 'BETTER, TOGETHER.', category: ['tourism', 'brand'], tags: ['브랜드 협업', '크리에이터'], intro: '강소라 유튜브 콘텐츠를 기획·제작하고, 지역 여행 콘텐츠와 블랙야크의 브랜드 홍보를 함께 연결한 공동 캠페인입니다.', range: '출연진 섭외, 여행 콘텐츠 기획·제작, 지자체와 브랜드 협업', imageNote: '이미지는 숲의 분위기 사진으로, 해당 캠페인의 실제 결과물이 아닙니다.' },
  { id: 'music', client: '고흥군', title: '지역의 이야기가<br>한 곡의 음악이 되다', image: 'festival', cover: 'SOUND OF LOCAL.', category: ['artist'], tags: ['아티스트 섭외', '음악 프로젝트'], intro: '가수 자두와 프로듀서 로코베리 안영민이 참여한 고흥군 관광 브랜딩 음악 프로젝트입니다.', range: '아티스트 섭외, 음악 콘텐츠를 통한 관광 브랜딩', imageNote: '이미지는 일반 공연의 분위기 사진으로, 해당 아티스트의 실제 공연이나 납품 콘텐츠가 아닙니다.' }
];

let saved = [];
try { const data = JSON.parse(localStorage.getItem('hey-home-saved') || '[]'); if (Array.isArray(data)) saved = data.filter(id => typeof id === 'string' && /^[a-z-]+$/.test(id)); } catch { /* Storage is optional. */ }
let referenceFilter = 'all';
let briefDraft = { title: '', region: '', type: '기관·지자체', budget: '미정', notes: '' };
let memo = '';
let toastTimer;
const modal = $('#modal');

function toast(text) {
  $('#toast').textContent = text;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
}

function renderServices() {
  $('#services-grid').innerHTML = services.map(s => `<a class="service-card" href="#/services/${s.id}" aria-label="${s.name} 서비스 자세히 보기"><svg class="service-icon" aria-hidden="true"><use href="#i-${s.icon}"/></svg><svg class="card-arrow" aria-hidden="true"><use href="#i-up-right"/></svg><h3>${s.name}</h3><p>${s.short}</p></a>`).join('');
  $('#mega-links').innerHTML = services.map(s => `<a class="mega-link" href="#/services/${s.id}">${icon(s.icon)}<span><strong>${s.name}</strong><small>${s.examples[0]}</small></span></a>`).join('');
}

function renderReferences() {
  if (!$('#references-grid')) return;
  $('#references-grid').innerHTML = references.filter(r => referenceFilter === 'all' || r.category.includes(referenceFilter)).map(r => `<article class="reference-card"><div class="reference-image"><img src="./assets/${r.image}.jpg" alt="${esc(r.imageNote)}" loading="lazy" width="600" height="375"><button class="reference-save" data-save="${r.id}" aria-label="${r.client} 사례 ${saved.includes(r.id) ? '저장 취소' : '저장'}" aria-pressed="${saved.includes(r.id)}">${icon('bookmark')}</button><span class="project-cover">${r.cover}</span></div><div class="reference-body"><div class="reference-meta">${r.client}</div><h3><button data-reference="${r.id}">${r.title}</button></h3><div class="reference-tags">${r.tags.map(t => `<span># ${t}</span>`).join('')}</div><div class="reference-bottom"><span>프로젝트 사례</span><button data-reference="${r.id}">이야기 보기 ${icon('arrow')}</button></div></div></article>`).join('');
}

function closeMenus() {
  $('#services-menu').hidden = true;
  $('#services-toggle').setAttribute('aria-expanded', 'false');
  $('#mobile-menu').hidden = true;
  $('#mobile-toggle').setAttribute('aria-expanded', 'false');
  $('#mobile-toggle').setAttribute('aria-label', '메뉴 열기');
  document.body.classList.remove('menu-open');
}

function showModal(title, body, eyebrow = 'HEY! ENTER C') {
  closeMenus();
  modal.innerHTML = `<div class="modal-header"><div><span class="eyebrow">${eyebrow}</span><h2 id="modal-title">${title}</h2></div><button class="icon-button" data-action="close-modal" aria-label="닫기">${icon('close')}</button></div><div class="modal-body">${body}</div>`;
  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
}

function serviceModal(id) {
  const s = services.find(s => s.id === id);
  if (!s) return;
  showModal(s.name, `<p>${s.description}</p><div class="modal-services">${s.examples.map(e => `<span>${e}</span>`).join('')}</div><dl class="detail-list"><div><dt>함께 정할 것</dt><dd>${s.conditions}</dd></div><div><dt>예산</dt><dd>세부 범위와 일정 확인 후 안내</dd></div><div><dt>진행 방식</dt><dd>전담 매니저와 목표를 정리하고 필요한 파트너를 구성합니다.</dd></div></dl><div class="modal-actions"><button class="btn secondary" data-action="close-modal">닫기</button><button class="btn primary" data-service-brief="${s.id}">이런 홍보를 생각하고 있어요 ${icon('arrow')}</button></div>`, 'OUR SERVICES');
}

function referenceModal(id) {
  explorer.navigate(`/references/${id}`);
}

function startBrief(preset = {}) {
  briefDraft = { ...briefDraft, ...preset };
  const options = ['미정', '500만원 미만', '500만~1,000만원', '1,000만~3,000만원', '3,000만~5,000만원', '5,000만원 이상'];
  showModal('브랜드와 프로젝트의 이야기를 들려주세요.', `<p>생각한 목표와 예산을 가볍게 정리해 보세요.<br>입력한 내용으로 상담에 사용할 메모를 만듭니다.</p><form class="modal-form" id="brief-form"><div class="field"><label for="brief-title">프로젝트 이름 <span aria-hidden="true">*</span></label><input class="input" id="brief-title" name="title" placeholder="예: 신제품 브랜드 영상, 가을 관광 콘텐츠" maxlength="80" value="${esc(briefDraft.title)}" required></div><div class="form-row"><div class="field"><label for="brief-region">활동·홍보 지역 <span aria-hidden="true">*</span></label><input class="input" id="brief-region" name="region" placeholder="예: 전국·온라인, 서울 성수, 전남 고흥" maxlength="60" value="${esc(briefDraft.region)}" required></div><div class="field"><label for="brief-type">의뢰 유형</label><div class="select-wrap"><select id="brief-type" name="type">${['기업·브랜드', '기관·지자체', '개인', '로컬 브랜드·사업자', '파트너 참여'].map(v => `<option ${v === briefDraft.type ? 'selected' : ''}>${v}</option>`).join('')}</select>${icon('chevron')}</div></div></div><div class="field"><label for="brief-budget">총 예산 · VAT 포함</label><div class="select-wrap"><select id="brief-budget" name="budget">${options.map(v => `<option ${v === briefDraft.budget ? 'selected' : ''}>${v}</option>`).join('')}</select>${icon('chevron')}</div></div><div class="field"><label for="brief-notes">알리고 싶은 이야기</label><textarea class="input" id="brief-notes" name="notes" placeholder="목표 고객, 브랜드·제품, 희망 일정과 필요한 콘텐츠를 알려주세요." maxlength="2000">${esc(briefDraft.notes)}</textarea></div><button class="btn primary full-width" type="submit">상담 메모 만들기 ${icon('arrow')}</button></form>`, 'START YOUR NEXT STORY');
}

const directions = {
  '관광·지역 홍보': [
    ['지역의 이야기를 담는 영상', '명소와 로컬의 매력을 하나의 주제로 정리하는 방향입니다. 관광 홍보영상이나 짧은 SNS 콘텐츠의 범위를 검토해 볼 수 있어요.', ['홍보 주제와 타겟 설정', '영상 형태·길이·편수 검토', '활용 채널과 사용 기간 확인']],
    ['여행자의 시선으로 전하는 콘텐츠', '여행 크리에이터의 시선으로 지역을 경험하고 소개합니다. 섭외 조건과 촬영·게시 범위를 함께 확인해요.', ['지역 경험과 방문 동선 기획', '크리에이터 후보와 일정 확인', '게시·활용 조건 정리']]
  ],
  '축제·행사': [
    ['행사의 분위기를 만드는 만남', '관객과 행사 콘셉트에 맞는 가수·공연팀·MC의 역할을 검토합니다. 실제 섭외 가능 여부는 일정과 조건 확인이 필요해요.', ['행사 목적과 관객 정리', '공연·진행 역할 구성', '출연·현장 운영 조건 확인']],
    ['축제 전후를 잇는 홍보 콘텐츠', '행사를 알리는 디자인부터 현장을 기록하는 영상까지. 필요한 시점과 결과물에 맞춰 범위를 정리하는 방향입니다.', ['포스터·SNS 홍보물 검토', '현장 스케치 영상 구성', '제작·배포 일정 정리']]
  ],
  '브랜드·콘텐츠': [
    ['브랜드의 이야기를 선명하게', '누구에게 어떤 가치를 전할지 먼저 정리하고 영상과 디자인을 연결합니다. 필요한 결과물 위주로 구성해요.', ['브랜드 목표와 메시지 정리', '영상·디자인 결과물 검토', '원본·사용권·수정 조건 확인']],
    ['사람과 브랜드가 만나는 협업', '크리에이터와 브랜드가 자연스럽게 만나는 콘텐츠를 검토합니다. 채널 적합성과 2차 활용 조건을 함께 살펴요.', ['협업 주제와 적합한 채널', '출연·게시 조건 검토', '광고 집행과 활용 범위 확인']]
  ]
};

function budgetResult(goal, budget) {
  explorer.startPlanning({ goal, budget });
}


function downloadMemo() {
  const url = URL.createObjectURL(new Blob(['\ufeff', memo], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = '헤이엔터씨_상담메모.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('상담 메모를 파일로 저장합니다.');
}

document.addEventListener('click', event => {
  if (event.target.closest('.skip-link')) { event.preventDefault(); const heading = document.querySelector('#explore-outlet:not([hidden]) h1') || document.querySelector('#hero-title'); heading.setAttribute('tabindex', '-1'); heading.focus(); heading.scrollIntoView(); return; }
  const el = event.target.closest('button,a');
  if (!el) { if (!event.target.closest('.nav-dropdown')) { $('#services-menu').hidden = true; $('#services-toggle').setAttribute('aria-expanded', 'false'); } return; }
  if (el.id === 'services-toggle') { const next = $('#services-menu').hidden; $('#services-menu').hidden = !next; el.setAttribute('aria-expanded', String(next)); return; }
  if (el.id === 'mobile-toggle') { const next = $('#mobile-menu').hidden; $('#mobile-menu').hidden = !next; el.setAttribute('aria-expanded', String(next)); el.setAttribute('aria-label', next ? '메뉴 닫기' : '메뉴 열기'); document.body.classList.toggle('menu-open', next); return; }
  if (el.matches('a[href^="#"]')) closeMenus();
  if (el.dataset.service) { serviceModal(el.dataset.service); return; }
  if (el.dataset.reference) { referenceModal(el.dataset.reference); return; }
  if (el.dataset.filter) { referenceFilter = el.dataset.filter; document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === el); b.setAttribute('aria-pressed', String(b === el)); }); renderReferences(); return; }
  if (el.dataset.save) {
    const id = el.dataset.save; const exists = saved.includes(id); saved = exists ? saved.filter(s => s !== id) : [...saved, id];
    try { localStorage.setItem('hey-home-saved', JSON.stringify(saved)); } catch { /* Session UI still works. */ }
    renderReferences(); $(`[data-save="${id}"]`)?.focus(); toast(exists ? '저장을 해제했어요.' : '관심 있는 사례로 이 브라우저에 저장했어요.'); return;
  }
  if (el.dataset.serviceBrief) { const s = services.find(s => s.id === el.dataset.serviceBrief); modal.close(); explorer.navigate(planningPath({services:[s.id],goal:['artist','festival'].includes(s.id)?'축제·행사':'브랜드·콘텐츠'})); return; }
  if (el.dataset.referenceBrief) { const r = references.find(r => r.id === el.dataset.referenceBrief); modal.close(); explorer.navigate(planningPath({source:r.title.replace('<br>',' '),goal:r.category.includes('brand')?'브랜드·콘텐츠':'관광·지역 홍보',services:r.id==='music'?['artist']:['video','creator']})); return; }
  if (el.dataset.direction !== undefined) { const d = directions[el.dataset.goal][Number(el.dataset.direction)]; startBrief({ budget: el.dataset.budget, notes: `홍보 목표: ${el.dataset.goal}\n관심 있는 구성: ${d[0]}` }); return; }
  const action = el.dataset.action;
  if (el.dataset.businessPreset) { explorer.navigate(planningPath({client:el.dataset.businessPreset,goal:el.dataset.businessPreset==='institution'?'관광·지역 홍보':'브랜드·콘텐츠',services:el.dataset.businessPreset==='institution'?['video','creator']:['video','print']})); return; }
  if (action === 'start-project') { modal.close(); explorer.navigate('/budget'); return; }
  if (action === 'close-modal') { modal.close(); return; }
  if (action === 'brief') { startBrief(); return; }
  if (action === 'partners' || action === 'artists') { explorer.navigate('/' + action); return; }
  if (action === 'join') { explorer.navigate('/join'); return; }
  if (action === 'partner-memo') { startBrief({ type: '파트너 참여', notes: '전문 분야와 포트폴리오, 협업 조건을 정리하고 싶습니다.' }); return; }
  if (action === 'account') { workspace.enter(); return; }
  if (action === 'workspace-draft') { modal.close(); explorer.navigate(planningPath(briefDraft)); return; }
  if (action === 'process') { showModal('기획부터 실행까지, 함께 정리합니다.', `<div class="option-list"><div class="option-card"><span>01 · 프로젝트 브리프</span><h3>목표와 조건을 먼저 확인해요</h3><p>홍보 목적, 예산, 일정과 참고 사례를 바탕으로 필요한 범위를 구체화합니다.</p></div><div class="option-card"><span>02 · 맞춤 제안</span><h3>콘텐츠와 사람을 함께 구성해요</h3><p>제작 범위와 참여자, 비용과 일정을 제안하고 의견을 주고받습니다.</p></div><div class="option-card"><span>03 · 제작과 결과물</span><h3>진행 과정과 피드백을 연결해요</h3><p>문서와 작업물을 정리하고 합의한 범위에 맞춰 결과물을 검토합니다.</p></div></div><div class="modal-actions"><button class="btn primary" data-action="start-project">홍보 구성 찾기 ${icon('arrow')}</button></div>`, 'HOW WE WORK'); return; }
  if (action === 'download-memo') { downloadMemo(); return; }
  if (action === 'edit-memo') { startBrief(); return; }
  if (action === 'copy-memo') { if (!navigator.clipboard) { toast('복사할 수 없는 환경입니다. 메모를 파일로 저장해 주세요.'); return; } navigator.clipboard.writeText(memo).then(() => toast('상담 메모를 복사했어요.')).catch(() => toast('복사할 수 없는 환경입니다. 메모를 파일로 저장해 주세요.')); return; }

});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modal.open) { const wasOpen = !$('#mobile-menu').hidden || !$('#services-menu').hidden; const mobileOpen = !$('#mobile-menu').hidden; closeMenus(); if (wasOpen) (mobileOpen ? $('#mobile-toggle') : $('#services-toggle')).focus(); }
});
window.addEventListener('resize', () => { if (window.innerWidth > 1000 && !$('#mobile-menu').hidden) closeMenus(); });
modal.addEventListener('click', event => { if (event.target === modal) { const r = modal.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) modal.close(); } });
modal.addEventListener('input', event => { if (event.target.closest('#brief-form')) briefDraft = Object.fromEntries(new FormData($('#brief-form'))); });
document.addEventListener('submit', event => {
  if (event.target.id === 'budget-form') { event.preventDefault(); const data = new FormData(event.target); budgetResult(data.get('goal'), data.get('budget')); }
  if (event.target.id === 'brief-form') {
    event.preventDefault(); briefDraft = Object.fromEntries(new FormData(event.target));
    briefDraft.title = briefDraft.title.trim(); briefDraft.region = briefDraft.region.trim();
    if (!briefDraft.title || !briefDraft.region) { toast('프로젝트 이름과 지역을 공백 없이 입력해 주세요.'); return; }
    const d = briefDraft;
    memo = `헤이엔터씨 상담 메모\n\n프로젝트: ${d.title}\n지역: ${d.region}\n의뢰 유형: ${d.type}\n총 예산(VAT 포함): ${d.budget}\n\n알리고 싶은 이야기\n${d.notes || '상담 시 함께 정리'}`;
    showModal('우리 프로젝트의 시작을 정리했어요.', `<p>문의 내용을 확인하고 복사·파일로 저장해 두세요.</p><div class="brief-success"><strong>${esc(d.title)}</strong><p><b>지역과 의뢰 유형</b>${esc(d.region)} · ${esc(d.type)}</p><p><b>총 예산 · VAT 포함</b>${esc(d.budget)}</p><p><b>알리고 싶은 이야기</b>${esc(d.notes || '상담 시 함께 정리').replaceAll('\n', '<br>')}</p></div><div class="modal-actions"><button class="btn primary" data-action="workspace-draft">홍보 구성 찾기로 ${icon('arrow')}</button><button class="btn secondary" data-action="edit-memo">수정하기</button><button class="btn secondary" data-action="copy-memo">메모 복사</button><button class="btn secondary" data-action="download-memo">${icon('download')}파일로 저장</button></div>`, 'YOUR FIRST PROJECT NOTE');
  }
});

document.querySelectorAll('svg').forEach(el => el.setAttribute('aria-hidden', 'true'));
renderServices();
renderReferences();

const collaborationHub = { requests: [] };
const workspace = createWorkspace({ hub: collaborationHub, profiles: PROFILES, icon, esc, services, toast, showModal, closeMenus });

const network = createNetwork({ icon, esc, toast, startBrief, closeMenus, hub: collaborationHub });
const explorer = createExplorer({
  workspace, network,
  references, services, icon, esc, showModal, startBrief, closeMenus, toast,
  getSaved: () => saved,
  toggleSaved(id) {
    saved = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
    try { localStorage.setItem('hey-home-saved', JSON.stringify(saved)); } catch { /* Optional storage. */ }
    renderReferences();
    return saved.includes(id);
  }
});
