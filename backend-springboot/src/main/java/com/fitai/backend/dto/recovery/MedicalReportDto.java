package com.fitai.backend.dto.recovery;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Medical Health Report Data Transfer Object")
public class MedicalReportDto {

    @Schema(description = "Medical report ID", example = "rep-1")
    private String id;

    @Schema(description = "Medical report title/filename", example = "Blood Report PDF")
    private String name;

    @Schema(description = "Upload date string", example = "May 18, 2026")
    private String date;

    @Schema(description = "AI analysis status badge", example = "AI Summary Ready")
    private String summaryStatus;

    @Schema(description = "Report category type", example = "General Health")
    private String type;

    public MedicalReportDto() {
    }

    public MedicalReportDto(String id, String name, String date, String summaryStatus, String type) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.summaryStatus = summaryStatus;
        this.type = type;
    }

    public static MedicalReportDtoBuilder builder() {
        return new MedicalReportDtoBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getSummaryStatus() { return summaryStatus; }
    public void setSummaryStatus(String summaryStatus) { this.summaryStatus = summaryStatus; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public static class MedicalReportDtoBuilder {
        private String id;
        private String name;
        private String date;
        private String summaryStatus;
        private String type;

        public MedicalReportDtoBuilder id(String id) { this.id = id; return this; }
        public MedicalReportDtoBuilder name(String name) { this.name = name; return this; }
        public MedicalReportDtoBuilder date(String date) { this.date = date; return this; }
        public MedicalReportDtoBuilder summaryStatus(String summaryStatus) { this.summaryStatus = summaryStatus; return this; }
        public MedicalReportDtoBuilder type(String type) { this.type = type; return this; }

        public MedicalReportDto build() {
            return new MedicalReportDto(id, name, date, summaryStatus, type);
        }
    }
}
