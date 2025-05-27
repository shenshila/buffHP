package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseCountByDateDto {
    private String diagnosis;
    private LocalDate date;
    private Long count;
}
