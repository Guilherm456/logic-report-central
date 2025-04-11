package com.logic.report_central.services;

import com.logic.report_central.dtos.UserDTO;
import com.logic.report_central.entities.User;
import com.logic.report_central.enums.StatusEnum;
import com.logic.report_central.repositories.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service
public class UserService {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    Logger logger = LoggerFactory.getLogger(UserService.class);


    public User createUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()) != null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail já cadastrado");

        try {
            String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
            User user = new User(
                    userDTO.getEmail(),
                    encodedPassword,
                    userDTO.getUsername()
            );

            return userRepository.save(user);
        } catch (Exception e) {
            this.logger.error("Erro ao criar usuário: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar usuário");
        }
    }

    public User updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        if ( user.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");

        if (userRepository.findByEmail(userDTO.getEmail()) != null && !user.getEmail().equals(userDTO.getEmail()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail já cadastrado");

        try {
            user.setEmail(userDTO.getEmail());
            user.setUsername(userDTO.getUsername());
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
                user.setPassword(encodedPassword);
            }


            return userRepository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar usuário");
        }
    }


    public Page<User> findAllUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return userRepository.findByUsernameOrEmailContainingIgnoreCase(search, pageable);
        } else {
            return userRepository.findAll(pageable);
        }
    }


    public User findById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        if ( user.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        return user;
    }

    public User deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        if ( user.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");

        if (user.getDoctors() != null && !user.getDoctors().isEmpty() && user.getDoctors().getFirst().getStatus() != StatusEnum.D)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário não pode ser deletado, pois está associado a um médico");

        try {
            user.setStatus(StatusEnum.D);
            userRepository.save(user);
            return user;
        } catch (Exception e) {
            this.logger.error("Erro ao deletar usuário: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao deletar usuário");
        }
    }

}