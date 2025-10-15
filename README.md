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
