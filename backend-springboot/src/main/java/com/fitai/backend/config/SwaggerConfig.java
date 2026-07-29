package com.fitai.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI fitAiOpenAPI() {
        Server localServer = new Server();
        localServer.setUrl("http://localhost:8000/api/v1");
        localServer.setDescription("Local Development Server");

        Contact contact = new Contact();
        contact.setName("FitAI Pro Engineering Team");
        contact.setEmail("support@fitaipro.com");

        License license = new License()
                .name("Apache 2.0")
                .url("https://www.apache.org/licenses/LICENSE-2.0");

        Info info = new Info()
                .title("FitAI Pro REST API Documentation")
                .version("1.0.0")
                .description("Production-ready REST API services for FitAI Fitness & Health AI Platform.")
                .contact(contact)
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer));
    }
}
