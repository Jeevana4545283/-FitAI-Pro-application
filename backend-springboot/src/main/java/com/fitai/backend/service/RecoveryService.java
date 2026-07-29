package com.fitai.backend.service;

import com.fitai.backend.dto.recovery.*;

import java.util.List;

public interface RecoveryService {

    RecoveryScoreDto getRecoveryScore();

    List<RecoveryTimelineItemDto> getRecoveryTimeline();

    BodyStatusDto getBodyStatus();

    List<RecoveryAdviceDto> getRecoveryAdvice();

    List<MedicalReportDto> getMedicalReports();

    MedicalReportDto uploadMedicalReport(String name);

    void deleteMedicalReport(String id);
}
