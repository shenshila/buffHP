package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosisDistributionDto {
    private String diagnosis;
    private Long count;
}
