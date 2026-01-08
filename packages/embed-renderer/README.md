# @git-dungeon/embed-renderer

Satori 기반으로 Git Dungeon 대시보드 임베딩 배너를 SVG로 렌더링하는 공용 패키지입니다. 프런트엔드와 백엔드 모두 동일한 TSX 컴포넌트를 재사용할 수 있도록 설계되어 있습니다.

## 패키지 특징

- `renderEmbedSvg` 함수 하나로 캐릭터 개요 데이터를 입력해 즉시 SVG 문자열을 생성
- 환경별 폰트 로더 제공
  - 브라우저: `loadFontsFromUrls`
  - 서버(Node/Nest): `loadFontsFromFiles`
- 기존 대시보드 컴포넌트와 동일한 레이아웃/프리셋/다국어 구성을 그대로 유지
- 보너스 스탯 샤이닝 애니메이션을 위한 SMIL 기반 후처리(`enableAnimation`, `injectBonusAnimation`) 제공
- React/Satori를 peer dependency로 두어 앱과 버전을 공유

## 설치

Mono-repo(workspace) 환경이라면 루트 `package.json`에서 의존성을 추가한 뒤 `pnpm install`을 실행합니다.

```bash
pnpm add @git-dungeon/embed-renderer
```

## 사용법

### 브라우저 (Vite 프런트엔드)

```ts
import {
  renderEmbedSvg,
  type EmbedFontConfig,
} from "@git-dungeon/embed-renderer";
import { loadFontsFromUrls } from "@git-dungeon/embed-renderer/browser";

const fonts: EmbedFontConfig[] = await loadFontsFromUrls([
  {
    name: "Noto Sans KR",
    url: "/assets/NotoSansKR-Regular.otf",
    weight: 400,
  },
]);

const svg = await renderEmbedSvg({
  theme: "light",
  size: "compact",
  language: "ko",
  overview: characterOverview,
  fonts,
  enableAnimation: true,
});
```

### 서버 (NestJS 등 Node 환경)

```ts
import { renderEmbedSvg } from "@git-dungeon/embed-renderer";
import { loadFontsFromFiles } from "@git-dungeon/embed-renderer/server";

const fonts = await loadFontsFromFiles([
  {
    name: "Noto Sans KR",
    path: "/app/assets/NotoSansKR-Regular.otf",
    weight: 400,
  },
]);

const svg = await renderEmbedSvg({
  theme: "dark",
  size: "wide",
  language: "en",
  overview: characterOverview,
  fonts,
  enableAnimation: true,
});

response.setHeader("Content-Type", "image/svg+xml; charset=utf-8").send(svg);
```

## 공개 API

| 경로                             | 설명                                             |
| -------------------------------- | ------------------------------------------------ |
| `renderEmbedSvg(options)`        | Satori를 사용해 TSX 컴포넌트를 SVG 문자열로 변환 |
| `DashboardEmbeddingBannerSatori` | Satori 친화적으로 구성된 배너 컴포넌트           |
| `injectBonusAnimation(svg)`      | 기존 SVG에 보너스 스탯 SMIL 애니메이션을 주입       |
| `resolveEmbedSatoriPreset` 등    | 사이즈/테마/언어 프리셋 유틸                     |
| `loadFontsFromUrls`              | 브라우저용 폰트 로더                             |
| `loadFontsFromFiles`             | 서버용 폰트 로더                                 |

### 애니메이션 옵션

`enableAnimation` 플래그를 `renderEmbedSvg` 인자로 전달하면 보너스 스탯 수치에 SMIL 샤이닝 애니메이션이 자동으로 주입됩니다.  
기존 SVG 문자열에 직접 애니메이션을 적용하고 싶다면 `injectBonusAnimation(svg)` 유틸을 사용하세요.

- Chrome / Firefox / Edge 등 SMIL을 지원하는 브라우저에서는 `<img src="data:image/svg+xml">` 형태로도 애니메이션이 재생됩니다.
- OG 이미지 생성기 등 SVG를 즉시 래스터라이즈하는 환경에서는 정적 SVG로 폴백됩니다.

## 개발 스크립트

- `pnpm --filter "@git-dungeon/embed-renderer" build` : 타입 선언(`tsc --emitDeclarationOnly`) 및 번들(`tsup`) 생성
- `pnpm run typecheck` : 루트에서 실행 시 브라우저/서버 타입 검사 확인

## 예제

`packages/embed-renderer/examples/basic.ts` 파일을 참고하면 최소 구성으로 SVG를 생성하는 방법을 확인할 수 있습니다.

또한 Express 기반 테스트 서버(`packages/embed-renderer/examples/express-server.js`)를 제공하여 실제 HTTP 응답을 검증할 수 있습니다.

```bash
# 1) 패키지 빌드
pnpm --filter "@git-dungeon/embed-renderer" build

# 2) Express 테스트 서버 실행 (기본 포트 4173)
pnpm --filter "@git-dungeon/embed-renderer" run example:express
```

서버는 `/embed.svg` 엔드포인트에서 캐시된 폰트와 샘플 데이터를 이용해 SVG 문자열을 반환하며, `?theme=dark&size=wide&lang=en` 등 쿼리 파라미터로 옵션을 바꿔볼 수 있습니다.

## 라이선스

Internal use only.
