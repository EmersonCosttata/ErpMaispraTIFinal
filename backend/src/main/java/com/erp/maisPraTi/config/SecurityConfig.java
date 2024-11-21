package com.erp.maisPraTi.config;

import com.erp.maisPraTi.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig{

    @Autowired
    private Environment environment;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    private static final String[] PUBLIC = {
            "/auth/login/**",
            "/auth/forgot-password/**",
            "/api/h2-console/**",
            "/api/v3/docs/**",
            "/api/docs/**",
            "/api/swagger-ui/**",
            "/api/swagger-resources/**",
            "/api/documentation.html",
            "/api/forgot-password/**",
            "/api/reset-password/**"
    };
    private static final String[] OPERATOR_OR_ADMIN = {
            "/auth/reset-password/**",
            "/auth/validate-user/**",
            "/api/clientes/**",
            "/api/fornecedores/**",
            "/api/produtos/**",
            "/api/vendas/**"
    };
    private static final String[] ADMIN = {
            "/api/usuarios/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Libera o H2 quando o perfil ativo é o de "test"
        if (Arrays.asList(environment.getActiveProfiles()).contains("test"))
            http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(PUBLIC).permitAll()
                        .requestMatchers(OPERATOR_OR_ADMIN).hasAnyRole("OPERATOR", "ADMIN")
                        .requestMatchers(ADMIN).hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling.accessDeniedHandler(customAccessDeniedHandler))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(Arrays.asList("*"));
        corsConfig.setAllowedMethods(Arrays.asList("POST", "GET", "PUT", "DELETE", "PATCH"));
        corsConfig.setAllowCredentials(true);
        corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

}
