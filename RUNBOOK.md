# RUNBOOK

Git Dungeon 프런트엔드 운영/개발 시 자주 필요한 절차(로컬 실행 모드, 환경 변수, 트러블슈팅)를 한 곳에 모아둔 문서입니다.

## 로컬 개발

### 빠른 시작

```bash
pnpm install
pnpm dev
```

### 환경 변수

> Vite 환경 변수는 문자열로 주입됩니다. 예를 들어 `VITE_ENABLE_MSW`는 `true/false`가 아니라 `"true"/"false"`로 비교됩니다.

| Key                 | 의미                      | 비고                                                              |
| ------------------- | ------------------------- | ----------------------------------------------------------------- |
| `VITE_ENABLE_MSW`   | DEV에서 MSW 활성화 플래그 | `"true"`일 때만 활성화. Vitest(`pnpm test`)에서는 항상 MSW 활성화 |
| `VITE_API_BASE_URL` | API 서버 base URL         | DEV에서는 선택. PROD에서는 필수(미설정 시 런타임 에러)            |

#### 동작 규칙(요약)

- **DEV + `VITE_ENABLE_MSW=true`**: MSW가 브라우저 요청을 가로채므로 백엔드 없이도 UI가 동작합니다.
- **DEV + `VITE_ENABLE_MSW=false`**: 프런트가 실백엔드로 요청하므로 백엔드가 필요합니다.
- **PROD**: `VITE_API_BASE_URL`이 없으면 앱이 시작 시점에 에러를 던집니다.
- **DEV에서 MSW 활성화 + `VITE_API_BASE_URL`이 현재 오리진과 다름**: MSW 동작 일관성을 위해 `window.location.origin`을 사용하며 콘솔 경고가 출력됩니다.

### 권장 실행 시나리오

#### 1) MSW 모드(백엔드 없이 개발)

```env
VITE_ENABLE_MSW=true
VITE_API_BASE_URL=http://localhost:3000
```

- `VITE_API_BASE_URL`은 있어도 되지만, DEV+MSW에서 오리진이 다르면 실제 요청은 현재 오리진을 기준으로 처리됩니다.
- UI/플로우 확인, 컴포넌트 개발, 계약 테스트(MSW 기반)에 적합합니다.

#### 2) 실서버 모드(실백엔드 연동)

```env
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=http://localhost:3000
```

- 이 모드에서는 백엔드 서버가 반드시 실행 중이어야 합니다.
- 네트워크 오류는 화면 크래시 대신 안내 메시지/리다이렉트로 처리되도록 설계되어 있습니다.

## “MSW off + 백엔드 down” 기대 동작

재현:

1. `VITE_ENABLE_MSW=false`
2. 백엔드 서버 중지(예: `http://localhost:3000` 접속 불가)
3. `http://localhost:5173/login?redirect=%2Finventory`로 접근

기대:

- 로그인 UI가 렌더링됩니다.
- 세션 확인이 실패하면 로그인 화면에서 “서버에 문제가 있어 로그인할 수 없습니다.” 메시지가 표시됩니다.
- `/login`은 카탈로그 선행 로딩에서 제외되어, 카탈로그를 받지 못해도 로그인 UI 자체가 막히지 않습니다.

## 트러블슈팅

### `ERR_CONNECTION_REFUSED`가 뜹니다

1. 실서버 모드(`VITE_ENABLE_MSW=false`)인지 확인
2. `VITE_API_BASE_URL`이 실제 백엔드 오리진과 일치하는지 확인
3. 백엔드 서버가 실행 중인지 확인
4. 백엔드 없이 개발하려면 `VITE_ENABLE_MSW=true`로 변경 후 `pnpm dev` 재시작
