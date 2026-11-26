import type { REPORT_REASONS } from '../_consts/report';

export type ReportReasonT = (typeof REPORT_REASONS)[number]['value'];

export type PostUserReportRequestT = {
  reason: ReportReasonT;
  /** 기타(OTHER)일 때만 보냄. 생략 가능 */
  detail?: string;
};

export type PostUserReportResponseT = null;
