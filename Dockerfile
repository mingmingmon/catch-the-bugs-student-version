FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn -B dependency:go-offline
COPY backend/src src
COPY --from=frontend-build /app/dist /app/frontend/dist
RUN mvn -B package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/backend/target/room-for-0.0.1-SNAPSHOT.jar app.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
