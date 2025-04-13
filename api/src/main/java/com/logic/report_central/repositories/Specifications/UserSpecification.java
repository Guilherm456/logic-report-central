package com.logic.report_central.repositories.Specifications;

import com.logic.report_central.entities.Doctor;
import com.logic.report_central.entities.User;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

    public static Specification<User> searchByUsernameOrEmail(String search) {
        return (root, query, criteriaBuilder) -> {
            if (search == null || search.isEmpty()) return null;

            String likeSearch = "%" + search.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), likeSearch),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), likeSearch)
            );
        };
    }

    public static Specification<User> isDoctorLinked(Boolean doctorLinked) {
        return (root, query, criteriaBuilder) -> {
            if (doctorLinked == null) return null;

            if (doctorLinked) {
                if (query == null) return null;

                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Doctor> doctorRoot = subquery.from(Doctor.class);
                subquery.select(doctorRoot.get("id"))
                        .where(criteriaBuilder.equal(doctorRoot.get("user"), root),
                                criteriaBuilder.notEqual(doctorRoot.get("status"), "D"));
                return criteriaBuilder.exists(subquery);
            } else {
                return criteriaBuilder.isEmpty(root.get("doctors"));
            }
        };
    }
}