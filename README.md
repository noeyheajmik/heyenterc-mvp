# 헤이엔터씨 웹사이트 화면 MVP

[웹사이트 바로 보기](https://noeyheajmik.github.io/heyenterc-mvp/) · [레퍼런스 탐색](https://noeyheajmik.github.io/heyenterc-mvp/#/references)

확정 서비스 기획과 디자인 가이드를 바탕으로 만든 메인·레퍼런스·홍보 구성·의뢰자 워크스페이스와 협업 프로필 화면입니다. 프레임워크나 외부 패키지 설치 없이 Node.js로 실행합니다.

## 실행

```sh
npm run dev
```

미리보기: http://127.0.0.1:4173

```sh
npm run check
npm run build
```

빌드 결과는 `dist/`에 생성됩니다.

## 구현 범위

- 반응형 헤더, 서비스 펼침 메뉴와 모바일 메뉴
- 지역 이미지 히어로와 협업 소개, 여섯 서비스 분야
- 목표·예산을 선택하는 홍보 방향 탐색
- 레퍼런스 목록·검색·다중 필터·상세·브라우저 내 북마크
- 목표·예산·일정·관심 분야 입력, 홍보 구성 비교와 상담 메모 연결
- 프로젝트 관리 화면의 정적인 구성 예시, 진행 안내와 FAQ
- 상담 메모 작성·편집·복사·텍스트 파일 저장·프로젝트 초안 연결
- 기관·개인 의뢰자 워크스페이스 체험 진입과 업무 홈
- 프로젝트 목록·검색·상태 필터·3단계 생성·초안 저장
- 프로젝트 개요·브리프·제안서 버전·일정·예산·참여자
- 프로젝트와 전역 메시지함·문서함, 검토 의견 연결·자료 메모·텍스트 저장
- 제작 파트너·아티스트 탐색, 키워드·분야·지역 필터와 빈 결과 안내
- 가상 프로필 상세, 협업 후보 선택과 상담 메모 연결
- 제작 파트너·아티스트의 3단계 프로필 초안 작성·검토·수정·텍스트 저장
- 제작 파트너·아티스트 업무 홈, 협업 요청 검색·회신 상태 필터·참여 조건 작성 및 수정
- 배정 작업의 준비 체크리스트·자료 메모·매니저 대화, 역할별 프로필 초안 연결
- 직원 운영 홈·프로젝트 검색·담당자 배정·진행 단계 관리
- 제작 일정 추가·수정과 참여자 역할·협의 상태 관리, 의뢰자 화면과 공유
- 결과물 검토메모 버전 공유·문서함 연결·의뢰자 의견·메모 확인 상태와 지난 검토 기록
- 제안 검토본 작성·버전 공유, 의뢰자 제안서·문서함·피드백과 같은 체험 데이터로 연결
- 회사·공식 사례·자료 출처 링크

실제 회원가입, 계정 인증, 프로젝트 접수, DB, 파일 업로드와 외부 전송은 연결하지 않았습니다. 워크스페이스는 역할 선택으로 진입하는 화면 체험이며 실제 로그인은 아닙니다. 사업자·아티스트는 프로필 초안 작성과 협업 요청·배정 작업 관리 화면을 체험할 수 있습니다. 직원 운영 화면에서 담당자·진행 단계·제안 검토본을 관리하는 흐름까지 체험할 수 있습니다. 프로젝트·메시지·문서와 상담 메모는 현재 탭의 메모리에만 유지되어 새로고침하면 초기화되고, 저장한 공개 사례 ID만 `localStorage`에 보관됩니다.

## 기준 문서

- [서비스 기획안](https://chatgpt.com/space/page_c5eb06efd9d08191ab655b86ab873b22)
- [디자인 가이드](https://chatgpt.com/space/page_cd8f9c727f6c81918409e5242a589f1a)
- [전체 화면 설계 계획](https://chatgpt.com/space/page_c61a1d567c2c819193662ea55b8ad893)

## 콘텐츠와 자산

프로젝트의 소개 내용은 [공식 서비스](https://heyenterc.com/service)를 기준으로 요약했습니다. 실제 예산·성과를 추정하지 않습니다. 카드의 사진은 분위기용이며 실제 납품물과 구분해 표시합니다. 공개 게시 전에는 실제 결과물과 브랜드 자산의 사용 권한을 별도로 확인해야 합니다.

- 로고: 사용자가 제공한 `logo_web_green.png` 원본. 색상과 비율을 유지했습니다.
- 제주 해안: rawkkim / [Unsplash](https://unsplash.com/photos/RKSgg04wt7E), photo-1666348185731-0d20e028ff02
- 공연 분위기: Unsplash, photo-1470229722913-7c0e2dbbafd3
- 숲 분위기: Unsplash, photo-1441974231531-c6227db76b6e
- 한글: [Wanted Sans](https://github.com/wanteddev/wanted-sans), SIL Open Font License
- 영문: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), SIL Open Font License

서체와 사진은 로컬 자산으로 제공하므로 페이지 실행 중 외부 CDN 요청이 필요하지 않습니다.

## 화면 주소

- 메인: `/#/home`
- 레퍼런스 목록: `/#/references`
- 사례 상세: `/#/references/goheung`
- 목표·예산 입력: `/#/budget`
- 홍보 구성 비교: `/#/plans`
- 워크스페이스 체험 진입: `/#/account`
- 의뢰자 업무 홈: `/#/workspace`
- 프로젝트 목록·생성: `/#/workspace/projects`, `/#/workspace/new`
- 샘플 프로젝트: `/#/workspace/projects/autumn/overview`
- 제작 파트너·상세: `/#/partners`, `/#/partners/local-frame`
- 아티스트·상세: `/#/artists`, `/#/artists/on-stage`
- 제작 파트너 업무 공간: `/#/collab?role=partners`
- 아티스트 업무 공간: `/#/collab?role=artists`
- 협업 요청·배정 작업: `/#/collab/requests?role=partners`, `/#/collab/projects?role=partners`
- 직원 운영 홈·프로젝트: `/#/staff`, `/#/staff/projects`
- 직원 제작 진행·참여자: `/#/staff/projects/autumn/schedule`, `/#/staff/projects/autumn/people`
- 직원 제안 관리·상세: `/#/staff/proposals`, `/#/staff/projects/autumn`
- 내 협업 프로필: `/#/collab/profile?role=partners`
- 협업 프로필 초안: `/#/join`, `/#/join?role=artists`
- 메시지·문서함: `/#/workspace/messages`, `/#/workspace/documents`

필터와 구성 입력 조건은 URL에 반영되어 새로고침과 뒤로 가기에서도 이어집니다. 공개 사례 4개와 기획 예시 2개를 구분하며, 구성 아이디어는 실제 견적이나 예산 내 실행 보장이 아닙니다.

## GitHub 동기화와 배포

저장소: [noeyheajmik/heyenterc-mvp](https://github.com/noeyheajmik/heyenterc-mvp)

웹 미리보기: https://noeyheajmik.github.io/heyenterc-mvp/

이 MVP 저장소는 공개 저장소이며 GitHub Pages 배포를 활성화했습니다.

```sh
git add .
git commit -m "Update website screens"
git push origin main
```

`main`에 푸시하면 GitHub Actions에서 코드 검사와 정적 빌드를 실행합니다. Pages를 활성화하고 저장소 Actions 변수 `PAGES_ENABLED`를 `true`로 설정하면 같은 워크플로에서 자동 배포합니다. Pages는 GitHub Actions를 배포 소스로 사용합니다. 비공개 저장소의 Pages 지원 여부는 GitHub 요금제에 따라 다릅니다.

자산 경로는 상대 경로여서 저장소 하위 주소에서도 작동합니다. 계정·DB·비밀 키는 사용하지 않습니다.

## 현재 UI 스타일

Linktree 공개 사이트를 참고해 캡슐형 탐색, 큰 굵은 제목, 둥근 카드, 넓은 색면, 분할형 히어로를 적용했습니다. 기존 메인 컬러 `#00DA4A`를 유지하며 딥그린 `#173E2D`, 크림 `#F3F3ED`, 라일락 `#E8DDFB`, 핑크 `#F7D5DF`를 보조색으로 사용합니다. 공통 변경은 `public/brand-theme.css`에서 관리합니다.

한글은 Wanted Sans, 영문·숫자는 Plus Jakarta Sans를 사용합니다. [Linktree의 공식 소개](https://linktr.ee/blog/the-story-behind-linktrees-brand-new-typeface)에 따르면 Link Sans는 Linktree 전용 서체입니다. 프로젝트에는 Link Sans 사용 권한이 확인된 파일이 없어 유사한 공개 서체를 적용했습니다. Link Sans 자체를 배포한 상태는 아닙니다.

업무·제안 카드와 아이콘은 중립 배경과 차콜 톤으로 통일했습니다. 프로젝트 아이콘 타일은 44×44px이며, 셀렉트는 하나의 안쪽 화살표를 사용합니다. 라디오·체크박스는 제목 기준선에 맞춰 배치하고 키보드 포커스를 카드 테두리로 표시합니다. 푸터의 대형 타이포는 제거했습니다.

협업 탐색의 7개 프로필과 포트폴리오는 모두 가상 예시이며 실제 업체·아티스트·수행 이력·확정 가능 일정을 나타내지 않습니다. 후보와 등록 초안은 메모리에만 유지되며 실제 접수나 섭외 요청은 발생하지 않습니다. 검색 조건은 URL에 반영됩니다.

협업 업무 공간은 제작 파트너와 아티스트의 샘플 요청·작업 상태를 분리합니다. 회신 전 입력과 회신한 참여 의견을 구분하고, 참여 의견만으로 작업을 확정하지 않습니다. 프로필 초안은 역할별로 현재 탭에 유지하며 실제 계정·계약·납품·회신과 연결되지 않습니다.

직원 운영 화면은 실제 관리자 권한이 없는 공개 체험입니다. 의뢰자와 같은 메모리의 프로젝트를 사용하므로 담당자 변경, 제안 공유와 검토 의견을 역할을 바꿔 확인할 수 있습니다. 초안 상태의 의뢰에는 제안을 공유할 수 없으며, 새 검토본은 이전 버전을 유지합니다. 새로고침하면 운영 기록과 입력한 내용은 초기화됩니다.

레퍼런스 캡슐 필터는 밑줄 없이 표시하고, 키보드 포커스 테두리가 잘리지 않게 여백을 확보했습니다. 협업 탐색의 업무 공간·프로필 작성 버튼은 동일한 캡슐 형태와 높이로 통일했습니다.

제작 일정과 참여자 정보도 의뢰자 화면과 같은 프로젝트 데이터에 반영됩니다. 결과물은 실제 파일 대신 검토메모로 구성하며, 새 버전 공유 시 이전 구성·확인 상태·의견을 지난 검토 기록에 보관합니다. 메모 확인은 실제 납품 승인이나 프로젝트 완료와 별개입니다.
