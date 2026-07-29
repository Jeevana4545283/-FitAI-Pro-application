package com.fitai.backend.service.impl;

import com.fitai.backend.dto.recovery.*;
import com.fitai.backend.exception.ResourceNotFoundException;
import com.fitai.backend.service.RecoveryService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RecoveryServiceImpl implements RecoveryService {

    private final List<MedicalReportDto> reports = new ArrayList<>();

    public RecoveryServiceImpl() {
        initReports();
    }

    private void initReports() {
        reports.add(MedicalReportDto.builder()
                .id("rep-1")
                .name("Blood Report PDF")
                .date("May 18, 2026")
                .summaryStatus("AI Summary Ready")
                .type("General Health")
                .build());
    }

    @Override
    public RecoveryScoreDto getRecoveryScore() {
        return RecoveryScoreDto.builder()
                .score(89)
                .status("Ready to Train")
                .description("Your body is recovered and primed for performance.")
                .sleep("7h 45m")
                .sleepStatus("Good")
                .sleepHistory(List.of(40, 70, 55, 85, 60, 75))
                .heartRate(62)
                .hrStatus("Resting")
                .hydration(2.4)
                .hydrationPct(80)
                .stressScore(42)
                .stressStatus("Moderate")
                .build();
    }

    @Override
    public List<RecoveryTimelineItemDto> getRecoveryTimeline() {
        return List.of(
                RecoveryTimelineItemDto.builder().day("Today").score(89).color("var(--green)").icon("check").build(),
                RecoveryTimelineItemDto.builder().day("Tomorrow").score(85).color("var(--blue)").icon("star").build(),
                RecoveryTimelineItemDto.builder().day("2 Days").score(70).color("var(--blue)").icon("star").build(),
                RecoveryTimelineItemDto.builder().day("Full Recovery").score(100).color("var(--purple)").icon("star").build()
        );
    }

    @Override
    public BodyStatusDto getBodyStatus() {
        return BodyStatusDto.builder()
                .chest("var(--green)")
                .shoulders("var(--green)")
                .back("var(--green)")
                .arms("var(--amber)")
                .quads("var(--red)")
                .hamstrings("var(--amber)")
                .build();
    }

    @Override
    public List<RecoveryAdviceDto> getRecoveryAdvice() {
        return List.of(
                RecoveryAdviceDto.builder().id("1").title("Light Stretching").duration("10 min").build(),
                RecoveryAdviceDto.builder().id("2").title("Foam Rolling").duration("8 min").build(),
                RecoveryAdviceDto.builder().id("3").title("Increase Protein").duration("120-150g").build(),
                RecoveryAdviceDto.builder().id("4").title("Sleep Early").duration("7-8 hrs").build()
        );
    }

    @Override
    public List<MedicalReportDto> getMedicalReports() {
        return reports;
    }

    @Override
    public MedicalReportDto uploadMedicalReport(String name) {
        String reportName = (name != null && !name.isBlank()) ? name : "Lab Report PDF";
        MedicalReportDto newReport = MedicalReportDto.builder()
                .id("rep-" + UUID.randomUUID().toString().substring(0, 8))
                .name(reportName)
                .date("Today")
                .summaryStatus("AI Summary Ready")
                .type("General Health")
                .build();

        reports.add(0, newReport);
        return newReport;
    }

    @Override
    public void deleteMedicalReport(String id) {
        boolean removed = reports.removeIf(r -> r.getId().equalsIgnoreCase(id));
        if (!removed) {
            throw new ResourceNotFoundException("Medical report not found with ID: " + id);
        }
    }
}
