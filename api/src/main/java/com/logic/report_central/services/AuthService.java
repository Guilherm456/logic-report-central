package com.logic.report_central.services;

import com.logic.report_central.configs.utils.JwtUtil;
import com.logic.report_central.dtos.Auth.AuthDTO;
import com.logic.report_central.dtos.Auth.AuthResponseDTO;
import com.logic.report_central.entities.User;
import com.logic.report_central.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponseDTO authenticate(AuthDTO request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user != null && passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            return new AuthResponseDTO(token);
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
    }
}
