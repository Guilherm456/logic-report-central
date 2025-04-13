package com.logic.report_central.services;

import com.logic.report_central.dtos.TemplateDTO;
import com.logic.report_central.models.entities.Doctor;
import com.logic.report_central.models.entities.Template;
import com.logic.report_central.models.entities.User;
import com.logic.report_central.models.enums.StatusEnum;
import com.logic.report_central.repositories.DoctorRepository;
import com.logic.report_central.repositories.TemplateRepository;
import com.logic.report_central.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TemplateService {

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public Template createTemplate(TemplateDTO templateDTO) {

        Doctor doctor = doctorRepository.findByIdAndStatusNot(templateDTO.getDoctor_id(), StatusEnum.D)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado"));

        try {
            Template template = new Template(
                    templateDTO.getDescription(),
                    templateDTO.getContent(),
                    doctor

            );

            return templateRepository.save(template);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar template");
        }
    }

    public Template updateTemplate(Long id, TemplateDTO templateDTO) {
        Template template = templateRepository.findByIdAndStatusNot(id, StatusEnum.D)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Template não encontrado"));

        Doctor doctor = doctorRepository.findByIdAndStatusNot(templateDTO.getDoctor_id(), StatusEnum.D)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado"));


        try {
            template.setDescription(templateDTO.getDescription());
            template.setContent(templateDTO.getContent());
            template.setDoctor(doctor);

            return templateRepository.save(template);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar template");
        }

    }

    public Template findById(Long id) {
        return templateRepository.findByIdAndStatusNot(id, StatusEnum.D)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Template não encontrado"));
    }

    public Page<Template> findAllTemplates(int page, int size, String search) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail);

        if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");

        Doctor doctor = user.doctorLinked()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário logado não está vinculado a um médico ativo"));

        Pageable pageable = PageRequest.of(page, size);
        String searchTermLower = (search != null && !search.trim().isEmpty()) ? search.toLowerCase() : "";

        return templateRepository.findActiveByDoctorIdAndOptionalSearchTerm(doctor.getId(), searchTermLower, pageable);

    }

    public Template deleteTemplate(Long id) {
        Template template = templateRepository.findByIdAndStatusNot(id, StatusEnum.D)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Template não encontrado"));

        try {
            template.setStatus(StatusEnum.D);
            return templateRepository.save(template);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao deletar template");
        }
    }
}
