package com.logic.report_central.configs.initializer;

import com.logic.report_central.entities.User;
import com.logic.report_central.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UsersInitializer implements CommandLineRunner {

    @Autowired
    private UsersRepository userRepository;
    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(encoder.encode("admin123"));
            userRepository.save(admin);
        }
    }
}