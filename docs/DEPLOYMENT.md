# Render 배포

저장소 루트의 render.yaml은 개인 시연용 웹 서비스 room-for-personal 하나와 1GB 영속 디스크 하나를 정의합니다. 서버와 디스크는 유료이며 생성 화면에서 예상 비용을 확인하세요. 프론트엔드와 API는 같은 서버에서 제공됩니다.

## 최초 생성

1. Render에서 GitHub 저장소 접근을 허용합니다.
2. New → Blueprint에서 이 저장소를 선택합니다.
3. Blueprint Name은 room-for, Branch는 main, Blueprint Path는 render.yaml로 입력합니다.
4. 서비스 1개와 디스크 1개의 구성 및 비용을 확인하고 생성합니다.
5. 서비스가 Live 상태가 되면 대시보드에 표시되는 Render 기본 HTTPS 주소로 접속합니다.

화면 상단과 GET /api/environment에서 환경 이름 '개인'을 확인할 수 있습니다. 모든 접속자는 같은 서버 데이터를 공유합니다.

## 기존 Blueprint 구성을 교체하는 경우

1. 변경된 render.yaml을 main 브랜치에 push합니다.
2. 기존 Blueprint에서 Manual Sync를 실행합니다. 새로 생성할 서비스가 room-for-personal 하나인지 확인합니다.
3. 새 서비스가 정상 동작하는지 확인합니다.
4. 이전 설정에서 제외된 기존 서비스를 대시보드에서 직접 삭제합니다. 삭제 확인 화면에서 연결된 디스크와 저장 데이터의 삭제 범위를 확인하세요.
5. 서비스·디스크 목록과 Billing에서 불필요한 리소스가 남아 있지 않은지 확인합니다.

Blueprint 정의를 변경하거나 연결을 해제하는 것만으로 실제 리소스는 삭제되지 않습니다. 이전 정의를 남겨둔 채 서비스를 삭제하면 다음 동기화 때 다시 생성될 수 있으므로 위 순서로 진행합니다. [Render 공식 안내](https://render.com/docs/infrastructure-as-code#deleting-resources).

## 데이터와 업데이트

- 인스턴스는 1개입니다. 영속 디스크의 H2 파일 DB에 데이터를 저장합니다.
- DB 비밀번호는 Render가 생성합니다. 생성 후 변경하면 기존 DB에 접속할 수 없으므로 유지하세요.
- Flyway가 최초 실행에 스키마와 샘플 데이터를 생성합니다. 재시작해도 기존 데이터를 유지하며 다시 주입하지 않습니다.
- 이미 실행한 마이그레이션 파일은 수정하지 말고 새 버전 파일을 추가하세요.
- 코드 push에 따른 자동 배포는 꺼져 있습니다. 업데이트는 해당 서비스의 Manual Deploy로 적용합니다.
- Blueprint 설정 자동 동기화는 코드 자동 배포와 별개입니다. 변경을 직접 검토하려면 Blueprint Settings에서 Auto Sync를 끄고 수동 동기화합니다.
- 사용하지 않을 때는 Suspend Service로 중지하고 필요할 때 Resume합니다. 보관 중인 디스크 비용은 별도로 발생합니다.
- 디스크를 삭제하면 저장된 데이터도 사라집니다. 단순 재시작과 디스크 삭제는 다릅니다.

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
2. 화면 상단에 '개인'이 표시되는지 확인합니다.
3. 데이터를 변경한 뒤 서비스를 재시작해 변경 내용이 남아 있는지 확인합니다.

로컬 기본 실행은 메모리 DB를 사용합니다. 로컬에서도 파일 DB를 사용하려면 backend 폴더에서 다음과 같이 실행합니다.

```sh
DATABASE_URL='jdbc:h2:file:./data/booking;DATABASE_TO_LOWER=TRUE;DB_CLOSE_ON_EXIT=FALSE' ./mvnw spring-boot:run
```
