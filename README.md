# 헤이엔터씨 웹사이트 화면 MVP

[웹사이트 바로 보기](https://noeyheajmik.github.io/heyenterc-mvp/) · [레퍼런스 탐색](https://noeyheajmik.github.io/heyenterc-mvp/#/references)

확정 서비스 기획과 디자인 가이드를 바탕으로 만든 메인·레퍼런스·홍보 구성 화면입니다. 프레임워크나 외부 패키지 설치 없이 Node.js로 실행합니다.

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
- 회사·공식 사례·자료 출처 링크

실제 회원가입, 계정 인증, 프로젝트 접수, DB, 파일 업로드와 외부 전송은 연결하지 않았습니다. 워크스페이스는 역할 선택으로 진입하는 화면 체험이며 실제 로그인은 아닙니다. 사업자·아티스트의 등록과 업무 화면은 후속 범위입니다. 프로젝트·메시지·문서와 상담 메모는 현재 탭의 메모리에만 유지되어 새로고침하면 초기화되고, 저장한 공개 사례 ID만 `localStorage`에 보관됩니다.

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
- [Pretendard](https://github.com/orioncactus/pretendard), v1.3.9, SIL Open Font License

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
