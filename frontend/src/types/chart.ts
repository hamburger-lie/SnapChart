/**
 * 图表数据类型定义
 * 与后端 API 契约严格对齐，确保前后端类型一致
 */

/** 单个数据系列 */
export interface DatasetItem {
  name: string;
  values: number[];
}

/** 图表核心数据结构（后端返回） */
export interface ChartData {
  chartType: "bar" | "line" | "pie";
  title: string;
  labels: string[];
  datasets: DatasetItem[];
}

/** 上传成功的响应 */
export interface ChartResponse {
  status: "success";
  data: ChartData;
}

/** 上传失败的响应 */
export interface ErrorResponse {
  status: "error";
  message: string;
  detail?: string;
}

/** 页面状态 */
export type AppStatus = "idle" | "uploading" | "success" | "error";

/** 前端支持的所有图表类型 */
export type DisplayChartType = "bar" | "line" | "stackedArea" | "pie" | "scatter";

/** 色彩主题标识 */
export type ColorThemeId = "business" | "vibrant" | "morandi" | "ocean";

/** 色彩主题配置 */
export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  colors: string[];
}

/** 样式创建请求 */
export interface StyleCreate {
  name: string;
  chart_type: string;
  echarts_option: Record<string, unknown>;
  data_snapshot?: Record<string, unknown> | null;
  thumbnail?: string | null;
}

/** 样式完整响应 */
export interface StyleResponse {
  id: string;
  name: string;
  chart_type: string;
  echarts_option: Record<string, unknown>;
  data_snapshot?: Record<string, unknown> | null;
  thumbnail?: string | null;
  created_at: string;
  updated_at: string;
}

/** 样式列表项 */
export interface StyleListItem {
  id: string;
  name: string;
  chart_type: string;
  thumbnail?: string | null;
  updated_at: string;
}
