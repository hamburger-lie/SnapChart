/**
 * 左侧图表画廊
 * 提供图表类型缩略图选择 + 已保存的自定义样式列表
 */

import { useEffect } from "react";
import {
  BarChart3,
  LineChart,
  PieChart,
  Layers,
  CircleDot,
  Trash2,
} from "lucide-react";
import { useEditorStore } from "../../store";
import type { DisplayChartType } from "../../types/chart";

/** 图表类型配置 */
const CHART_TYPES: {
  type: DisplayChartType;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  { type: "bar",         label: "柱状图",     icon: <BarChart3 className="w-5 h-5" />,  desc: "分类对比" },
  { type: "line",        label: "折线图",     icon: <LineChart className="w-5 h-5" />,   desc: "趋势变化" },
  { type: "stackedArea", label: "面积堆叠图", icon: <Layers className="w-5 h-5" />,      desc: "占比趋势" },
  { type: "pie",         label: "饼图",       icon: <PieChart className="w-5 h-5" />,    desc: "占比分布" },
  { type: "scatter",     label: "散点图",     icon: <CircleDot className="w-5 h-5" />,   desc: "数据分布" },
];

export default function ChartGallery() {
  const chartType = useEditorStore((s) => s.chartType);
  const setChartType = useEditorStore((s) => s.setChartType);
  const savedStyles = useEditorStore((s) => s.savedStyles);
  const fetchStyles = useEditorStore((s) => s.fetchStyles);
  const loadStyle = useEditorStore((s) => s.loadStyle);
  const deleteStyle = useEditorStore((s) => s.deleteStyle);
  const setTitle = useEditorStore((s) => s.setTitle);
  const setColors = useEditorStore((s) => s.setColors);

  // 组件挂载时加载样式列表
  useEffect(() => {
    fetchStyles();
  }, [fetchStyles]);

  /** 加载并应用保存的样式 */
  const handleLoadStyle = async (id: string) => {
    const style = await loadStyle(id);
    if (!style) return;
    setChartType(style.chart_type as DisplayChartType);
    const opt = style.echarts_option;
    if (opt.title && typeof opt.title === "object" && "text" in opt.title) {
      setTitle(opt.title.text as string);
    }
    if (Array.isArray(opt.color)) {
      setColors(opt.color as string[]);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* 图表类型选择 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
          图表类型
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {CHART_TYPES.map(({ type, label, icon, desc }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                chartType === type
                  ? "bg-blue-50 text-blue-700 border-2 border-blue-300 shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className={chartType === type ? "text-blue-500" : "text-gray-400"}>
                {icon}
              </span>
              <span>{label}</span>
              <span className={`text-[10px] ${chartType === type ? "text-blue-400" : "text-gray-400"}`}>
                {desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 已保存的样式 */}
      {savedStyles.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            已保存样式
          </h3>
          <div className="space-y-1.5">
            {savedStyles.map((style) => (
              <div
                key={style.id}
                className="group flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer"
                onClick={() => handleLoadStyle(style.id)}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {style.name}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase">
                    {style.chart_type}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStyle(style.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
