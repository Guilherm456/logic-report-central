package com.logic.report_central.controllers;

import com.logic.report_central.dtos.ReportDTO;
import com.logic.report_central.dtos.shared.PaginationDTO;
import com.logic.report_central.models.entities.Report;
import com.logic.report_central.services.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping()
    public ResponseEntity<Report> createReport(@Valid @RequestBody ReportDTO reportDTO) {
        return ResponseEntity.status(201).body(reportService.createReport(reportDTO));
    }

    @GetMapping()
    public ResponseEntity<PaginationDTO<Report>> getReport(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size,
                                                           @RequestParam(required = false) String search) {
        return ResponseEntity.ok(PaginationDTO.fromPage(reportService.getReports(page, size, search)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable Long id, @Valid @RequestBody ReportDTO reportDTO) {
        return ResponseEntity.ok(reportService.updateReport(id, reportDTO));
    }

}
