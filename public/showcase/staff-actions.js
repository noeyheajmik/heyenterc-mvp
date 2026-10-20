export const STAFF_ACTION_TYPES = { all: '전체', assign: '담당자 배정', proposal: '제안 의견', brief: '브리프 보완', budget: '예산 수정', delivery: '결과물 수정', collaboration: '협업 회신' };
export function staffActions(projects, requests = []) {
  return projects.filter(p => !['초안', '완료'].includes(p.status)).flatMap(p => {
    const items = [];
    const add = (kind, key, title, detail, tab = '', glyph = 'file') => items.push({ id: `${p.id}:${kind}:${key}`, projectId: p.id, projectTitle: p.title, kind, title, detail, href: `#/staff/projects/${p.id}${tab ? '/' + tab : ''}`, glyph });
    if (!p.manager) add('assign', 'manager', '프로젝트 담당자를 배정해 주세요.', '담당자 미배정', '', 'person');
    const version = p.latestVersion || p.version;
    const feedback = p.proposalFeedback?.[version] || ((p.proposalCommentedVersions || []).includes(version) ? p.feedback : '');
    if (p.proposal && !p.reviewed && feedback) add('proposal', version, '제안 검토 의견을 확인해 주세요.', `최신 제안 ${version}`);
    for (const u of p.briefUpdates || []) if (u.status !== '검토 완료') add('brief', u.id, '브리프 보완 요청을 검토해 주세요.', `${u.reason} · ${u.status}`);
    const budget = p.budgetSnapshots?.at(-1);
    if (budget?.reviewStatus === '수정 의견 있음') add('budget', budget.version, '예산 수정 의견을 확인해 주세요.', `예산 검토본 ${budget.version}`, 'budget');
    for (const d of p.deliverables || []) if (d.status === '수정 의견 있음') add('delivery', d.id, '결과물 검토메모를 보완해 주세요.', `${d.title} · v${d.revision}.0`, 'schedule');
    for (const r of requests) if (r.projectId === p.id && r.replied && ['yes', 'discuss'].includes(r.sentResponse?.availability) && !p.participants?.some(person => person.requestId === r.id)) add('collaboration', r.id, '협업 회신을 확인하고 역할을 정리해 주세요.', `${r.profileName} · ${r.role}`, 'people', 'person');
    return items;
  });
}
