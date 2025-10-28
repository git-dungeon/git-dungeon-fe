# Git Dungeon Frontend

TanStack Router, React 19, Vite를 기반으로 한 Git Dungeon 프런트엔드 애플리케이션입니다. 인증, 대시보드, 인벤토리, 로그, 임베딩 등 주요 도메인을 FSD 구조로 관리합니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

- 개발 서버: http://localhost:5173
- 테스트: `pnpm test`
- 타입 검사: `pnpm typecheck`
- 임베드 렌더러 패키지 빌드: `pnpm run build:packages`

## 환경 변수

| Key                 | 설명                                            |
| ------------------- | ----------------------------------------------- |
| `VITE_API_BASE_URL` | (선택) API 기본 URL. 미지정 시 동일 오리진 사용 |
| `VITE_ENABLE_MSW`   | 개발 환경에서 MSW 활성화 여부                   |

`.env` 예시는 다음과 같습니다.

```env
VITE_ENABLE_MSW=true
```

## GitHub OAuth 연동 개요

- 프런트엔드는 `/auth/github` 엔드포인트로 리다이렉트하여 로그인 플로우를 시작합니다.
- 백엔드는 better-auth 기반으로 GitHub Authorization Code 교환과 세션 쿠키 발급을 전담합니다.
- 프런트엔드에서 별도 OAuth 환경 변수나 PKCE 설정은 필요하지 않습니다.
- 리다이렉트 시 프런트에서 전달하는 쿼리 파라미터는 `redirect`(선택) 하나만 사용하며, 값은 `sanitizeRedirectPath`로 검증됩니다.
- API 계약(공통 `ApiResponse` 스키마 준수):
  - `GET /api/auth/session` → `{ success: true, data: { session?: AuthSession | null } }`
  - `POST /api/auth/logout` → `{ success: true, data: { success: boolean } }`
- 개발 및 프로덕션 모두 `GET /auth/github?redirect=/target` 리다이렉트로 로그인 흐름을 시작하며, MSW는 302 응답과 쿠키 설정을 모사해 팝업 없이 동일한 UX를 제공합니다.
- 응답이 `success: false`이거나 401/403일 경우 프런트엔드는 세션을 초기화하고 로그인 페이지로 유도합니다.

## 코드 구조 요약

- `src/shared`: 공통 유틸, config, API 클라이언트.
- `src/entities`: 도메인 데이터 모델, 타입, 조회 API.
- `src/features`: 사용자 액션/뮤테이션, UI + 비즈니스 로직 단위.
- `src/widgets`: 여러 feature/entity를 조합한 UI 블록.
- `src/pages`: 페이지 단위 레이아웃.
- `src/routes`: TanStack Router 경로 정의.

## Embed Renderer Workspace

- `packages/embed-renderer`는 프런트엔드와 Nest 서버가 공유하는 Satori 기반 SVG 렌더러입니다.
- 주요 API
  - `renderEmbedSvg(params)`로 동일한 데이터 구조를 입력해 SVG 문자열을 생성합니다.
  - 브라우저용 `loadFontsFromUrls`, 서버용 `loadFontsFromFiles`로 환경별 폰트 로더를 제공합니다.
  - `DashboardEmbeddingBannerSatori`, `resolveEmbedSatoriPreset` 등 기존 프리셋/컴포넌트를 재노출합니다.
- 빌드 방법: `pnpm run build:packages`
  - 선언 파일은 `tsc --emitDeclarationOnly`, 번들은 `tsup`으로 `dist/`에 출력됩니다.
- 사용 예제: `packages/embed-renderer/examples/basic.ts`
  - Nest 백엔드에서는 `@git-dungeon/embed-renderer/server`, 프런트에서는 `@git-dungeon/embed-renderer/browser`를 import 해 동일한 UI를 재사용할 수 있습니다.

## API Error Handling 메모

- `apiClient`는 `ky.create()/extend()` 기반 공통 클라이언트입니다.
- `configureApiClientAuthentication`으로 401 응답 시 재검증 로직(예: 세션 리프레시, 세션 정리)을 주입할 수 있습니다.
- `requestWithSchema`/`httpGetWithSchema` 유틸은 응답을 받은 뒤 Zod 스키마와 공통 `ApiResponse` 구조를 동시에 검증합니다.
- 검증 실패 시 `ApiError`가 발생하며, `status` 422 + Zod 이슈 목록을 `payload.issues`에 담습니다.
- 서버가 `success: false`를 반환하면 `ApiError.payload.error`/`meta` 정보를 바탕으로 호출부가 분기 처리를 수행합니다.

## 테스트

- Vitest 환경을 도입했으며 `pnpm test`로 단위 테스트를 실행할 수 있습니다.
- 테스트 실행 전 `src/mocks/tests/setup.ts`에서 MSW 핸들러가 초기화됩니다.
- 로컬에서는 `pnpm test src/entities/auth/api/get-auth-session.test.ts`처럼 개별 파일 실행이 가능합니다.
