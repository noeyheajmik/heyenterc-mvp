import test from 'node:test';
import assert from 'node:assert/strict';
import { planningPath, mvpRoute } from '../public/mvp.js';

test('project entry converges on the planner and carries campaign context', () => {
  const url = new URL(planningPath({template:'creator',client:'company',region:'서울 성수'}),'https://hey.local');
  assert.equal(url.pathname,'/budget');
  assert.equal(url.searchParams.get('goal'),'브랜드·콘텐츠');
  assert.equal(url.searchParams.get('services'),'creator,video');
  assert.equal(url.searchParams.get('region'),'서울 성수');
  assert.equal(url.searchParams.get('client'),'company');
});
test('reference context and explicit choices take precedence over starter defaults', () => {
  const url = new URL(planningPath({template:'launch',goal:'축제·행사',services:['artist'],source:'지역 & 브랜드',amount:'1500',budget:'직접 입력'}),'https://hey.local');
  assert.equal(url.searchParams.get('goal'),'축제·행사');
  assert.equal(url.searchParams.get('services'),'artist');
  assert.equal(url.searchParams.get('source'),'지역 & 브랜드');
  assert.equal(url.searchParams.get('amount'),'1500');
});
test('client workspace starts with projects and exposes four project sections', () => {
  assert.equal(mvpRoute('/workspace'),'/workspace/projects');
  for(const tab of ['proposals','schedule','documents','deliverables']) assert.equal(mvpRoute('/workspace/projects/festival/'+tab),'');
  for(const tab of ['overview','brief','messages','budget','people','summary']) assert.equal(mvpRoute('/workspace/projects/festival/'+tab),'/workspace/projects/festival/proposals');
});
test('archived role branches and old comparison do not open from MVP routes', () => {
  for(const path of ['/partners','/artists/good-flow','/join','/collab/projects','/participate','/staff']) assert.equal(mvpRoute(path),'/home');
  assert.equal(mvpRoute('/screens'),'');
  assert.equal(mvpRoute('/services/artist'),'');
  assert.equal(mvpRoute('/workspace/new',new URLSearchParams({template:'launch'})).startsWith('/budget?'),true);
  assert.equal(mvpRoute('/plans',new URLSearchParams({services:'video'})),'/budget?services=video');
});
