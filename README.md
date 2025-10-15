# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## Embed Renderer Workspace

- `packages/embed-renderer`는 프런트엔드와 Nest 서버가 공유하는 Satori 기반 SVG 렌더러를 제공합니다.
- 주요 API
  - `renderEmbedSvg(params)`로 동일한 데이터 구조를 입력해 즉시 SVG 문자열을 생성합니다.
  - 브라우저용 `loadFontsFromUrls`, 서버용 `loadFontsFromFiles`로 환경별 폰트 로더를 구성합니다.
  - `DashboardEmbeddingBannerSatori`, `resolveEmbedSatoriPreset` 등 기존 프리셋/컴포넌트는 패키지에서 재노출됩니다.
- 빌드 방법: `pnpm run build:packages`
  - 선언 파일은 `tsc --emitDeclarationOnly`, 번들은 `tsup`으로 `dist/`에 출력됩니다.
- 사용 예제: `packages/embed-renderer/examples/basic.ts`
  - Nest 백엔드에서는 `@git-dungeon/embed-renderer/server`, 프런트에서는 `@git-dungeon/embed-renderer/browser`를 import 해 동일한 UI를 재사용할 수 있습니다.

## API Error Handling

- `httpGetWithSchema` 유틸은 ky 기반 `httpGet` 위에서 동작하며 Zod 스키마와 `ApiResponse` 구조를 동시에 검증합니다.
- 검증 실패 시 `ApiError`가 발생하며, `status` 422와 Zod 이슈 목록을 `payload.issues`에 담아 로깅·알림 시스템에서 활용할 수 있습니다.
- 서버가 `success: false`를 반환하면 `ApiError`의 `payload`에 `error`/`meta` 정보를 포함해 호출부가 세부 코드를 분기할 수 있도록 했습니다.
- 공통 응답 메타(`requestId`, `generatedAt` 등)는 `apiResponseMetaSchema`에서 관리하며 추후 서비스별 확장을 허용합니다.

## Domain Schemas

- 인증·설정·던전 로그 등 도메인 응답은 각 `src/entities/**/model/types.ts`에서 Zod 스키마(`*Schema`)로 정의되고 `z.infer` 타입을 재사용합니다.
- `settingsProfileSchema`, `embeddingPreviewSchema`, `dungeonLogsResponseSchema`처럼 응답 구조를 명시적으로 표현해 런타임/정적 타입 간 일관성을 유지합니다.
- 인증 세션 응답(`authSessionPayloadSchema`)과 임베드 프리뷰(`embedPreviewPayloadSchema`)도 공통 `ApiResponse` 패턴과 함께 사용돼 토큰 만료나 스키마 오류를 조기에 감지할 수 있습니다.
- 후속 API 모듈에서는 이 스키마를 그대로 사용해 `httpGetWithSchema`와 결합함으로써 계약 위반 시 빠르게 오류를 감지할 수 있습니다.

## Testing

- Vitest 환경을 도입했으며 `pnpm test`로 단위 테스트를 실행할 수 있습니다. (CI 환경에서만 실행하도록 권장)
- 테스트 실행 전 `jsdom` 및 `msw` 핸들러가 초기화되도록 `src/mocks/tests/setup.ts`에서 공통 설정을 구성했습니다.
- 로컬에서는 `pnpm test src/entities/auth/api/get-auth-session.test.ts` 처럼 개별 파일을 지정해 빠르게 피드백을 받을 수 있습니다.
