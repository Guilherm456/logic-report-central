package com.logic.report_central.repositories.specifications;

import com.logic.report_central.models.entities.Report;
import com.logic.report_central.models.enums.StatusEnum;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class ReportSpecification {

    public static Specification<Report> findAllBySearch(String searchTerm) {
        return (root, query, criteriaBuilder) -> {
            String likePattern = "%" + searchTerm.toLowerCase() + "%";

            Predicate patientNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("patientName")), likePattern);
            Predicate contentPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("content")), likePattern);
            Predicate doctorNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("doctor").get("name")), likePattern);
            Predicate doctorRequestNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("doctorRequest").get("name")), likePattern);

            Predicate searchPredicate = criteriaBuilder.or(
                    patientNamePredicate,
                    contentPredicate,
                    doctorNamePredicate,
                    doctorRequestNamePredicate
            );

            Predicate statusPredicate = criteriaBuilder.notEqual(root.get("status"), 'D');

            return criteriaBuilder.and(searchPredicate, statusPredicate);
        };
    }

    public static Specification<Report> statusNot(StatusEnum status) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.notEqual(root.get("status"), status);
    }

}