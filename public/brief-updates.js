export function createBriefUpdates({ projects, budgets, icon, esc, toast, doc, message }) {
  const drafts = {}, reviews = {};
  let refresh = () => {};
  const stages = ['검토 중', '추가 협의 필요', '검토 완료'];
  const lines = value => esc(value).replaceAll('\n', '<br>');
  const facts = rows => `<dl class="collab-facts">${rows.map(([key, value]) => `<div><dt>${key}</dt><dd>${lines(value)}</dd></div>`).join('')}</dl>`;
  function history(p, staff) {
    return (p.briefUpdates || []).slice().reverse().map(u => {
      const d = reviews[u.id] ||= { status: stages.includes(u.status) ? u.status : stages[0], note: u.reviewNote || '' };
      return `<article class="brief-update-card"><div class="ws-panel-heading"><h3>보완 요청 ${u.version}</h3><span class="collab-status">${u.status}</span></div><p class="brief-update-reason">${lines(u.reason)}</p>${facts([['기준 예산 · VAT 포함', u.baseline.budget], ['검토 요청 예산 · VAT 포함', u.budget || '변경 요청 없음'], ['기준 희망일', u.baseline.date || '일정 협의'], ['검토 요청 희망일', u.date || '변경 요청 없음'], ['추가·변경할 조건', u.details]])}<details class="production-history"><summary>작성 시점의 브리프 ${icon('chevron')}</summary><p>${lines(u.baseline.notes || '미작성')}</p></details>${u.reviewNote ? `<div class="production-feedback"><strong>직원 검토 메모</strong><p>${lines(u.reviewNote)}</p></div>` : ''}${!staff && u.reviewNote ? `<div class="brief-read-action"><button class="btn secondary" data-brief-seen="${u.id}" data-project="${p.id}" ${u.clientSeenRevision === (u.reviewRevision || 1) ? 'disabled' : ''}>${u.clientSeenRevision === (u.reviewRevision || 1) ? '회신 확인됨' : '회신 확인했어요'} ${icon('check')}</button></div>` : ''}${u.reviewHistory?.length ? `<details class="production-history"><summary>지난 검토 메모 ${u.reviewHistory.length}개 ${icon('chevron')}</summary>${u.reviewHistory.slice().reverse().map(old => `<div><strong>${esc(old.status)}</strong><p>${lines(old.note)}</p></div>`).join('')}</details>` : ''}${staff ? `<form class="brief-review-form" data-project="${p.id}" data-update="${u.id}"><div class="field"><label for="brief-review-status-${u.id}">검토 상태</label><select id="brief-review-status-${u.id}" name="status">${stages.map(s => `<option ${d.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div><div class="field"><label for="brief-review-note-${u.id}">의뢰자에게 남길 검토 메모 *</label><textarea class="input" id="brief-review-note-${u.id}" name="note" maxlength="2000" required>${esc(d.note)}</textarea></div><button class="btn secondary" type="submit">검토 메모 공유 · 체험 ${icon('message')}</button></form>` : ''}</article>`;
    }).join('');
  }
  function client(p, rerender) {
    refresh = rerender;
    if (p.status === '초안') return '';
    const d = drafts[p.id] ||= { reason: '', budget: '', date: '', details: '' };
    return `<section class="ws-panel brief-updates"><span class="eyebrow">KEEP THE BRIEF IN SYNC</span><h2>브리프 보완 요청</h2><p class="ws-muted">예산·일정·제작 조건이 달라졌다면 검토할 내용을 남겨 주세요. 기존 브리프와 제안·예산 검토본은 유지됩니다.</p>${history(p, false)}${p.briefUpdates?.length ? `<a class="text-link" href="#/staff/projects/${p.id}">직원 검토 화면 · 체험 ${icon('up-right')}</a>` : ''}<form class="brief-update-form" data-project="${p.id}"><div class="field"><label for="brief-update-reason">보완 요청 제목 *</label><input class="input" id="brief-update-reason" name="reason" maxlength="100" required value="${esc(d.reason)}" placeholder="예: 숏폼 중심으로 제작 범위 조정"></div><div class="form-row"><div class="field"><label for="brief-update-budget">검토 요청 예산 · VAT 포함 · 선택</label><select id="brief-update-budget" name="budget"><option value="">변경 요청 없음</option>${budgets.map(b => `<option ${d.budget === b ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select></div><div class="field"><label for="brief-update-date">검토 요청 희망일 · 선택</label><input class="input" id="brief-update-date" name="date" type="date" value="${esc(d.date)}"></div></div><div class="field"><label for="brief-update-details">추가·변경할 조건 *</label><textarea class="input" id="brief-update-details" name="details" maxlength="3000" required placeholder="변경 이유와 필요한 결과물, 활용 채널을 정리해 주세요.">${esc(d.details)}</textarea></div><div class="brief-update-actions"><button class="btn secondary" type="button" data-brief-reset="${p.id}">작성 내용 비우기</button><button class="btn primary" type="submit">보완 요청 남기기 · 체험 ${icon('arrow')}</button></div><p class="fine-print collab-form-note">직원 검토 메모는 변경 합의나 계약 확정을 뜻하지 않습니다. 실제 전송 없이 현재 탭에서만 유지됩니다.</p></form></section>`;
  }
  function staff(p, rerender) {
    refresh = rerender;
    if (!p.briefUpdates?.length) return '';
    return `<section class="ws-panel brief-updates"><span class="eyebrow">BRIEF UPDATES</span><h2>의뢰자 보완 요청</h2><p class="ws-muted">요청과 현재 브리프를 비교하고 검토 의견을 남겨 주세요. 제작 범위와 금액은 별도로 협의합니다.</p>${history(p, true)}<a class="text-link" href="#/workspace/projects/${p.id}/brief">의뢰자 브리프 화면 ${icon('arrow')}</a></section>`;
  }
  function capture(event) {
    const form = event.target.closest('.brief-update-form,.brief-review-form'); if (!form) return;
    const data = Object.fromEntries(new FormData(form));
    if (form.classList.contains('brief-update-form')) Object.assign(drafts[form.dataset.project] ||= {}, data);
    else Object.assign(reviews[form.dataset.update] ||= {}, data);
  }
  document.addEventListener('input', capture); document.addEventListener('change', capture);
  document.addEventListener('click', event => {
    const seen = event.target.closest('[data-brief-seen]'); if (seen) { const p = projects.find(p => p.id === seen.dataset.project); const u = p?.briefUpdates?.find(u => u.id === seen.dataset.briefSeen); if (u?.reviewNote) { u.clientSeenRevision = u.reviewRevision || 1; const y = scrollY; refresh(); window.scrollTo(0, y); toast('회신을 확인했어요. 변경 합의나 계약 확정은 아닙니다.'); } return; }
    const button = event.target.closest('[data-brief-reset]'); if (!button) return;
    drafts[button.dataset.briefReset] = { reason: '', budget: '', date: '', details: '' }; refresh(); document.querySelector('#brief-update-reason')?.focus();
  });
  document.addEventListener('submit', event => {
    const form = event.target; if (!form.matches('.brief-update-form,.brief-review-form')) return;
    event.preventDefault(); capture(event);
    const p = projects.find(p => p.id === form.dataset.project); if (!p) return;
    const d = Object.fromEntries(new FormData(form));
    if (form.classList.contains('brief-update-form')) {
      if (p.status === '초안' || !d.reason.trim() || !d.details.trim() || (d.budget && !budgets.includes(d.budget))) { toast('제목과 보완할 조건을 입력해 주세요.'); return; }
      p.briefUpdates ||= [];
      const u = { id: crypto.randomUUID(), version: `v${p.briefUpdates.length + 1}.0`, reason: d.reason.trim(), details: d.details.trim(), budget: d.budget, date: d.date, status: '확인 대기', reviewNote: '', baseline: { budget: p.budget, date: p.date, notes: p.notes } };
      p.briefUpdates.push(u);
      const file = doc(`브리프 보완 요청 · ${u.reason}`, '브리프 보완', `${p.title}\n보완 요청 ${u.version}\n\n${u.reason}\n${u.details}\n\n기준 검토 예산(VAT 포함): ${u.baseline.budget}\n검토 요청 예산(VAT 포함): ${u.budget || '변경 요청 없음'}\n기준 희망일: ${u.baseline.date || '일정 협의'}\n검토 요청 희망일: ${u.date || '변경 요청 없음'}\n\n작성 시점의 브리프:\n${u.baseline.notes || '미작성'}\n\n화면 체험용 보완 요청이며 변경 합의나 계약 확정이 아닙니다.`); file.version = u.version; p.documents.unshift(file);
      p.messages.push(message(`브리프 보완 요청 ${u.version} · ${u.reason}\n${u.details}`, 'me'));
      drafts[p.id] = { reason: '', budget: '', date: '', details: '' }; refresh(); document.querySelector('.brief-updates h2')?.scrollIntoView({ block: 'start' }); toast('보완 요청을 직원 화면과 문서함에 연결했어요.');
    } else {
      const u = p.briefUpdates?.find(u => u.id === form.dataset.update); if (!u || !stages.includes(d.status)) return;
      if (!d.note.trim()) { toast('검토 메모를 공백 없이 입력해 주세요.'); return; }
      if (u.status === d.status && u.reviewNote === d.note.trim()) { toast('이미 같은 검토 내용이 공유되어 있어요.'); return; }
      u.reviewHistory ||= []; if (u.reviewNote) u.reviewHistory.push({ status: u.status, note: u.reviewNote });
      u.status = d.status; u.reviewNote = d.note.trim(); u.reviewRevision = (u.reviewRevision || 0) + 1;
      p.messages.push(message(`브리프 보완 요청 ${u.version} · ${u.status}\n${u.reviewNote}`));
      refresh(); toast('의뢰자 브리프와 대화에 검토 메모를 공유했어요.');
    }
  });
  return { client, staff };
}
