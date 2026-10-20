export function unreadMessages(p) {
  const seen = new Set(p.clientSeenMessages || []);
  return (p.messages || []).filter(m => m.who !== 'me' && !seen.has(m.id));
}
export function markConversationRead(p) {
  p.clientSeenMessages = [...new Set([...(p.clientSeenMessages || []), ...(p.messages || []).filter(m => m.who !== 'me').map(m => m.id)])];
}
export function conversationQuery({ q = '', unread = false, project = '' } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim().slice(0, 100));
  if (unread) params.set('unread', '1');
  if (project) params.set('project', project);
  return params;
}
export function selectConversations(projects, { q = '', unread = false } = {}) {
  const query = q.trim().toLocaleLowerCase('ko');
  return projects.map(project => {
    const matching = (project.messages || []).filter(m => m.text.toLocaleLowerCase('ko').includes(query));
    return { project, unread: unreadMessages(project).length, preview: (query && matching.length ? matching : project.messages || []).at(-1) };
  }).filter(item => (!unread || item.unread > 0) && (!query || `${item.project.title} ${item.project.region}`.toLocaleLowerCase('ko').includes(query) || item.project.messages.some(m => m.text.toLocaleLowerCase('ko').includes(query))));
}
