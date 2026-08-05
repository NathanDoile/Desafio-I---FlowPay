FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY target/*.jar flowpay-api.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "flowpay-api.jar"]