# ROOM FOR

스터디룸을 검색하고 예약할 수 있는 웹 애플리케이션입니다.

- 백엔드: Java 17, Spring Boot, Spring JDBC, H2
- 프론트엔드: React, TypeScript, Vite

## 실행 환경

Java 17 이상과 Node.js 22.12 이상이 필요합니다. Maven Wrapper는 `backend/`에 포함되어 있습니다.

## 로컬 실행

저장소 루트에서 백엔드를 실행합니다.

```sh
cd backend
./mvnw spring-boot:run
```

다른 터미널의 저장소 루트에서 프론트엔드를 실행합니다.

```sh
cd frontend
npm ci
npm run dev
```

브라우저에서 `http://localhost:5173`에 접속합니다. 백엔드는 `http://localhost:8080`에서 실행됩니다.

샘플 계정은 화면 상단에서 선택할 수 있습니다. 샘플 데이터는 2030년 날짜를 사용합니다. 로컬 기본 DB는 메모리 방식입니다. 배포 환경에서는 서버별 영속 디스크에 데이터를 저장합니다.

## 빌드 및 테스트

```sh
cd frontend
npm ci
npm run build
cd ../backend
./mvnw verify
java -jar target/room-for-0.0.1-SNAPSHOT.jar
```

통합 빌드 후에는 `http://localhost:8080`에서 화면과 API가 함께 제공됩니다.

Docker를 사용한다면 저장소 루트에서:

```sh
docker compose up --build
```

## 프로젝트 구조

```text
backend/src/main/java/dev/roomfor/   Java 애플리케이션
backend/src/main/resources/         실행 설정과 샘플 데이터
backend/src/test/                   테스트
backend/pom.xml             Maven 설정
backend/mvnw                Maven Wrapper
frontend/                   웹 화면
```

- [API](docs/API.md)
- [백엔드 실행](backend/README.md)
- [프론트엔드 실행](frontend/README.md)
- [기여 방법](CONTRIBUTING.md)
- [배포](docs/DEPLOYMENT.md)
