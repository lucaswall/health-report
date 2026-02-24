// PDF section: report header / letterhead

import type { ProfileData, DateRange } from '../../types/report.js';
import { fmtDate } from '../helpers.js';

export function renderHeader(
  profile: ProfileData,
  dateRange: DateRange,
): string {
  return `
    <div class="report-header">
      <h1>Health Report</h1>
      <div class="subtitle">Comprehensive health and fitness analysis</div>
      <div class="patient-info">
        <div class="info-group">
          <div class="info-item">
            <span class="info-label">Patient:</span>
            <span>${escapeAttr(profile.name)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Age:</span>
            <span>${profile.age}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Gender:</span>
            <span>${escapeAttr(capitalize(profile.gender))}</span>
          </div>
        </div>
        <div class="info-group">
          <div class="info-item">
            <span class="info-label">Report Period:</span>
            <span>${fmtDate(dateRange.start)} &ndash; ${fmtDate(dateRange.end)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
