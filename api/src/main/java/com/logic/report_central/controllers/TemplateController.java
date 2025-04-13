package com.logic.report_central.controllers;

import com.logic.report_central.dtos.TemplateDTO;
import com.logic.report_central.dtos.shared.PaginationDTO;
import com.logic.report_central.models.entities.Template;
import com.logic.report_central.services.TemplateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/templates")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    @PostMapping()
    public ResponseEntity<Template> createTemplate(@Valid @RequestBody TemplateDTO templateDTO) {
        return ResponseEntity.ok(templateService.createTemplate(templateDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Template> updateTemplate(@PathVariable Long id, @Valid @RequestBody TemplateDTO templateDTO) {
        return ResponseEntity.ok(templateService.updateTemplate(id, templateDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Template> getTemplateById(@PathVariable Long id) {
        return ResponseEntity.ok(templateService.findById(id));
    }

    @GetMapping()
    public ResponseEntity<PaginationDTO<Template>> getAllTemplates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(PaginationDTO.fromPage(templateService.findAllTemplates(page, size, search)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Template> deleteTemplate(@PathVariable Long id) {
        return ResponseEntity.ok(templateService.deleteTemplate(id));
    }

}
