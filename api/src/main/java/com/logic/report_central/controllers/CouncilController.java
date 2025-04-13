package com.logic.report_central.controllers;

import com.logic.report_central.dtos.shared.PaginationDTO;
import com.logic.report_central.models.entities.Council;
import com.logic.report_central.models.entities.States;
import com.logic.report_central.services.CouncilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/council")
public class CouncilController {
    @Autowired
    private CouncilService councilService;

    @GetMapping()
    public ResponseEntity<PaginationDTO<Council>> getAllCouncils(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(PaginationDTO.fromPage(councilService.listAll(page, size, search)));
    }

    @GetMapping("/states")
    public ResponseEntity<List<States>> getStates() {
        return ResponseEntity.ok(councilService.getStates());
    }
}
