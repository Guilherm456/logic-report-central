package com.logic.report_central.services;

import com.logic.report_central.dtos.ReportDTO;
import com.logic.report_central.models.entities.Doctor;
import com.logic.report_central.models.entities.Report;
import com.logic.report_central.models.entities.User;
import com.logic.report_central.models.enums.DoctorTypeEnum;
import com.logic.report_central.models.enums.StatusEnum;
import com.logic.report_central.repositories.DoctorRepository;
import com.logic.report_central.repositories.ReportRepository;
import com.logic.report_central.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.logging.Logger;

@Service
public class ReportService {
    Logger logger = Logger.getLogger(ReportService.class.getName());
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userDetailsService;

    public Report createReport(ReportDTO reportDTO) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userDetailsService.findByEmail(userEmail);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");

        Doctor doctor = user.doctorLinked()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário não vinculado a um médico ativo"));

        if (doctor.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado");

        if (!doctor.getType().equals(DoctorTypeEnum.E))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Médico informado não é um especialista para poder criar Laudo");

        Doctor doctorRequester = doctorRepository.findById(reportDTO.getDoctor_requester_id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico solicitante não encontrado"));

        if (doctorRequester.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico solicitante não encontrado");

        if (!doctorRequester.getType().equals(DoctorTypeEnum.S))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Médico solicitante informado não é um especialista para poder solicitar Laudo");

        try {
            Report report = new Report(
                    reportDTO.getPatient_name(),
                    reportDTO.getPatient_gender(),
                    reportDTO.getPatient_birth_date(),
                    reportDTO.getReport_content(),
                    doctorRequester,
                    doctor
            );

            return reportRepository.save(report);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar Laudo");

        }
    }

    public Report updateReport(Long id, ReportDTO reportDTO) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Doctor doctor = userDetailsService.findByEmail(userEmail)
                .doctorLinked()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário não vinculado a um médico ativo"));

        if (doctor.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado");

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Laudo não encontrado"));

        if (report.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Laudo não encontrado");

        if (report.getDoctor().getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico solicitante não encontrado");

        if (!report.getDoctor().getId().equals(doctor.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Laudo não pertence ao médico logado");

        if (!doctor.getType().equals(DoctorTypeEnum.E))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Médico informado não é um especialista para poder criar Laudo");

        Doctor doctorRequester = doctorRepository.findById(reportDTO.getDoctor_requester_id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico solicitante não encontrado"));

        if (doctorRequester.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico solicitante não encontrado");

        if (!doctorRequester.getType().equals(DoctorTypeEnum.S))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Médico solicitante informado não é um especialista para poder solicitar Laudo");

        try {
            report.setDoctor(doctor);
            report.setDoctorRequest(doctorRequester);
            report.setPatientName(reportDTO.getPatient_name());
            report.setPatientGender(reportDTO.getPatient_gender());
            report.setPatientBirthDate(reportDTO.getPatient_birth_date());
            report.setContent(reportDTO.getReport_content());
            return reportRepository.save(report);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar Laudo");
        }
    }


    public Page<Report> getReports(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        try {
            if (search != null && !search.isEmpty())
                return reportRepository.findAllBySearch(search, pageable);
            return reportRepository.findAll(pageable);
        } catch (Exception e) {
            logger.severe("Erro ao buscar Laudos: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao buscar Laudos");
        }
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Laudo não encontrado"));
    }

    public Report deleteReportById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Laudo não encontrado"));
        if (report.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Laudo não encontrado");

        try {
            report.setStatus(StatusEnum.D);
            return reportRepository.save(report);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao deletar Laudo");
        }
    }
}
