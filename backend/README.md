# ROOM FOR API

Java 17 + Spring Boot 기반 백엔드입니다. Java가 설치되어 있지 않다면 [설치 안내](../docs/SETUP.md)를 참고하세요. Windows PowerShell에서는 `./mvnw` 대신 `.\mvnw.cmd`를 사용합니다.

## 실행

이 폴더에서 실행합니다.

```sh
./mvnw spring-boot:run
```

기본 주소는 http://localhost:8080입니다. 포트는 PORT 환경변수로 변경할 수 있습니다. IntelliJ에서는 이 폴더의 pom.xml을 Maven 프로젝트로 열어 실행할 수 있습니다.

## 테스트

```sh
./mvnw test
```

## 통합 빌드

이 폴더에서 다음 명령을 실행합니다.

```sh
cd ../frontend
npm ci
npm run build
cd ../backend
./mvnw verify
java -jar target/room-for-0.0.1-SNAPSHOT.jar
```

프론트엔드의 dist가 JAR의 정적 리소스로 포함됩니다. [API 명세](../docs/API.md)를 참고하세요.
