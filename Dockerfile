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
RUN apt-get update && apt-get install -y --no-install-recommends gosu && rm -rf /var/lib/apt/lists/* \
    && useradd --uid 10001 --create-home --shell /bin/sh app
COPY deploy/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod 755 /usr/local/bin/entrypoint.sh
COPY --from=build /app/backend/target/room-for-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["java", "-jar", "/app/app.jar"]
