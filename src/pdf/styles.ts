// PDF report CSS styles

export function getStyles(): string {
  return `
    @page {
      size: A4;
      margin: 18mm 15mm 18mm 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 210mm;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10px;
      line-height: 1.5;
      color: #2d3748;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* --- Header / Letterhead --- */
    .report-header {
      border-bottom: 3px solid #1e3a5f;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .report-header h1 {
      font-size: 26px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }

    .report-header .subtitle {
      font-size: 11px;
      color: #718096;
    }

    .patient-info {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 10px;
      color: #4a5568;
    }

    .patient-info .info-group {
      display: flex;
      gap: 20px;
    }

    .patient-info .info-item {
      display: flex;
      gap: 4px;
    }

    .patient-info .info-label {
      font-weight: 600;
      color: #1e3a5f;
    }

    /* --- Section cards --- */
    .section-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      padding: 16px 18px;
      margin-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .section-card h2 {
      font-size: 16px;
      font-weight: 700;
      color: #1e3a5f;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 12px;
    }

    .section-card h3 {
      font-size: 12px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 8px;
      margin-top: 10px;
    }

    /* --- Stat cards grid --- */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .stat-grid.cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .stat-grid.cols-5 {
      grid-template-columns: repeat(5, 1fr);
    }

    .stat-card {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 10px 12px;
      text-align: center;
    }

    .stat-card .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #1e3a5f;
      line-height: 1.2;
    }

    .stat-card .stat-unit {
      font-size: 10px;
      font-weight: 400;
      color: #718096;
      margin-left: 2px;
    }

    .stat-card .stat-label {
      font-size: 9px;
      color: #718096;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* --- Trend badges --- */
    .trend-badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      letter-spacing: 0.2px;
      vertical-align: middle;
    }

    .trend-badge.improving {
      background: #c6f6d5;
      color: #22543d;
    }

    .trend-badge.declining {
      background: #fed7d7;
      color: #742a2a;
    }

    .trend-badge.stable {
      background: #e2e8f0;
      color: #4a5568;
    }

    /* --- Tables --- */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
      margin-bottom: 12px;
    }

    thead th {
      background: #1e3a5f;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 6px 8px;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    thead th:first-child {
      border-radius: 4px 0 0 0;
    }

    thead th:last-child {
      border-radius: 0 4px 0 0;
    }

    tbody td {
      padding: 5px 8px;
      border-bottom: 1px solid #e2e8f0;
    }

    tbody tr:nth-child(even) {
      background: #f7fafc;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:last-child td:first-child {
      border-radius: 0 0 0 4px;
    }

    tbody tr:last-child td:last-child {
      border-radius: 0 0 4px 0;
    }

    td.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    /* --- Two-column layout: recent vs historical --- */
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .two-col .col {
      min-width: 0;
    }

    .col-label {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #718096;
      margin-bottom: 6px;
    }

    /* --- Chart images --- */
    .chart-container {
      margin: 10px 0;
      text-align: center;
    }

    .chart-container img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    /* --- Summary metric cards (larger) --- */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .summary-card {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
    }

    .summary-card .metric-value {
      font-size: 22px;
      font-weight: 700;
      color: #1e3a5f;
      line-height: 1.2;
    }

    .summary-card .metric-unit {
      font-size: 10px;
      color: #718096;
    }

    .summary-card .metric-label {
      font-size: 9px;
      color: #718096;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .summary-card .metric-trend {
      margin-top: 4px;
    }

    /* --- Unavailable section --- */
    .data-unavailable {
      text-align: center;
      padding: 24px;
      color: #a0aec0;
      font-size: 11px;
      font-style: italic;
    }

    /* --- Page break hint --- */
    .page-break {
      page-break-before: always;
      break-before: page;
    }

    /* --- Print rules --- */
    @media print {
      body {
        background: #ffffff;
      }

      .section-card {
        box-shadow: none;
        border: 1px solid #cbd5e0;
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .stat-card {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .trend-badge {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      thead th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      tbody tr:nth-child(even) {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .chart-container img {
        max-width: 100%;
        height: auto;
      }
    }
  `;
}
