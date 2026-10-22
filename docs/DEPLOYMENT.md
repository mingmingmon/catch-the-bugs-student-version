# Render 배포

저장소 루트의 render.yaml은 독립된 웹 서비스 10개와 각각의 1GB 영속 디스크를 생성합니다. 서버와 디스크는 유료이며 생성 화면에서 총 예상 비용을 확인하세요.

## 생성

1. Render에서 GitHub 저장소 접근을 허용합니다.
2. New → Blueprint에서 이 저장소를 선택합니다.
3. Blueprint Name은 room-for, Branch는 main, Blueprint Path는 render.yaml로 입력합니다.
4. 서비스 10개와 디스크 10개의 구성 및 비용을 확인하고 생성합니다.
5. 각 서비스의 Render 기본 HTTPS 주소로 접속합니다. 서비스 이름과 실제 주소가 다를 수 있으므로 대시보드의 주소를 사용하세요.

| 서비스 이름 | 환경 |
|---|---|
| room-for-team-01 ~ 04 | 1~4팀 |
| room-for-control | 운영 |
| room-for-standby-01 ~ 04 | 예비 |
| room-for-validation | 배포 검증 |

화면 상단과 GET /api/environment에서 환경 이름을 확인할 수 있습니다.

## 데이터와 업데이트

- 서비스마다 인스턴스는 1개입니다. 각 디스크에 별도의 H2 파일 DB를 저장합니다.
- DB 비밀번호는 서비스별로 Render가 생성합니다. 생성 후 변경하면 기존 DB에 접속할 수 없으므로 유지하세요.
- Flyway가 최초 실행에 스키마와 샘플 데이터를 생성합니다. 재시작하면 기존 데이터를 유지하며 다시 주입하지 않습니다.
- 이미 실행한 마이그레이션 파일은 수정하지 말고 새 버전 파일을 추가하세요.
- 코드 push에 따른 자동 배포는 꺼져 있습니다. 업데이트는 먼저 검증 환경에서 Manual Deploy로 확인하고 필요한 서비스에 적용하세요.
- Blueprint 설정 자동 동기화는 코드 자동 배포와 별개입니다. 실습 중에는 Blueprint Auto Sync도 대시보드에서 끄고, 설정 변경을 검토한 뒤 수동 동기화하세요.
- 서비스의 디스크를 삭제하면 저장된 데이터도 사라집니다. 단순 재시작과 디스크 삭제는 다릅니다.

## 설정

| 환경변수 | 설명 |
|---|---|
| PORT | Render가 지정하는 HTTP 포트 |
| APP_ENVIRONMENT_NAME | 화면에 표시할 환경 이름 |
| APP_DATA_DIR | 컨테이너 시작 시 준비할 데이터 디렉터리 |
| DATABASE_URL | JDBC 연결 주소 |
| DATABASE_USERNAME | 기본 sa |
| DATABASE_PASSWORD | DB 비밀번호 |
| JAVA_TOOL_OPTIONS | JVM 메모리 설정 |

Docker 시작 스크립트는 마운트된 디스크 안의 데이터 디렉터리를 준비한 뒤 app 사용자로 Java를 실행합니다.

## 배포 후 확인

1. /api/health가 200과 UP을 반환하는지 확인합니다.
2. 화면 상단 환경 이름이 접속한 서버와 일치하는지 확인합니다.
3. 검증 환경에서 데이터를 변경하고 서비스를 재시작해 변경 내용이 남아 있는지 확인합니다.
4. 다른 환경에서는 그 변경 내용이 보이지 않는지 확인합니다.

로컬 기본 실행은 메모리 DB를 사용합니다. 로컬에서도 파일 DB를 사용하려면 backend 폴더에서 다음과 같이 실행합니다.

```sh
DATABASE_URL='jdbc:h2:file:./data/booking;DATABASE_TO_LOWER=TRUE;DB_CLOSE_ON_EXIT=FALSE' ./mvnw spring-boot:run
```
