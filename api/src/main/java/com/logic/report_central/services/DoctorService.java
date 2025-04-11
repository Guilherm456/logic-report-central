package com.logic.report_central.services;

import com.logic.report_central.repositories.DoctorBoardRepository;
import com.logic.report_central.repositories.DoctorRepository;
import com.logic.report_central.repositories.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorBoardRepository doctorBoardRepository;


}
