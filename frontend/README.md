# ROOM FOR Web

React + TypeScript + Vite 기반 프론트엔드입니다.

## 개발

Node.js 22.12 이상과 실행 중인 백엔드가 필요합니다. [백엔드 실행 방법](../backend/README.md)을 참고하세요.

```sh
npm ci
npm run dev
```

기본 주소는 `http://localhost:5173`입니다. `/api` 요청은 `http://127.0.0.1:8080`으로 프록시됩니다. 백엔드 주소를 변경하려면:

```sh
API_PROXY_TARGET=http://127.0.0.1:18080 npm run dev
```

## 빌드

```sh
npm run build
```

결과는 `dist/`에 생성됩니다. `backend/`에서 Maven으로 패키징하면 정적 리소스로 포함됩니다.
