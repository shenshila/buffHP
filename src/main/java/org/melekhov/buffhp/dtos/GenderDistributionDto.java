package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenderDistributionDto {
    private String gender;
    private Long count;
}
