FROM openjdk:17

# Define o diretório de trabalho dentro do container
WORKDIR /api-erp

# Expoe a porta 8080
EXPOSE 8080

# Adiciona o arquivo JAR ao container
ADD ./target/maisPraTi-0.0.1-SNAPSHOT.jar api-erp.jar

# Comando para rodar o JAR correto
ENTRYPOINT ["java", "-jar", "api-erp.jar"]