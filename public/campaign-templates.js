const templates = {
  launch: { title: '신제품 론칭 캠페인', summary: '제품 영상과 SNS 소재로 출시 메시지를 전해요.', goal: '브랜드·콘텐츠', services: ['video', 'print'], notes: '제품·서비스: \n출시 일정: \n참고 콘텐츠: \n필요한 결과물: ' },
  creator: { title: '크리에이터 브랜드 협업', summary: '고객과 맞는 크리에이터와 콘텐츠를 기획해요.', goal: '브랜드·콘텐츠', services: ['creator', 'video'], notes: '브랜드·제품: \n희망 크리에이터·콘텐츠 형식: \n게시 일정·편수: \n참고 사례: ' },
  'brand-event': { title: '팝업·브랜드 행사', summary: '공간과 사람, 현장 콘텐츠를 함께 연결해요.', goal: '브랜드·콘텐츠', services: ['festival', 'artist', 'video', 'print'], notes: '브랜드·행사 목적: \n장소·일정: \n가수·MC 등 필요한 역할: \n사전 콘텐츠·현장 기록 범위: ' },
  tourism: { title: '관광·지역 캠페인', summary: '지역의 매력을 여행 콘텐츠와 사람으로 전해요.', goal: '관광·지역 프로젝트', services: ['video', 'creator'], notes: '지역·프로젝트 대상: \n소개할 장소·경험: \n희망 일정: \n참고 콘텐츠: ' }
};
export function campaignPreset(key) {
  const item = Object.hasOwn(templates, key) ? templates[key] : null;
  return item ? { ...item, services: [...item.services] } : null;
}
export const campaignKeys = Object.keys(templates);
