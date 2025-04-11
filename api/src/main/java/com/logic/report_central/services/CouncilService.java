package com.logic.report_central.services;

import com.logic.report_central.entities.Council;
import com.logic.report_central.entities.States;
import com.logic.report_central.repositories.CouncilRepository;
import com.logic.report_central.repositories.StateRepository;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@Service
public class CouncilService {
    @Autowired
    private CouncilRepository councilRepository;

    @Autowired
    private StateRepository stateRepository;

    public List<States> getStates() {
        try{
            return stateRepository.findAll();
        }catch(Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao buscar estados");
        }
    }

    public Page<Council> listAll(int page, int size, String search) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            if (search == null || search.isEmpty()) {
                return councilRepository.findAll(pageable);
            } else {
                return councilRepository.findByNameContainingIgnoreCase(search, pageable);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao buscar conselhos");
        }
    }



}
