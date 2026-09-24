# 그누보드7 지식·문서 템플릿

## Glitter Knowledge

Glitter Knowledge는 기존 GnuBoard7 게시판 콘텐츠를 지식 베이스, 문서 사이트, 도움말 센터처럼 보여주는 User Template입니다. 별도의 Knowledge CMS가 아니라 기존 게시판·분류·게시글을 읽기 좋은 문서 화면으로 표현합니다. 현재 release는 0.13.0입니다.

## 무엇을 제공하나요

기존 GnuBoard7 기능을 그대로 사용하면서 다음 문서 탐색 흐름을 제공합니다.

```text
GnuBoard7 Board     → Knowledge Topic      (주제)
GnuBoard7 Category  → Knowledge Collection (컬렉션)
GnuBoard7 Post      → Knowledge Document   (문서)
```

Knowledge는 별도의 게시판, 분류, 인증, 권한, 검색 백엔드 또는 관리자 CMS를 만들지 않습니다. 게시판의 공개 읽기 권한과 게시글 데이터는 GnuBoard7 및 `sirsoft-board`가 담당합니다.

## 시작하기

처음 설치한 뒤에는 다음 순서로 사용할 수 있습니다.

1. Glitter Knowledge를 설치하고 활성화합니다.
2. GnuBoard7 관리자에서 문서용 게시판을 만듭니다. 예: `사용 가이드`.
3. 게시판을 공개하고 방문자가 읽을 수 있도록 권한을 설정합니다.
4. 필요한 분류를 추가합니다. 예: `시작하기`, `사용법`, `FAQ`.
5. 게시글을 작성합니다. 예: `GnuBoard7 시작하기`, `자주 묻는 질문`.
6. `/knowledge`에서 게시판이 Topic으로 발견되고, 분류는 Collection으로, 게시글은 Document로 표시되는지 확인합니다.

예시에 나온 게시판·분류·게시글은 설명을 위한 예시일 뿐이며, 템플릿이 자동으로 생성하지 않습니다.

## 회원 기능

Knowledge는 GnuBoard7의 기존 인증·사용자 기능을 사용하는 로그인(`/login`), 회원가입(`/register`), 계정(`/account`) 화면을 제공합니다. 인증, 사용자 데이터, 프로필 및 비밀번호 처리는 GnuBoard7 Core가 담당하며, Knowledge는 그 화면과 연결만 제공합니다. 로그인 사용자는 관리자 이동, 언어 선택, 로그아웃도 기존 G7 기능으로 이용할 수 있습니다.

## 화면 모드

헤더에서 시스템, 라이트, 다크 화면 모드를 선택할 수 있습니다. 시스템 모드는 기기의 화면 설정을 따르며, 선택한 모드는 GnuBoard7의 기존 화면 모드 설정과 공유됩니다.

## 콘텐츠가 없을 때

처음 설치했을 때 Topic이 보이지 않는 것은 오류가 아닙니다. 공개적으로 읽을 수 있는 게시판이 없으면 Knowledge Home은 Topic을 표시하지 않습니다. 게시판을 만들고 읽기 권한을 설정하면 Topic으로 발견됩니다. Category가 없으면 Collection 탐색이 비어 있을 수 있으며, Post가 없으면 문서 목록은 empty state를 표시합니다.

## 문서 작성 방식

일반 사용자의 GnuBoard7 게시글 작성 화면은 plain textarea를 사용하며 새 게시글의 기본 `content_mode`는 `text`입니다. text 문서는 평문으로 표시됩니다. Markdown을 공식 지원하지 않으므로 text 본문에 `## 제목`을 입력해도 Markdown heading이나 Knowledge TOC가 만들어지지 않습니다.

관리자 게시글 화면에서 HtmlEditor를 사용해 `content_mode=html` 문서를 만들 수 있는 경우, Reader는 HTML을 안전하게 정리한 뒤 표시합니다. HTML 본문에 실제 `h2`, `h3`, `h4` heading이 있으면 해당 heading을 바탕으로 TOC를 제공할 수 있습니다. HTML 작성 기능은 Knowledge가 별도로 제공하는 CMS 기능이 아니라 GnuBoard7 관리자 기능입니다.

## 주요 기능

- Knowledge Home에서 공개 게시판 Topic 발견
- Topic 문서 수와 Topic 범위 문서 페이지네이션
- Topic 범위 검색과 최근 문서 목록
- 검색어가 있을 때 Topic·Collection·Reader 이동에서 검색 context 유지
- 검색어 문맥과 결과 metadata를 포함한 Topic 범위 검색
- Board Category 기반 Collection sibling 탐색 및 필터링
- 유효하지 않은 Collection과 빈 Collection의 구분
- Document Reader와 breadcrumb
- Collection 검색/페이지 상태를 유지하는 문서 이동
- 같은 게시판 범위의 Previous / Next 문서 이동
- 문서가 없을 때의 empty state
- 반응형 문서 화면
- 한국어·영어 UI
- text 평문 렌더링
- HTML 문서의 안전한 렌더링과 heading 기반 TOC
- 긴 HTML 문서에서 현재 읽는 heading을 표시하는 TOC orientation

