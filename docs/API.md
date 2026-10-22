# API

기본 주소: `http://localhost:8080/api`

요청과 응답은 JSON을 사용합니다. 인증이 필요한 요청에는 `Authorization: Bearer <token>` 헤더를 전달합니다.

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/health` | 서버 상태 |
| GET | `/rooms` | 방 목록 |
| GET | `/me` | 현재 사용자 |
| GET | `/reservations` | 예약 내역 |
| GET | `/reservations/{id}` | 예약 상세 |
| POST | `/reservations` | 예약 생성 |
| POST | `/reservations/{id}/cancel` | 예약 취소 |

## 샘플 계정

| 사용자 | 토큰 |
|---|---|
| 민주 | `alice-demo-token` |
| 준호 | `bob-demo-token` |

## 조회 파라미터

- `/rooms`: `people` — 이용 인원, 기본값 1
- `/reservations`: `page` — 페이지 번호, 기본값 1
- `/reservations`: `size` — 페이지 크기, 기본값 20
- `/reservations`: `date` — 날짜, 선택 항목, `YYYY-MM-DD`

## 예약 생성

```json
{
  "roomId": 1,
  "startAt": "2030-07-01T14:00:00+09:00",
  "endAt": "2030-07-01T16:00:00+09:00",
  "totalPrice": 20000,
  "pointsUsed": 0
}
```

시간은 오프셋을 포함한 ISO 8601 형식입니다.

예약 응답 필드: `id`, `userId`, `roomId`, `startAt`, `endAt`, `totalPrice`, `pointsUsed`, `status`.

오류 응답 예시:

```json
{"error": "요청 형식과 입력 범위를 확인하세요."}
```
