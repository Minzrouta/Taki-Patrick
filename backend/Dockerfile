FROM maven:3.9.9-eclipse-temurin-17 as maven
WORKDIR /tmp/build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /allo_cine
COPY --from=maven /tmp/build/target/*.jar app.jar
COPY src/main/resources/assets ./assets
ENTRYPOINT ["java", "-jar", "app.jar"]
