export function documentTypes(projects) {
  return [...new Set(projects.flatMap(p => p.documents || []).map(d => d.kind))].sort((a, b) => a.localeCompare(b, 'ko'));
}
export function documentLibraryOptions(projects, params) {
  return { q: (params.get('q') || '').slice(0, 100), project: projects.some(p => p.id === params.get('project')) ? params.get('project') : '', kind: documentTypes(projects).includes(params.get('kind')) ? params.get('kind') : '' };
}
export function documentLibraryQuery({ q = '', project = '', kind = '' }) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (project) params.set('project', project);
  if (kind) params.set('kind', kind);
  return params;
}
export function selectDocuments(projects, { q = '', project = '', kind = '' } = {}) {
  const query = q.trim().toLocaleLowerCase('ko');
  return projects.filter(p => !project || p.id === project).flatMap(p => (p.documents || []).filter(d => (!kind || d.kind === kind) && (!query || `${d.title} ${d.text || ''}`.toLocaleLowerCase('ko').includes(query))).map(document => ({ project: p, document })));
}
