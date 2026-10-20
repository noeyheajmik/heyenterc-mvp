export function createAssignments({ hub, projects, icon, esc, toast, log, refresh }) {
  hub.assignments ||= [];
  const drafts = {};
  const lines = value => esc(value).replaceAll('\n', '<br>');
  const connected = (r, p) => p.participants?.some(person => person.requestId === r.id);
  function render(r, p) {
    const work = hub.assignments.find(a => a.requestId === r.id);
    if (!work && !connected(r, p)) return '';
    if (!work) {
      const d = drafts[r.id] ||= { tasks: '역할·작업 범위 확인\n일정·준비 조건 확인', note: '' };
      return `<section class="assignment-panel" aria-label="협업 작업 배정"><h3>준비할 작업 배정</h3><p class="ws-muted">연결한 참여자의 업무 공간에 준비 항목을 정리해 주세요.</p><form class="assignment-form" data-request="${r.id}"><div class="field"><label for="assignment-tasks-${r.id}">준비 항목 * · 한 줄에 하나, 최대 12개</label><textarea class="input" id="assignment-tasks-${r.id}" name="tasks" maxlength="1800" required>${esc(d.tasks)}</textarea></div><div class="field"><label for="assignment-note-${r.id}">매니저 안내 · 선택</label><textarea class="input" id="assignment-note-${r.id}" name="note" maxlength="2000">${esc(d.note)}</textarea></div><button class="btn primary" type="submit">작업 배정 · 체험 ${icon('arrow')}</button><p class="fine-print collab-form-note">협업자 준비 체크는 프로젝트 전체 일정과 별도로 관리합니다. 실제 계약·전송은 아닙니다.</p></form></section>`;
    }
    const done = work.tasks.filter(t => t.done).length;
    return `<section class="assignment-panel" aria-label="배정한 협업 작업"><div class="ws-panel-heading"><h3>배정한 작업</h3><span class="collab-status">${done} / ${work.tasks.length} 준비 확인</span></div><ul class="assignment-checks">${work.tasks.map(t => `<li>${icon(t.done ? 'check' : 'folder')}<span>${esc(t.title)}</span><small>${t.done ? '확인함' : '확인 전'}</small></li>`).join('')}</ul><a class="btn secondary" href="#/collab/projects/${work.id}?role=${work.kind}">협업자 작업 화면 ${icon('up-right')}</a><h4>작업 자료 메모 · ${work.notes.length}개</h4>${work.notes.length ? work.notes.map(n => `<article class="assignment-note"><strong>${esc(n.title)}</strong><p>${lines(n.text)}</p></article>`).join('') : '<p class="ws-muted">협업자가 남긴 자료 메모가 여기에 표시됩니다.</p>'}<h4>협업자와 대화</h4><div class="collab-message-list" role="log" aria-label="배정 작업 대화">${work.messages.map(m => `<article class="collab-message ${m.who === 'manager' ? 'mine' : ''}"><span>${m.who === 'manager' ? '협업 매니저' : esc(work.profileName)} · 체험</span><p>${lines(m.text)}</p></article>`).join('')}</div><form class="assignment-message-form" data-work="${work.id}"><div class="field"><label for="assignment-message-${work.id}">작업 관련 안내</label><textarea class="input" id="assignment-message-${work.id}" name="message" maxlength="2000" required>${esc(work.staffDraft || '')}</textarea></div><button class="btn secondary" type="submit">안내 남기기 · 체험 ${icon('message')}</button></form></section>`;
  }
  function capture(event) {
    const form = event.target.closest('.assignment-form,.assignment-message-form'); if (!form) return;
    const data = Object.fromEntries(new FormData(form));
    if (form.classList.contains('assignment-form')) Object.assign(drafts[form.dataset.request] ||= {}, data);
    else { const work = hub.assignments.find(a => a.id === form.dataset.work); if (work) work.staffDraft = data.message; }
  }
  document.addEventListener('input', capture);
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!form.matches('.assignment-form,.assignment-message-form')) return;
    event.preventDefault(); capture(event);
    const data = Object.fromEntries(new FormData(form));
    if (form.classList.contains('assignment-form')) {
      const r = hub.requests.find(r => r.id === form.dataset.request);
      const p = projects.find(p => p.id === r?.projectId);
      if (!p || !connected(r, p) || hub.assignments.some(a => a.requestId === r.id)) return;
      const titles = data.tasks.split('\n').map(t => t.trim()).filter(Boolean);
      if (!titles.length || titles.length > 12 || titles.some(t => t.length > 150)) { toast('준비 항목을 1~12개, 항목당 150자 이내로 입력해 주세요.'); return; }
      hub.assignments.unshift({ id: 'work-' + crypto.randomUUID(), sourceProjectId: p.id, requestId: r.id, profileName: r.profileName, kind: r.kind, title: p.title, region: p.region, role: r.role, tasks: titles.map(title => ({ id: crypto.randomUUID(), title, timing: r.timing, done: false })), messages: [{ who: 'manager', text: data.note.trim() || '배정된 역할과 준비 항목을 확인해 주세요. 필요한 조건은 이 대화에 남겨 주세요.' }], notes: [], messageDraft: '', staffDraft: '', noteDraft: { title: '', text: '' } });
      log.push(`${p.title} · ${r.profileName} 준비 작업 배정`); refresh(); toast('협업자 업무 공간에 준비 작업을 연결했어요.');
    } else {
      const work = hub.assignments.find(a => a.id === form.dataset.work); if (!work) return;
      if (!data.message.trim()) { toast('안내 내용을 공백 없이 입력해 주세요.'); return; }
      work.messages.push({ who: 'manager', text: data.message.trim() }); work.staffDraft = '';
      const y = scrollY; refresh(); window.scrollTo(0, y); document.getElementById(`assignment-message-${work.id}`)?.focus({ preventScroll: true }); toast('협업자 작업 화면에 안내를 남겼어요.');
    }
  });
  return { render };
}
