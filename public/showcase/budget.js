const CATEGORIES = ['영상 제작', '아티스트 섭외', '인플루언서', '언론·보도', '디자인', '인쇄·제작', '운영·기타'];
export const won = value => Number(value || 0).toLocaleString('ko-KR') + '원';
export function budgetTotals(plan) {
  const total = (plan?.items || []).reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const cap = plan?.cap === '' || plan?.cap == null ? null : Number(plan.cap);
  return { total, cap, difference: cap === null ? null : cap - total };
}
export function budgetSummary(plan, esc) {
  const { total, cap, difference } = budgetTotals(plan);
  return `<div class="budget-summary"><div><span>구성 합계 · VAT 포함</span><strong>${won(total)}</strong></div><div><span>관리 예산 · VAT 포함</span><strong>${cap === null ? '아직 미정' : won(cap)}</strong></div><div class="${difference !== null && difference < 0 ? 'over-budget' : ''}"><span>${difference === null ? '예산 차이' : difference < 0 ? '관리 예산 초과' : '남은 관리 예산'}</span><strong>${difference === null ? '관리 예산 입력 후 확인' : won(Math.abs(difference))}</strong></div></div>${difference !== null && difference < 0 ? '<p class="budget-alert" role="status">구성 합계가 관리 예산을 초과합니다. 범위와 항목을 다시 확인해 주세요.</p>' : ''}${plan?.notes ? `<div class="budget-conditions"><strong>포함·별도 조건</strong><p>${esc(plan.notes).replaceAll('\n', '<br>')}</p></div>` : ''}`;
}
export function budgetRows(plan, esc, icon, editable = false) {
  return `<div class="budget-items">${(plan?.items || []).map(item => `<article class="budget-item"><div><span class="budget-category">${item.category}</span><h3>${esc(item.title)}</h3><p>${item.quantity} ${esc(item.unit)} × ${won(item.unitCost)} · VAT 포함</p></div><strong>${won(item.quantity * item.unitCost)}</strong>${editable ? `<div class="budget-item-actions"><button class="production-edit" data-budget-edit="${item.id}" aria-label="${esc(item.title)} 수정">수정 ${icon('pen')}</button><button class="budget-remove" data-budget-remove="${item.id}" aria-label="${esc(item.title)} 항목 제외">제외</button></div>` : ''}</article>`).join('')}</div>`;
}
export function clientBudget(p, { esc, icon, draft = '' }) {
  const snapshot = p.budgetSnapshots?.at(-1);
  return `<section class="ws-panel"><span class="eyebrow">PROJECT BUDGET</span><h2>예산을 같은 기준으로 확인해요.</h2><p class="ws-muted">의뢰자의 검토 예산 · VAT 포함: ${esc(p.budget)}</p>${snapshot ? `<div class="budget-version"><span class="collab-status">검토본 ${snapshot.version}</span><span class="collab-status">${snapshot.reviewStatus}</span></div>${budgetSummary(snapshot, esc)}<h3 class="budget-section-title">항목별 구성</h3>${budgetRows(snapshot, esc, icon)}<form id="ws-budget-review-form" class="production-review-form" data-project="${p.id}" data-version="${snapshot.version}"><label for="ws-budget-note">비용·포함 조건에 대한 의견 · 선택</label><textarea class="input" id="ws-budget-note" name="note" maxlength="2000" placeholder="제작 범위, 별도 비용 등 확인할 내용을 남겨주세요.">${esc(draft)}</textarea><div class="production-review-actions"><button class="btn secondary" type="submit" value="revise">예산 수정 의견 남기기</button><button class="btn primary" type="submit" value="confirm" ${snapshot.reviewStatus === '구성 확인 완료' ? 'disabled' : ''}>${snapshot.reviewStatus === '구성 확인 완료' ? '예산 구성 확인됨' : '예산 구성 확인'} ${icon('check')}</button></div><p class="fine-print">구성 확인은 견적 확정·계약 동의·결제가 아닙니다.</p></form>${snapshot.feedback ? `<div class="production-feedback"><strong>남긴 검토 의견</strong><p>${esc(snapshot.feedback).replaceAll('\n', '<br>')}</p></div>` : ''}${p.budgetSnapshots.length > 1 ? `<details class="production-history"><summary>이전 예산 검토본 ${p.budgetSnapshots.length - 1}개 ${icon('chevron')}</summary>${p.budgetSnapshots.slice(0, -1).reverse().map(old => `<div><strong>${old.version} · ${old.reviewStatus} · ${won(budgetTotals(old).total)}</strong>${budgetSummary(old, esc)}${budgetRows(old, esc, icon)}${old.feedback ? `<p>검토 의견: ${esc(old.feedback)}</p>` : ''}</div>`).join('')}</details>` : ''}` : '<div class="budget-empty"><span class="network-glyph">' + icon('file') + '</span><h3>아직 공유된 예산 검토본이 없어요.</h3><p>담당자가 항목과 포함 조건을 정리하면 여기에서 확인할 수 있어요.</p></div>'}</section>`;
}
export function createBudgetEditor({ projects, icon, esc, toast, message, doc, layout, log }) {
  const state = { project: null, lines: {}, settings: {}, removed: {} };
  const blank = () => ({ id: '', title: '', category: CATEGORIES[0], quantity: '1', unit: '식', unitCost: '' });
  const field = (id, label, name, value, options = '') => `<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" name="${name}" value="${esc(value)}" ${options}></div>`;
  function render(p) {
    state.project = p; p.costPlan ||= { cap: '', notes: '', items: [] }; p.budgetSnapshots ||= [];
    const d = state.lines[p.id] ||= blank(); const settings = state.settings[p.id] ||= { cap: p.costPlan.cap, notes: p.costPlan.notes };
    const latest = p.budgetSnapshots.at(-1);
    layout(p, 'budget', `<div class="collab-detail-grid"><div><section class="ws-panel"><span class="eyebrow">A CLEAR VIEW OF THE COST</span><h2>예산 구성 초안</h2><p class="ws-muted">의뢰자의 검토 예산: ${esc(p.budget)} · VAT 포함</p>${budgetSummary(p.costPlan, esc)}<div class="budget-section-heading"><h3>제작·섭외 항목</h3><span>${p.costPlan.items.length}개</span></div>${p.costPlan.items.length ? budgetRows(p.costPlan, esc, icon, true) : '<div class="budget-empty"><p>아직 작성한 항목이 없습니다. 필요한 제작·섭외 비용부터 추가해 보세요.</p></div>'}${state.removed[p.id] ? `<div class="budget-undo" role="status"><span>${esc(state.removed[p.id].item.title)} 항목을 제외했어요.</span><button class="text-link" data-budget-undo>되돌리기</button></div>` : ''}<button class="btn primary full-width" data-budget-publish ${p.costPlan.items.length ? '' : 'disabled'}>저장한 구성으로 검토본 공유 ${icon('arrow')}</button><p class="fine-print budget-disclosure">공유 전까지 의뢰자 화면에는 이전 검토본이 표시됩니다. 모든 금액은 VAT 포함 금액으로 입력합니다.</p></section>${latest ? `<section class="ws-panel"><span class="eyebrow">LATEST BUDGET REVIEW</span><h2>최근 공유한 검토본</h2><div class="budget-version"><span class="collab-status">${latest.version}</span><span class="collab-status">${latest.reviewStatus}</span></div><p class="budget-published-total">${won(budgetTotals(latest).total)} <small>VAT 포함</small></p>${latest.feedback ? `<div class="production-feedback"><strong>의뢰자 의견</strong><p>${esc(latest.feedback).replaceAll('\n', '<br>')}</p></div>` : '<p class="ws-muted">남겨진 검토 의견이 없습니다.</p>'}<a class="btn secondary" href="#/workspace/projects/${p.id}/budget">의뢰자 예산 화면 ${icon('up-right')}</a></section>` : ''}</div><div><section class="ws-panel"><span class="eyebrow">BUILD THE SCOPE</span><h2>${d.id ? '비용 항목 수정' : '비용 항목 추가'}</h2><form id="budget-line-form" data-project="${p.id}">${field('budget-line-title', '항목 이름 *', 'title', d.title, 'maxlength="100" required')}<div class="field"><label for="budget-line-category">분야</label><select id="budget-line-category" name="category">${CATEGORIES.map(v => `<option ${d.category === v ? 'selected' : ''}>${v}</option>`).join('')}</select></div><div class="form-row">${field('budget-line-quantity', '수량 *', 'quantity', d.quantity, 'type="number" inputmode="numeric" min="1" max="999" step="1" required')}${field('budget-line-unit', '단위 *', 'unit', d.unit, 'maxlength="20" required')}</div>${field('budget-line-cost', '단가 · 원 / VAT 포함 *', 'unitCost', d.unitCost, 'type="number" inputmode="numeric" min="0" max="1000000000" step="1" required')}<p class="budget-line-preview" id="budget-line-preview" role="status" aria-live="polite">항목 합계: ${won(Number(d.quantity) * Number(d.unitCost))}</p><button class="btn primary full-width" type="submit">${d.id ? '항목 수정 반영' : '항목 추가'} ${icon('check')}</button>${d.id ? '<button class="text-link production-cancel" type="button" data-budget-cancel>수정 취소</button>' : ''}</form></section><section class="ws-panel"><span class="eyebrow">SET THE WORKING BUDGET</span><h2>관리 예산과 포함 조건</h2><form id="budget-settings-form" data-project="${p.id}">${field('budget-cap', '관리 예산 · 원 / VAT 포함 · 선택', 'cap', settings.cap, 'type="number" inputmode="numeric" min="0" max="1000000000000" step="1"')}<div class="field"><label for="budget-notes">포함·별도 조건 · 선택</label><textarea class="input" id="budget-notes" name="notes" maxlength="2000" placeholder="이동·숙박, 원본 제공, 수정 범위 등을 정리해 주세요.">${esc(settings.notes)}</textarea></div><button class="btn secondary full-width" type="submit">관리 조건 반영 ${icon('check')}</button><p class="fine-print collab-form-note">의뢰자가 선택한 예산 구간과 별도로 사용하는 관리 기준입니다.</p></form></section></div></div>`);
  }
  function refresh() { render(state.project); }
  function capture(event) {
    const form = event.target.closest('form'); if (!form?.id.startsWith('budget-')) return;
    const map = form.id === 'budget-line-form' ? state.lines : state.settings;
    Object.assign(map[form.dataset.project], Object.fromEntries(new FormData(form)));
    if (form.id === 'budget-line-form') { const d = map[form.dataset.project]; const total = Number(d.quantity) * Number(d.unitCost); document.querySelector('#budget-line-preview').textContent = Number.isFinite(total) && total >= 0 ? '항목 합계: ' + won(total) : '수량과 단가를 확인해 주세요.'; }
  }
  document.addEventListener('input', capture); document.addEventListener('change', capture);
  document.addEventListener('click', event => {
    const el = event.target.closest('[data-budget-edit],[data-budget-remove],[data-budget-undo],[data-budget-cancel],[data-budget-publish]'); if (!el) return;
    const p = state.project;
    if (el.hasAttribute('data-budget-publish')) {
      if (!p.costPlan.items.length) return;
      const snapshot = { version: `v${p.budgetSnapshots.length + 1}.0`, cap: p.costPlan.cap, notes: p.costPlan.notes, items: p.costPlan.items.map(item => ({ ...item })), reviewStatus: '확인 대기', feedback: '' };
      p.budgetSnapshots.push(snapshot);
      const { total, cap } = budgetTotals(snapshot);
      const text = `예산 검토본 ${snapshot.version}\n\n${snapshot.items.map(item => `${item.title} · ${item.category}\n${item.quantity}${item.unit} × ${won(item.unitCost)} = ${won(item.quantity * item.unitCost)} (VAT 포함)`).join('\n\n')}\n\n구성 합계(VAT 포함): ${won(total)}\n관리 예산(VAT 포함): ${cap === null ? '미정' : won(cap)}\n\n포함·별도 조건\n${snapshot.notes || '상세 조건 협의'}\n\n프로젝트용 구성 · 실제 견적·계약 아님`;
      const file = doc('예산 구성 검토본', '예산', text); file.version = snapshot.version; p.documents.unshift(file); p.messages.push(message(`예산 구성 검토본 ${snapshot.version} · ${won(total)}(VAT 포함)을 공유했습니다. 예산 탭에서 항목과 포함 조건을 확인해 주세요.`)); log.push(`${p.title} · 예산 검토본 ${snapshot.version} 공유`); toast('예산 검토본을 의뢰자 화면과 문서함에 공유했어요.');
    }
    if (el.dataset.budgetEdit) state.lines[p.id] = { ...p.costPlan.items.find(item => item.id === el.dataset.budgetEdit) };
    if (el.dataset.budgetRemove) { const index = p.costPlan.items.findIndex(item => item.id === el.dataset.budgetRemove); if (index >= 0) { state.removed[p.id] = { item: p.costPlan.items[index], index }; p.costPlan.items.splice(index, 1); if (state.lines[p.id].id === el.dataset.budgetRemove) state.lines[p.id] = blank(); } }
    if (el.hasAttribute('data-budget-undo') && state.removed[p.id]) { const { item, index } = state.removed[p.id]; p.costPlan.items.splice(index, 0, item); delete state.removed[p.id]; }
    if (el.hasAttribute('data-budget-cancel')) state.lines[p.id] = blank();
    const y = scrollY; refresh(); window.scrollTo(0, y); if (el.dataset.budgetEdit) document.querySelector('#budget-line-title')?.focus();
  });
  document.addEventListener('submit', event => {
    const form = event.target; if (!['budget-line-form', 'budget-settings-form'].includes(form.id)) return; event.preventDefault(); capture(event);
    const p = state.project;
    if (form.id === 'budget-line-form') {
      const d = state.lines[p.id]; const quantity = Number(d.quantity), unitCost = Number(d.unitCost);
      if (!d.title.trim() || !d.unit.trim() || !Number.isInteger(quantity) || quantity < 1 || quantity > 999 || !Number.isInteger(unitCost) || unitCost < 0 || unitCost > 1000000000 || d.unitCost === '') { toast('항목 이름·단위와 올바른 수량·단가를 입력해 주세요.'); return; }
      const item = { ...d, id: d.id || crypto.randomUUID(), title: d.title.trim(), unit: d.unit.trim(), quantity, unitCost }; const index = p.costPlan.items.findIndex(item => item.id === d.id); if (index < 0) p.costPlan.items.push(item); else p.costPlan.items[index] = item;
      state.lines[p.id] = blank(); toast('예산 구성 초안에 반영했어요.');
    } else {
      const d = state.settings[p.id]; const cap = d.cap === '' ? '' : Number(d.cap);
      if (cap !== '' && (!Number.isInteger(cap) || cap < 0 || cap > 1000000000000)) { toast('관리 예산을 0 이상의 정수로 입력해 주세요.'); return; }
      p.costPlan.cap = cap; p.costPlan.notes = d.notes.trim(); toast('관리 예산과 포함 조건을 반영했어요.');
    }
    const y = scrollY; refresh(); window.scrollTo(0, y);
  });
  return { render };
}
