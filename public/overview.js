import { clientActions } from './actions.js';

export function projectOverview(p) {
  const actions = clientActions([p]);
  let title, description;
  if (p.status === '초안') { title = '우리 프로젝트의 시작을 정리해요.'; description = '목표와 제작 조건을 보완한 뒤 체험 프로젝트로 생성해 보세요.'; }
  else if (p.status === '완료') { title = '프로젝트의 기록을 다시 확인해요.'; description = '운영 화면에서 완료로 표시한 프로젝트입니다. 공유한 검토본과 진행 요약을 다시 살펴볼 수 있어요.'; }
  else if (actions.length) { title = `${actions.length}개의 확인할 내용이 있어요.`; description = '새 검토본과 회신을 확인하고 의견을 남겨 다음 단계로 이어가세요.'; }
  else if (p.status === '브리프 확인') { title = '브리프와 제작 조건을 확인하는 단계예요.'; description = p.manager ? '담당 매니저가 배정되어 있어요. 추가 조건이나 질문은 프로젝트 대화에 남겨주세요.' : '현재 체험 프로젝트에는 담당자가 배정되지 않았어요. 브리프에서 요청 내용을 다시 확인할 수 있어요.'; }
  else if (p.status === '제작 진행') { title = '제작 진행 상황을 함께 확인해요.'; description = '등록된 일정과 공유된 검토메모를 확인하고, 필요한 조건은 담당자와 정리해 주세요.'; }
  else { title = '프로젝트의 다음 단계를 준비해요.'; description = p.manager ? '현재 확인할 새 검토본은 없어요. 담당자와 대화를 이어가거나 진행 요약을 살펴보세요.' : '현재 확인할 새 검토본은 없어요. 요청한 조건은 브리프에서 다시 살펴볼 수 있어요.'; }
  return { title, description, actions, taskTotal: (p.tasks || []).length, taskDone: (p.tasks || []).filter(t => t.stage === '완료').length, budget: p.budgetSnapshots?.at(-1), deliveries: (p.deliverables || []).length, deliveryPending: (p.deliverables || []).filter(d => d.status === '확인 대기').length, participants: (p.participants || []).length };
}
