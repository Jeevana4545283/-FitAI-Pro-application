package com.fitai.backend.service;

import com.fitai.backend.dto.analytics.AnalyticsSummaryDto;

public interface AnalyticsService {

    AnalyticsSummaryDto getAnalyticsSummary(String range);
}
