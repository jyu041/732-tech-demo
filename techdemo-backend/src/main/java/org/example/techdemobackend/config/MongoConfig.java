package org.example.techdemobackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.mapping.event.ValidatingMongoEventListener;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class MongoConfig implements WebMvcConfigurer {

    @Bean
    public ValidatingMongoEventListener validatingMongoEventListener(
            LocalValidatorFactoryBean factory) {
        return new ValidatingMongoEventListener(factory.getValidator());
    }

    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Since this is a local application, we can be more permissive with CORS
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This configures Spring to serve uploaded files
        Path uploadDir = Paths.get("./uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}