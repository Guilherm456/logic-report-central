package com.logic.report_central.repositories.specifications;

import com.logic.report_central.models.entities.Doctor;
import com.logic.report_central.models.enums.DoctorTypeEnum;
import com.logic.report_central.models.enums.StatusEnum;
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

    public static Specification<Doctor> statusNot(StatusEnum status) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.notEqual(root.get("status"), status);
    }

    public static Specification<Doctor> hasType(DoctorTypeEnum type) {
        return (root, query, criteriaBuilder) -> {
            if (type == null) return null;

            return criteriaBuilder.equal(root.get("type"), type);
        };
    }
}