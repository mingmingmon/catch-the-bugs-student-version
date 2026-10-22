# 기여 방법

## 작업 시작

최신 `main`에서 팀별 작업 브랜치를 만듭니다.

```sh
git switch main
git pull --ff-only
git switch -c team-01/short-description
```

`team-01`은 배정받은 팀 번호로 변경하세요. `main`에 직접 push하지 않고 Pull Request로 변경을 제출합니다.

## 변경 및 확인

- 변경 내용을 설명할 수 있는 작은 단위로 커밋합니다.
- 동작에 영향을 주는 변경에는 적절한 테스트를 추가합니다.
- 프론트엔드 빌드와 백엔드 검증을 실행합니다.

```sh
cd frontend
npm ci
npm run build
cd ../backend
./mvnw verify
```

## Pull Request

```sh
git push -u origin team-01/short-description
```

GitHub에서 대상 브랜치를 `main`으로 선택해 Pull Request를 엽니다. 변경 내용, 확인 방법과 실제 확인 결과를 작성하세요. 검토가 끝날 때까지 병합하지 않습니다.
