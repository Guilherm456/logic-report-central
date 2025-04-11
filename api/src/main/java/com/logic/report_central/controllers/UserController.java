package com.logic.report_central.controllers;

import com.logic.report_central.dtos.PaginationDTO;
import com.logic.report_central.dtos.UserDTO;
import com.logic.report_central.entities.User;
import com.logic.report_central.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDTO userDTO) {
        User user = userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<User> updateUser(@PathVariable String uuid, @Valid @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(uuid, userDTO));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<User> getUserByUuid(@PathVariable String uuid) {
        return ResponseEntity.ok(userService.findByUuid(uuid));
    }

    @GetMapping()
    public ResponseEntity<PaginationDTO<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Page<User> userPage = userService.findAllUsers(page, size, search);

        return ResponseEntity.ok(PaginationDTO.fromPage(userPage));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<User> deleteUser(@PathVariable String uuid) {
        return ResponseEntity.ok(userService.deleteUser(uuid));
    }

}