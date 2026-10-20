export const ACTION_TYPES = { all: '전체', proposal: '제안서', budget: '예산', delivery: '결과물 메모', brief: '브리프 회신' };

export function clientActions(projects) {
  return projects.filter(p => !['초안', '완료'].includes(p.status)).flatMap(p => {
    const items = [];
    const add = (kind, key, title, detail, tab, glyph = 'file') => items.push({ id: `${p.id}:${kind}:${key}`, projectId: p.id, projectTitle: p.title, kind, title, detail, tab, glyph });
    if (p.proposal && !p.reviewed && !(p.proposalCommentedVersions || []).includes(p.latestVersion || p.version)) add('proposal', p.latestVersion || p.version, '홍보 구성안을 검토해 주세요.', `최신 제안 ${p.latestVersion || p.version}`, 'proposals');
    const budget = p.budgetSnapshots?.at(-1);
    if (budget?.reviewStatus === '확인 대기') add('budget', budget.version, '공유된 예산 구성을 확인해 주세요.', `예산 검토본 ${budget.version} · VAT 포함`, 'budget');
    for (const d of p.deliverables || []) if (d.status === '확인 대기') add('delivery', d.id, '결과물 검토메모를 확인해 주세요.', `${d.title} · v${d.revision}.0`, 'schedule');
    for (const u of p.briefUpdates || []) if (u.reviewNote && u.clientSeenRevision !== (u.reviewRevision || 1)) add('brief', u.id, '브리프 보완 요청에 회신이 있어요.', `${u.reason} · ${u.status}`, 'brief', 'message');
    return items;
  });
}
