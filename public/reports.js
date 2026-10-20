import { clientOrganization } from './client-types.js';
import { campaignRows } from './campaign-brief.js';
import { budgetTotals, won } from './budget.js';

export function projectSummary(p) {
  const budget = p.budgetSnapshots?.at(-1);
  const tasks = p.tasks || [], deliverables = p.deliverables || [], participants = p.participants || [];
  const checks = [
    { label: '담당자 배정', complete: !!p.manager, detail: p.manager || '배정 전', tab: 'people' },
    { label: '최신 제안 구성 검토', complete: !!p.proposal && !!p.reviewed, detail: p.proposal ? `${p.latestVersion || p.version} · ${p.reviewed ? '구성 검토 완료' : '검토 대기'}` : '제안 미공유', tab: 'proposals' },
    { label: '제작 일정 확인', complete: !!tasks.length && tasks.every(t => t.stage === '완료'), detail: tasks.length ? `${tasks.filter(t => t.stage === '완료').length} / ${tasks.length} 완료` : '일정 미등록', tab: 'schedule' },
    { label: '예산 구성 검토', complete: budget?.reviewStatus === '구성 확인 완료', detail: budget ? `${budget.version} · ${budget.reviewStatus}` : '검토본 미공유', tab: 'budget' },
    { label: '결과물 검토메모 확인', complete: !!deliverables.length && deliverables.every(d => d.status === '메모 확인 완료'), detail: deliverables.length ? `${deliverables.filter(d => d.status === '메모 확인 완료').length} / ${deliverables.length} 확인` : '검토메모 미공유', tab: 'schedule' }
  ];
  if (p.briefUpdates?.length) checks.push({ label: '브리프 보완 요청 검토', complete: p.briefUpdates.every(u => u.status === '검토 완료'), detail: `${p.briefUpdates.filter(u => u.status === '검토 완료').length} / ${p.briefUpdates.length} 검토 완료`, tab: 'brief' });
  const sections = [
    { title: '프로젝트 기본 정보', rows: [['프로젝트', p.title], ['프로젝트 지역', p.region], ['의뢰 담당자', p.client?.displayName || '미정'], ['기관·브랜드', clientOrganization(p.client)], ['부서·팀', p.client?.department || '미작성'], ['프로젝트 목표', p.goal], ['진행 상태', p.status], ['담당 매니저', p.manager || '배정 전'], ['희망 완료일', p.date || '일정 협의'], ['의뢰자 검토 예산 · VAT 포함', p.budget]] },
    ...(campaignRows(p.campaign).length ? [{ title: '캠페인 기획 조건', rows: campaignRows(p.campaign) }] : []),
    { title: '프로젝트 방향과 제안', rows: [['요청 내용', p.notes || '미작성'], ['최신 제안', p.proposal ? p.latestVersion || p.version : '아직 없음'], ['제안 검토', p.proposal ? p.reviewed ? '구성 검토 완료' : '검토 대기' : '제안 미공유'], ['최근 수정 의견', p.feedback || '없음']] },
    ...(p.briefUpdates?.length ? [{ title: '브리프 보완 요청', rows: p.briefUpdates.map(u => [u.version + ' · ' + u.reason, `${u.status}\n${u.details}\n요청 예산(VAT 포함): ${u.budget || '변경 요청 없음'}\n요청 희망일: ${u.date || '변경 요청 없음'}\n검토 메모: ${u.reviewNote || '아직 없음'}`]) }] : []),
    { title: '제작 일정', rows: tasks.length ? tasks.map(t => [t.title, `${t.date || t.due || '일정 협의'} · ${t.stage}`]) : [['등록 상태', '일정 미등록']] },
    { title: '프로젝트 참여자', rows: participants.length ? participants.map(person => [person.name, `${person.kind} · ${person.role} · ${person.status}`]) : [['등록 상태', '추가 참여자 없음']] },
    { title: '최신 공유 예산', rows: budget ? [['검토본', budget.version], ['구성 합계 · VAT 포함', won(budgetTotals(budget).total)], ['관리 예산 · VAT 포함', budgetTotals(budget).cap === null ? '미정' : won(budgetTotals(budget).cap)], ['구성 검토', budget.reviewStatus], ['포함·별도 조건', budget.notes || '상세 조건 협의'], ...budget.items.map(item => [item.title, `${item.quantity}${item.unit} × ${won(item.unitCost)} = ${won(item.quantity * item.unitCost)} · VAT 포함`]), ['검토 의견', budget.feedback || '없음']] : [['공유 상태', '예산 검토본 미공유']] },
    { title: '결과물 검토메모', rows: deliverables.length ? deliverables.map(item => [item.title, `v${item.revision}.0 · ${item.status}\n확인할 내용: ${item.scope}${item.reviewNote ? '\n검토 의견: ' + item.reviewNote : ''}`]) : [['공유 상태', '검토메모 미공유']] },
    { title: '프로젝트 자료', rows: [['문서 수', `${p.documents?.length || 0}개`], ['대화 수', `${p.messages?.length || 0}개`], ['표시 범위', '최근 문서 최대 8개'], ...(p.documents || []).slice(0, 8).map(d => [d.title, `${d.kind} · ${d.version}`])] }
  ];
  return { checks, sections, done: checks.filter(c => c.complete).length, pending: checks.filter(c => !c.complete) };
}
export function projectSummaryText(p, at = new Date().toLocaleString('ko-KR')) {
  const summary = projectSummary(p);
  return `헤이엔터씨 프로젝트 진행 요약\n\n작성 시각: ${at}\n프로젝트용 요약\n\n확인 현황: ${summary.done} / ${summary.checks.length}\n${summary.checks.map(c => `${c.complete ? '[확인]' : '[확인 필요]'} ${c.label}: ${c.detail}`).join('\n')}\n\n${summary.sections.map(section => `${section.title}\n${'-'.repeat(24)}\n${section.rows.map(([label, value]) => `${label}: ${value ?? ''}`).join('\n\n')}`).join('\n\n')}\n\n이 요약은 현재 프로젝트의 진행 정보를 기준으로 작성했습니다.`;
}
export function createReports({ projects, icon, esc, toast, doc, message }) {
  function render(p, staff = false) {
    const summary = projectSummary(p);
    const href = tab => staff ? `#/staff/projects/${p.id}/${['proposals', 'brief'].includes(tab) ? '' : tab}`.replace(/\/$/, '') : `#/workspace/projects/${p.id}/${tab}`;
    return `<div class="report-page"><section class="ws-panel report-intro"><div><span class="eyebrow">EVERY DETAIL, ONE CLEAR VIEW</span><h2>프로젝트 진행 요약</h2><p>흩어진 진행 정보와 남은 확인 항목을 한눈에 살펴보세요.</p></div><div class="report-actions"><button class="btn secondary" data-report-action="copy" data-project="${p.id}">요약 복사 ${icon('file')}</button><button class="btn secondary" data-report-action="download" data-project="${p.id}">텍스트로 저장 ${icon('download')}</button>${staff ? `<button class="btn primary" data-report-action="save" data-project="${p.id}">문서함에 요약 보관 ${icon('plus')}</button>` : ''}</div></section><div class="report-stats"><div><span>확인한 항목</span><strong>${summary.done}<small> / ${summary.checks.length}</small></strong></div><div><span>남은 확인 항목</span><strong>${summary.pending.length}<small>개</small></strong></div><div><span>공유한 검토메모</span><strong>${p.deliverables?.length || 0}<small>개</small></strong></div></div><section class="ws-panel"><div class="ws-panel-heading"><h2>다음으로 확인할 일</h2><span class="ws-small-label">진행 정보 기준</span></div><div class="report-checks">${summary.checks.map(check => `<a class="report-check ${check.complete ? 'complete' : ''}" href="${href(check.tab)}"><span class="network-glyph">${icon(check.complete ? 'check' : 'folder')}</span><div><strong>${check.label}</strong><p>${esc(check.detail)}</p></div><span class="collab-status">${check.complete ? '확인' : '확인 필요'}</span>${icon('arrow')}</a>`).join('')}</div><p class="fine-print report-disclosure">확인 현황은 실제 납품 승인이나 계약·프로젝트 완료를 뜻하지 않습니다.</p></section><div class="report-section-grid">${summary.sections.map(section => `<section class="ws-panel"><h2>${section.title}</h2><dl class="report-facts">${section.rows.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value).replaceAll('\n', '<br>')}</dd></div>`).join('')}</dl></section>`).join('')}</div><p class="fine-print report-disclosure">현재 프로젝트 데이터의 요약입니다. 실제 성과 수치나 납품 파일의 증빙은 포함하지 않습니다.</p></div>`;
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-report-action]'); if (!button) return;
    const p = projects.find(p => p.id === button.dataset.project); if (!p) return;
    const text = projectSummaryText(p);
    if (button.dataset.reportAction === 'copy') { if (!navigator.clipboard) { toast('복사할 수 없는 환경입니다. 텍스트로 저장해 주세요.'); return; } navigator.clipboard.writeText(text).then(() => toast('프로젝트 진행 요약을 복사했어요.')).catch(() => toast('복사할 수 없는 환경입니다. 텍스트로 저장해 주세요.')); }
    if (button.dataset.reportAction === 'download') { const url = URL.createObjectURL(new Blob(['\ufeff', text], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = p.title.replace(/[\\/:*?"<>|]/g, '-') + '_진행요약.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('프로젝트 진행 요약을 텍스트로 저장합니다.'); }
    if (button.dataset.reportAction === 'save') { p.summaryVersion = (p.summaryVersion || 0) + 1; const file = doc('프로젝트 진행 요약', '진행 요약', text); file.version = `v${p.summaryVersion}.0`; p.documents.unshift(file); p.messages.push(message(`프로젝트 진행 요약 ${file.version}을 문서함에 보관했습니다. 저장 시점의 프로젝트 정보입니다.`)); const page = button.closest('.report-page'); const y = scrollY; if (page) page.outerHTML = render(p, true); window.scrollTo(0, y); document.querySelector('[data-report-action="save"]')?.focus({ preventScroll: true }); toast(`진행 요약 ${file.version}을 프로젝트 문서함에 보관했어요.`); }
  });
  return { render };
}
