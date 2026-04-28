package io.takima.allocine;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfig {

    @Bean
    OpenAPI api(){
        return new OpenAPI().info(new Info()
                .contact(new Contact().name("Takima").email("...@takima.fr"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"))
                .title("AlloCiné API")
                .description("API pour un site web de cinéma")
                .version("1.0.0"));
    }
}
