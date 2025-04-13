package com.logic.report_central.repositories.Specifications;

import com.logic.report_central.entities.Doctor;
import com.logic.report_central.enums.DoctorTypeEnum;
import org.springframework.data.jpa.domain.Specification;

public class DoctorSpecification {

    public static Specification<Doctor> searchByNameOrCouncilNumber(String search) {
        return (root, query, criteriaBuilder) -> {
            if (search == null || search.isEmpty()) return null;

            String likeSearch = "%" + search.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likeSearch),
                    criteriaBuilder.like(root.get("councilNumber"), likeSearch)
            );
        };
    }

    public static Specification<Doctor> hasType(DoctorTypeEnum type) {
        return (root, query, criteriaBuilder) -> {
            if (type == null) return null;

            return criteriaBuilder.equal(root.get("type"), type);
        };
    }
}