## 지원하지 않는 것

Glitter Knowledge는 다음 기능을 추가하지 않습니다.

- 별도 Knowledge 또는 Article 데이터베이스
- 전역 검색 엔진이나 AI 검색
- Markdown parser
- 문서 버전 관리·협업·승인 workflow
- 자동 샘플 콘텐츠 생성
- 별도 인증·권한 시스템

## 기술 참고

템플릿 source-of-truth는 `templates/_bundled/glitter-knowledge/`입니다. frontend source는 `src`에서 static build를 거쳐 `dist`가 되고, GnuBoard7의 공식 template lifecycle을 통해 설치본에 반영됩니다. `dist`와 installed template은 생성/배포 결과이므로 직접 수정하지 않습니다.

주요 파일은 `template.json`, `components.json`, `routes.json`, `layouts/`, `lang/`, `src/`, `dist/`, `package.json`, `package-lock.json`입니다. `node_modules/`는 로컬 의존성이며 release artifact가 아닙니다.

## 요구사항

- Gnuboard 7 User Template runtime
- `sirsoft-board >=1.1.2`
- React 19 peer runtime
- build dependency로 Node/npm
- HTML sanitization dependency `dompurify` 3.3.1

## Routes

- `/` → `home`
- `/knowledge` → `home`
- `/knowledge/:slug` → `knowledge/home`
- `/knowledge/:slug/collections` → `knowledge/collection`
- `/knowledge/:slug/documents/:id` → `knowledge/reader`

## Knowledge Home and Collection

Knowledge Home은 사용 가능한 board를 발견하고 명시적으로 선택한 뒤 최근 문서, category, board 범위 검색을 제공합니다. Home 검색어 `q`는 게시글 API의 `search` parameter로 전달됩니다.

Collection은 category와 검색어를 함께 유지하며, `category`와 `q` query를 사용해 해당 board의 문서를 필터링합니다. 별도의 전역 Knowledge 검색 route나 검색 인덱스는 없습니다.

## Reader

Reader는 post detail API를 통해 제목, metadata, category, author, 날짜, 본문을 표시합니다. breadcrumb, board/category navigation, 기존 document의 previous/next navigation을 제공합니다. 인접 문서 navigation은 `sirsoft-board` navigation API를 사용하며 Reader 본문 availability와 독립적으로 로드됩니다.

HTML 문서는 `DocumentContent`가 DOMPurify로 먼저 sanitize한 뒤 h2-h4 heading을 분석하고 render-time anchor와 table of contents를 생성합니다. eligible heading이 2개 이상일 때 TOC를 표시하며 native hash link를 사용합니다. Reader가 `#heading-id` fragment로 직접 열리면 sanitized document가 렌더된 뒤 현재 문서의 heading으로 이동합니다. 실제 DocumentContent root의 viewport 진행률을 얇은 progressbar로 표시하며 상태는 저장하지 않습니다. text mode는 일반 React text로 렌더링되고 Markdown이나 TOC로 해석되지 않습니다. `HtmlContent`는 generic safe HTML/text renderer로 유지됩니다.
HTML 문서는 `DocumentContent`가 DOMPurify로 먼저 sanitize한 뒤 h2-h4 heading을 분석하고 render-time anchor와 table of contents를 생성합니다. eligible heading이 2개 이상일 때 TOC를 표시하며 native hash link를 사용합니다. Reader가 `#heading-id` fragment로 직접 열리면 sanitized document가 렌더된 뒤 현재 문서의 heading으로 이동합니다. 문서가 스크롤되면 TOC는 현재 읽는 heading을 `aria-current="location"`으로 표시합니다. 실제 DocumentContent root의 viewport 진행률을 얇은 progressbar로 표시하며 상태는 저장하지 않습니다. text mode는 일반 React text로 렌더링되고 Markdown이나 TOC로 해석되지 않습니다. `HtmlContent`는 generic safe HTML/text renderer로 유지됩니다.

## i18n

모든 visible sentence와 accessibility label은 language file에 둡니다. `lang/ko.json`과 `lang/en.json`의 key set을 동일하게 유지하며 layouts에는 문장을 직접 작성하지 않습니다.

## Build and customization

정적 검증과 빌드는 다음 명령을 사용합니다.

```bash
npm run type-check
npm run build
```

`npm run dev`와 HMR은 사용하지 않습니다. `dist`와 installed template은 생성/배포 결과이므로 직접 수정하지 말고 bundled source를 변경한 뒤 공식 lifecycle을 사용합니다. customization은 bundled source, 기존 G7 layout syntax, 등록된 component contract, `gk-*` CSS scope, ko/en translation 구조를 보존하는 범위에서 수행합니다.

## Lifecycle

설치와 update는 G7의 공식 template lifecycle이 bundled source를 installed template으로 반영하도록 수행합니다. source와 installed template을 수동 복사로 동기화하지 않습니다. production에서 lifecycle, DB, cache, service를 변경하기 전에는 별도의 운영 승인과 안전성 확인이 필요합니다.

## License

Glitter Knowledge는 MIT License로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE)를 참조하십시오.
