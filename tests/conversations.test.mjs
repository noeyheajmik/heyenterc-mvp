import test from 'node:test';
import assert from 'node:assert/strict';
import { unreadMessages, markConversationRead, selectConversations, conversationQuery } from '../public/conversations.js';
const project = () => ({ id: 'one', title: '여행 캠페인', region: '전남', messages: [{ id: 'a', who: 'manager', text: '촬영 일정을 확인해 주세요.' }, { id: 'b', who: 'me', text: '주말 촬영을 희망합니다.' }] });
test('opening a conversation clears received messages only and new replies reopen unread state', () => {
  const p = project();
  assert.equal(unreadMessages(p).length, 1);
  markConversationRead(p); markConversationRead(p);
  assert.deepEqual(p.clientSeenMessages, ['a']);
  assert.equal(unreadMessages(p).length, 0);
  p.messages.push({ id: 'c', who: 'me', text: '추가 질문' });
  assert.equal(unreadMessages(p).length, 0);
  p.messages.push({ id: 'd', who: 'manager', text: '답변' });
  assert.equal(unreadMessages(p).length, 1);
});
test('search matches older messages and previews the matched text', () => {
  const p = project();
  const results = selectConversations([p], { q: ' 촬영 일정 ' });
  assert.equal(results.length, 1);
  assert.equal(results[0].preview.id, 'a');
  assert.equal(selectConversations([p], { q: '전남' }).length, 1);
  assert.equal(selectConversations([p], { q: '없는 내용' }).length, 0);
});
test('unread filter and encoded navigation preserve independent project state', () => {
  const p = project(), other = { ...project(), id: 'two', messages: [{ id: 'e', who: 'manager', text: '새 안내' }] };
  markConversationRead(p);
  assert.deepEqual(selectConversations([p, other], { unread: true }).map(item => item.project.id), ['two']);
  const params = conversationQuery({ q: '일정 & 활용', unread: true, project: 'two' });
  assert.equal(params.get('q'), '일정 & 활용');
  assert.equal(params.get('unread'), '1');
  assert.equal(params.get('project'), 'two');
});
