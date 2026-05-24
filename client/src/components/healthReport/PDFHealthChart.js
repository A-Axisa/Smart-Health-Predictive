import React, { useMemo, forwardRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const formatXAxisLabel = (label, index, total) => {
  if (!label) {
    return label;
  }

  // Thin out middle ticks for crowded datasets on smaller screens
  if (total > 4 && index > 0 && index < total - 1) {
    if (total > 6 && index % 2 === 1) {
      return "";
    }
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    const [, month, day] = label.split("-");
    return `${month}/${day}`;
  }

  const parts = label.split(" ");
  if (parts.length === 2 && parts[1].length === 4) {
    return parts[0];
  }

  return label;
};

/**
 * A Component that displays the trends in the user's health based on
 * their report history. Used for PDF download.
 *
 * @returns {@mui.material.Box}
 */
const PDFHealthChart = forwardRef(({ healthData }, ref) => {
  const theme = useTheme();

  // Helpers for aggregation and y-axis scaling
  const colors = [theme.palette.primary.main, "#ff7043", "#42a5f5"];

  const { xAxisData, chartSeries, yAxisMax } = useMemo(() => {
    if (!healthData || healthData.length === 0) {
      return { xAxisData: [], chartSeries: [], yAxisMax: 60 };
    }

    // Parse dates and sort ascending
    const parsed = healthData
      .map((d) => {
        const dt = d.date ? new Date(d.date) : null;
        return { ...d, _dateObj: dt };
      })
      .filter((d) => d._dateObj && !isNaN(d._dateObj.getTime()))
      .sort((a, b) => a._dateObj - b._dateObj);

    if (parsed.length === 0) {
      return { xAxisData: [], chartSeries: [], yAxisMax: 60 };
    }

    const minDate = parsed[0]._dateObj;
    const maxDate = parsed[parsed.length - 1]._dateObj;
    const crossYear = minDate.getFullYear() !== maxDate.getFullYear();
    const diffDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);

    const needAggregateMonthly =
      crossYear || diffDays > 180 || parsed.length > 20;

    let working = [];
    let xLabels = [];

    if (needAggregateMonthly) {
      // Group by year-month and compute averages
      const groups = new Map();
      for (const d of parsed) {
        const y = d._dateObj.getFullYear();
        const m = d._dateObj.getMonth(); // 0-11
        const key = `${y}-${m}`;
        if (!groups.has(key)) {
          groups.set(key, { y, m, items: [] });
        }
        groups.get(key).items.push(d);
      }

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const aggregated = Array.from(groups.values())
        .sort((a, b) => a.y - b.y || a.m - b.m)
        .map(({ y, m, items }) => {
          const n = items.length || 1;
          const avg = (arr, key) =>
            arr.reduce((sum, it) => sum + (Number(it[key]) || 0), 0) / n;
          return {
            label: `${monthNames[m]} ${y}`,
            strokeProbability: avg(items, "strokeProbability"),
            cardioProbability: avg(items, "cardioProbability"),
            diabetesProbability: avg(items, "diabetesProbability"),
          };
        });

      working = aggregated;
      xLabels = aggregated.map((a) => a.label);
    } else {
      // Use precise date points; format label as YYYY-MM-DD
      const formatDate = (dt) => {
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const d = String(dt.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };
      working = parsed;
      xLabels = parsed.map((d) => formatDate(d._dateObj));
    }

    // Build series based on selection
    const series = [
    {
      data: working.map((w) => Number(w.strokeProbability) || 0),
      label: "Stroke Probability (%)",
      color: colors[0],
    },
    {
      data: working.map((w) => Number(w.cardioProbability) || 0),
      label: "Cardio Probability (%)",
      color: colors[1],
    },
    {
      data: working.map((w) => Number(w.diabetesProbability) || 0),
      label: "Diabetes Probability (%)",
      color: colors[2],
    }
  ];

    // Dynamic y-axis max with padding, capped at 100
    let maxVal = 0;
    for (const s of series) {
      for (const v of s.data) maxVal = Math.max(maxVal, Number(v) || 0);
    }
    const padded = Math.min(100, Math.max(0, maxVal + 5));
    const yMax = Math.max(10, Math.min(100, Math.ceil(padded / 10) * 10));

    return { xAxisData: xLabels, chartSeries: series, yAxisMax: yMax };
  }, [healthData, colors]);

  const xAxisValueFormatter = useMemo(() => {
    if (!xAxisData || xAxisData.length === 0) {
      return undefined;
    }

    return (value) => {
      const index = xAxisData.indexOf(value);
      if (index === -1) {
        return value;
      }
      return formatXAxisLabel(value, index, xAxisData.length);
    };
  }, [xAxisData]);

  return (
    <Box
      ref={ref}
      sx={{
        width: 1200,
      }}
    >
      <Card sx={{ borderRadius: 2, bgcolor: "#ffffff", overflow: "hidden" }}>
        <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
            <Box
              sx={{
                width: "100%",
                height: 420,
                overflow: "visible",
              }}
            >
              <LineChart
                series={chartSeries}
                xAxis={[
                  {
                    data: xAxisData,
                    scaleType: "point",
                    valueFormatter: xAxisValueFormatter,
                    tickLabelStyle: {
                      angle: 0,
                      textAnchor: "middle",
                      fontSize: 11,
                      fill: "#666",
                    },
                  },
                ]}
                yAxis={[
                  {
                    label: "Probability (%)",
                    min: 0,
                    max: yAxisMax,
                    tickLabelStyle: {
                      fontSize: 12,
                      fill: "#666",
                    },
                  },
                ]}
                margin={
                    { left: 70, right: 30, top: 40, bottom: 70 }
                }
                grid={{ vertical: true, horizontal: true }}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "top", horizontal: "middle" },
                    padding: 0,
                    itemMarkWidth: 20,
                    itemMarkHeight: 2,
                    markGap: 5,
                    itemGap: 10,
                    labelStyle: {
                      fontSize: 12,
                      fill: "#333",
                    },
                  },
                }}
              />
            </Box>
        </CardContent>
      </Card>
    </Box>
  );
});

export default PDFHealthChart;