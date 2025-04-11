package com.logic.report_central.services;

import com.logic.report_central.dtos.DoctorDTO;
import com.logic.report_central.entities.Council;
import com.logic.report_central.entities.Doctor;
import com.logic.report_central.entities.States;
import com.logic.report_central.entities.User;
import com.logic.report_central.enums.StatusEnum;
import com.logic.report_central.repositories.CouncilRepository;
import com.logic.report_central.repositories.DoctorRepository;
import com.logic.report_central.repositories.StateRepository;
import com.logic.report_central.repositories.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private CouncilRepository councilRepository;

    @Autowired
    private UsersRepository userRepository;

    @Transactional
    public Doctor createDoctor(DoctorDTO doctorDTO) {
        User user = userRepository.findById(doctorDTO.getUser_id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (user.getUsername().equals(("admin")))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário não pode ser um médico");

        if (user.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");

        if (doctorRepository.existsByUserId(user.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário já tem um médico associado");

        if (doctorRepository.existsByCouncilIdAndCouncilNumberAndStateId(
                doctorDTO.getCouncil_id(),
                doctorDTO.getCouncil_number(),
                doctorDTO.getState_id()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Conselho já cadastrado para esse estado");

        States state = stateRepository.findById(doctorDTO.getState_id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estado não encontrado"));

        Council council = councilRepository.findById(doctorDTO.getCouncil_id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conselho não encontrado"));



        Doctor doctor = new Doctor(
                doctorDTO.getName(),
                doctorDTO.getDoctor_type(),
                user,
                council,
                doctorDTO.getCouncil_number(),
                state
        );

        return doctorRepository.save(doctor);
    }


    public Page<Doctor> findAllDoctors(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return doctorRepository.findByNameOrCouncilNumberContainingIgnoreCase(search,  pageable);
        }
        return doctorRepository.findAll( pageable);
    }

    public Doctor findById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado"));
        if (doctor.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado");
        return doctor;
    }

    @Transactional
    public Doctor updateDoctor(Long id, DoctorDTO doctorDTO) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado"));
        if (doctor.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado");


        Optional<Doctor> existingDoctor = doctorRepository.findByCouncilIdAndCouncilNumberAndStateId(
                doctorDTO.getCouncil_id(),
                doctorDTO.getCouncil_number(),
                doctorDTO.getState_id());

        if (existingDoctor.isPresent() && !existingDoctor.get().getId().equals(doctor.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Conselho já cadastrado para esse estado");

        States state = stateRepository.findById(doctorDTO.getState_id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estado não encontrado"));

        Council council = councilRepository.findById(doctorDTO.getCouncil_id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conselho não encontrado"));

        doctor.setName(doctorDTO.getName());
        doctor.setType(doctorDTO.getDoctor_type());
        doctor.setCouncil(council);
        doctor.setCouncilNumber(doctorDTO.getCouncil_number());
        doctor.setState(state);

        return doctorRepository.save(doctor);
    }

    public Doctor deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado"));
        if (doctor.getStatus().equals(StatusEnum.D))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado");

        if(!doctor.getTemplates().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Médico não pode ser deletado, pois tem templates associados");

        try {
            doctor.setStatus(StatusEnum.D);
            doctorRepository.save(doctor);
            return doctor;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao deletar médico");
        }
    }
}
