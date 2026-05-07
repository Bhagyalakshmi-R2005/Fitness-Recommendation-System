# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Install fitness-common first
COPY fitness-common /app/fitness-common
RUN cd /app/fitness-common && mvn clean install -DskipTests

# Build aiservice
COPY aiservice /app/aiservice
RUN cd /app/aiservice && mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/aiservice/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
