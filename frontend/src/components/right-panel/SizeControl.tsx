/**
 * 布局与坐标轴控制面板
 * 图表高度 + 图例 + 内边距 + X轴标签 + Y轴格式化 + 对数轴
 */

import { useEditorStore } from "../../store";
import { getBaseChartType } from "../../constants/chartTemplates";

/** 预设高度选项 */
const HEIGHT_PRESETS = [
  { label: "S", value: 320 },
  { label: "M", value: 480 },
  { label: "L", value: 640 },
  { label: "XL", value: 800 },
];

export default function SizeControl() {
  const chartHeight = useEditorStore((s) => s.chartHeight);
  const setChartSize = useEditorStore((s) => s.setChartSize);
  const gridPadding = useEditorStore((s) => s.gridPadding);
  const setGridPadding = useEditorStore((s) => s.setGridPadding);
  const legend = useEditorStore((s) => s.legend);
  const setLegend = useEditorStore((s) => s.setLegend);
  const xAxisConfig = useEditorStore((s) => s.xAxisConfig);
  const setXAxisConfig = useEditorStore((s) => s.setXAxisConfig);
  const yAxisConfig = useEditorStore((s) => s.yAxisConfig);
  const setYAxisConfig = useEditorStore((s) => s.setYAxisConfig);
  const chartType = useEditorStore((s) => s.chartType);

  const isPie = getBaseChartType(chartType) === "pie";

  return (
    <div className="space-y-5">
      {/* ===== 图表高度 ===== */}
      <Section title={`图表高度：${chartHeight}px`}>
        <div className="flex gap-1.5 mb-2">
          {HEIGHT_PRESETS.map(({ label, value }) => (
            <ToggleButton
              key={value}
              active={chartHeight === value}
              onClick={() => setChartSize(0, value)}
            >
              {label}
            </ToggleButton>
          ))}
        </div>
        <input
          type="range" min={240} max={1000} step={10} value={chartHeight}
          onChange={(e) => setChartSize(0, Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </Section>

      {/* ===== X 轴标签控制 ===== */}
      {!isPie && (
        <Section title="X 轴标签">
          {/* 标签截断长度 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-gray-400 w-16 shrink-0">截断字数</span>
            <input
              type="range" min={4} max={20} value={xAxisConfig.labelMaxLength}
              onChange={(e) => setXAxisConfig({ labelMaxLength: Number(e.target.value) })}
              className="flex-1 accent-blue-600"
            />
            <span className="text-xs text-gray-500 w-6 text-right">{xAxisConfig.labelMaxLength}</span>
          </div>

          {/* 自动旋转 vs 手动旋转 */}
          <div className="flex items-center gap-2 mb-2">
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox" checked={xAxisConfig.autoRotate}
                onChange={(e) => setXAxisConfig({ autoRotate: e.target.checked })}
                className="accent-blue-600"
              />
              自动旋转
            </label>
          </div>

          {!xAxisConfig.autoRotate && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-16 shrink-0">旋转角度</span>
              <input
                type="range" min={0} max={90} step={5} value={xAxisConfig.labelRotate}
                onChange={(e) => setXAxisConfig({ labelRotate: Number(e.target.value) })}
                className="flex-1 accent-blue-600"
              />
              <span className="text-xs text-gray-500 w-8 text-right">{xAxisConfig.labelRotate}°</span>
            </div>
          )}
        </Section>
      )}

      {/* ===== Y 轴格式化 ===== */}
      {!isPie && (
        <Section title="Y 轴数值">
          {/* 格式化模式 */}
          <div className="flex gap-1.5 mb-3">
            {([
              { id: "smart" as const,   label: "智能" },
              { id: "raw" as const,     label: "原始" },
              { id: "percent" as const, label: "百分比" },
            ]).map(({ id, label }) => (
              <ToggleButton
                key={id}
                active={yAxisConfig.numberFormat === id}
                onClick={() => setYAxisConfig({ numberFormat: id })}
              >
                {label}
              </ToggleButton>
            ))}
          </div>

          <p className="text-[10px] text-gray-400 mb-3">
            {yAxisConfig.numberFormat === "smart" && "自动使用 万/亿 等单位，告别长串零"}
            {yAxisConfig.numberFormat === "raw" && "显示原始数值，不做任何转换"}
            {yAxisConfig.numberFormat === "percent" && "所有数值后追加 % 符号"}
          </p>

          {/* 对数轴开关 */}
          <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={yAxisConfig.useLogScale}
                onChange={(e) => setYAxisConfig({ useLogScale: e.target.checked })}
                className="accent-amber-600"
              />
              <div>
                <span className="text-xs font-medium text-amber-800">对数轴 (Log Scale)</span>
                <p className="text-[10px] text-amber-600 mt-0.5">
                  数据差距极大时启用，让小值也清晰可见
                </p>
              </div>
            </label>
          </div>
        </Section>
      )}

      {/* ===== 图例 ===== */}
      <Section title="图例">
        <div className="flex items-center gap-3 mb-2">
          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox" checked={legend.show}
              onChange={(e) => setLegend({ show: e.target.checked })}
              className="accent-blue-600"
            />
            显示图例
          </label>
        </div>
        {legend.show && (
          <div className="flex gap-1.5">
            {(["top", "bottom", "left", "right"] as const).map((pos) => (
              <ToggleButton
                key={pos}
                active={legend.position === pos}
                onClick={() => setLegend({ position: pos })}
              >
                {{ top: "上", bottom: "下", left: "左", right: "右" }[pos]}
              </ToggleButton>
            ))}
          </div>
        )}
      </Section>

      {/* ===== 内边距 ===== */}
      <Section title="内边距 (px)">
        <div className="grid grid-cols-2 gap-2">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <div key={side} className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 w-6">
                {{ top: "上", right: "右", bottom: "下", left: "左" }[side]}
              </span>
              <input
                type="number" value={gridPadding[side]}
                onChange={(e) => setGridPadding({ [side]: Number(e.target.value) })}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded outline-none focus:border-blue-400 w-0"
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ========== 内部通用小组件 ==========

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">{title}</label>
      {children}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
        active
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
