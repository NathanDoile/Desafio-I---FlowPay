FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

RUN addgroup -S flowpay && adduser -S flowpay -G flowpay

COPY --chown=flowpay:flowpay target/*.jar flowpay-api.jar

USER flowpay

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "flowpay-api.jar"]