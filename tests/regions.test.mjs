import test from 'node:test';
import assert from 'node:assert/strict';
import { REGIONS, regionSelection } from '../public/regions.js';
test('snapshot contains unique province and district codes, with no duplicate names per parent', () => {
  assert.ok(REGIONS.length >= 16);
  const codes = REGIONS.flatMap(p => [p.id, ...p.districts.map(d => d.id)]);
  assert.equal(codes.length, new Set(codes).size);
  for (const p of REGIONS) assert.equal(p.districts.length, new Set(p.districts.map(d => d.name)).size);
});
test('specific district and province-wide or nationwide choices produce matching profile text', () => {
  const parent = REGIONS.find(p => p.name === '서울특별시');
  const child = parent.districts.find(d => d.name === '종로구');
  assert.equal(regionSelection(parent.id, child.id).region, '서울특별시 종로구');
  assert.equal(regionSelection(parent.id).region, '서울특별시 전체');
  assert.deepEqual(regionSelection(), { province: '', district: '', region: '전국' });
});
test('switching province rejects a district from the previous province', () => {
  const seoul = REGIONS.find(p => p.name === '서울특별시'), busan = REGIONS.find(p => p.name === '부산광역시');
  const result = regionSelection(busan.id, seoul.districts[0].id);
  assert.equal(result.district, '');
  assert.equal(result.region, '부산광역시 전체');
  assert.equal(regionSelection('invalid', seoul.districts[0].id).region, '전국');
});
test('single-tier Sejong and official current Incheon districts are supported', () => {
  const sejong = REGIONS.find(p => p.name === '세종특별자치시');
  assert.equal(regionSelection(sejong.id).region, '세종특별자치시 전체');
  const incheon = REGIONS.find(p => p.name === '인천광역시');
  for (const name of ['제물포구', '영종구', '검단구', '서해구']) assert.ok(incheon.districts.some(d => d.name === name));
});
