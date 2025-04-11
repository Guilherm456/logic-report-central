package com.logic.report_central.services;

import com.logic.report_central.dtos.UserDTO;
import com.logic.report_central.entities.User;
import com.logic.report_central.enums.StatusEnum;
import com.logic.report_central.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public User createUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()) != null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail já cadastrado");

        try {
            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setPassword(userDTO.getPassword());

            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);

            return userRepository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar usuário");
        }
    }

    public User updateUser(String uuid, UserDTO userDTO) {
        User user = userRepository.findByUuid(UUID.fromString(uuid));
        if (user == null || user.getStatus() == StatusEnum.D)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");

        try {
            if (userDTO.getUsername() != null)
                user.setUsername(userDTO.getUsername());
            if (userDTO.getEmail() != null)
                user.setEmail(userDTO.getEmail());
            if (userDTO.getPassword() != null)
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

            return userRepository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar usuário");
        }
    }


    public Page<User> findAllUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return userRepository.findByUsernameOrEmailContainingIgnoreCaseAndNotDeleted(search, StatusEnum.D, pageable);
        } else {
            return userRepository.findAllNotDeleted(StatusEnum.D, pageable);
        }
    }


    public User findByUuid(String uuid) {
        User user = userRepository.findByUuid(UUID.fromString(uuid));
        if (user == null || user.getStatus() == StatusEnum.D)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        return user;
    }

    public User deleteUser(String uuid) {
        User user = userRepository.findByUuid(UUID.fromString(uuid));
        if (user == null || user.getStatus() == StatusEnum.D)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");

        try {
            user.setStatus(StatusEnum.D);
            userRepository.save(user);
            return user;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao deletar usuário");
        }
    }

}