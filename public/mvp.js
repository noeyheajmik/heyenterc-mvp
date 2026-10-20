import { campaignPreset } from './campaign-templates.js';

export function planningPath(context = {}) {
  const preset = campaignPreset(context.template);
  const clientDefaults = context.client ? {goal:context.client==='institution'?'관광·지역 홍보':'브랜드·콘텐츠',services:context.client==='institution'?['video','creator']:['video','print']} : {};
  const values = { ...clientDefaults, ...preset, ...context };
  const params = new URLSearchParams();
  for (const key of ['goal', 'budget', 'region', 'schedule', 'amount', 'client', 'template', 'source']) {
    if (values[key]) params.set(key, values[key]);
  }
  if (values.services) params.set('services', Array.isArray(values.services) ? values.services.join(',') : values.services);
  return '/budget' + (params.size ? '?' + params : '');
}

export function mvpRoute(path, params = new URLSearchParams()) {
  if (path === '/services/design') return '/services/print';
  if (params.get('services')?.split(',').includes('design')) { params.set('services',[...new Set(params.get('services').split(',').map(id=>id==='design'?'print':id))].join(',')); return path+'?'+params; }
  if (path === '/workspace/new') return planningPath({template: params.get('template')});
  if (path === '/plans') return '/budget' + (params.size ? '?' + params : '');
  if (/^\/(partners|artists|join|collab|participate|staff)(\/|$)/.test(path)) return '/home';
  if (path === '/workspace' || /^\/workspace\/(actions|messages|documents|saved)$/.test(path)) return '/workspace/projects';
  const match = path.match(/^\/workspace\/projects\/([^/]+)(?:\/([^/]+))?$/);
  if (match && !['proposals','schedule','documents','deliverables'].includes(match[2])) return `/workspace/projects/${match[1]}/proposals`;
  return '';
}

// Remove entry points to the archived branches; their original screens live in showcase/.
export function applyMVP(root = document) {
  if (location.hash.startsWith('#/screens')) return;
  root.querySelectorAll('a[href^="#/"]').forEach(a => {
    const href = a.getAttribute('href');
    const url = new URL(href.slice(1), 'https://hey.local');
    if (/^\/(partners|artists|join|collab|participate|staff)(\/|$)/.test(url.pathname)) { a.hidden = true; return; }
    if (url.pathname === '/workspace/new') {
      a.href = '#' + planningPath({template:url.searchParams.get('template')});
      a.removeAttribute('data-ws-action'); a.removeAttribute('data-ws-template');
    }
  });
}
