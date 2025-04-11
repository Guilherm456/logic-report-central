package com.logic.report_central.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationDTO<T> {
    private List<T> items;
    private long totalItems;
    private int page;
    private int totalPages;
    private int size;
    private boolean hasNext;
    private boolean hasPrevious;

    public static <T> PaginationDTO<T> fromPage(Page<T> page) {
        return new PaginationDTO<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber(),
                page.getTotalPages(),
                page.getSize(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
}