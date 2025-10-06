import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  useTheme
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

const HealthAnalytics = () => {
  const theme = useTheme();
  
  // data state
  const [healthData, setHealthData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState({
    strokeProbability: true,
    cardioProbability: true,
    diabetesProbability: true
  });

  // fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/health-analytics`, {
        // Include credentials to send cookies if any for authentication
        credentials: 'include', 
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      //console.log("Fetched data:", data); // Log fetched data
      setHealthData(data);
    } catch (error) {
      console.error("Failed to fetch health analytics data:", error);
      // Keep existing data or set to empty array on error? For now, just log.
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handle selection change
  const handleMetricChange = (metric) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  // Helpers for aggregation and y-axis scaling
  const colors = [theme.palette.primary.main, '#ff7043', '#42a5f5'];

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

    const needAggregateMonthly = crossYear || diffDays > 180 || parsed.length > 20;

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

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const aggregated = Array.from(groups.values())
        .sort((a, b) => a.y - b.y || a.m - b.m)
        .map(({ y, m, items }) => {
          const n = items.length || 1;
          const avg = (arr, key) => arr.reduce((sum, it) => sum + (Number(it[key]) || 0), 0) / n;
          return {
            label: `${monthNames[m]} ${y}`,
            strokeProbability: avg(items, 'strokeProbability'),
            cardioProbability: avg(items, 'cardioProbability'),
            diabetesProbability: avg(items, 'diabetesProbability'),
          };
        });

      working = aggregated;
      xLabels = aggregated.map((a) => a.label);
    } else {
      // Use precise date points; format label as YYYY-MM-DD
      const formatDate = (dt) => {
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };
      working = parsed;
      xLabels = parsed.map((d) => formatDate(d._dateObj));
    }

    // Build series based on selection
    const series = [];
    if (selectedMetrics.strokeProbability) {
      series.push({
        data: working.map((w) => Number(w.strokeProbability) || 0),
        label: 'Stroke Probability (%)',
        color: colors[0],
      });
    }
    if (selectedMetrics.cardioProbability) {
      series.push({
        data: working.map((w) => Number(w.cardioProbability) || 0),
        label: 'Cardio Probability (%)',
        color: colors[1],
      });
    }
    if (selectedMetrics.diabetesProbability) {
      series.push({
        data: working.map((w) => Number(w.diabetesProbability) || 0),
        label: 'Diabetes Probability (%)',
        color: colors[2],
      });
    }

    // Dynamic y-axis max with padding, capped at 100
    let maxVal = 0;
    for (const s of series) {
      for (const v of s.data) maxVal = Math.max(maxVal, Number(v) || 0);
    }
    const padded = Math.min(100, Math.max(0, maxVal + 5));
    const yMax = Math.max(10, Math.min(100, Math.ceil(padded / 10) * 10));

    return { xAxisData: xLabels, chartSeries: series, yAxisMax: yMax };
  }, [healthData, selectedMetrics, colors]);

  console.log("healthData state:", healthData);
  console.log("chartSeries to render:", chartSeries);
  console.log("xAxisData to render:", xAxisData);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Health Analytics
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Probability Metrics Selection
          </Typography>
          <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMetrics.strokeProbability}
                    onChange={() => handleMetricChange('strokeProbability')}
                    sx={{ color: colors[0] }}
                  />
                }
                label="Stroke Probability"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMetrics.cardioProbability}
                    onChange={() => handleMetricChange('cardioProbability')}
                    sx={{ color: colors[1] }}
                  />
                }
                label="Cardio Probability"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMetrics.diabetesProbability}
                    onChange={() => handleMetricChange('diabetesProbability')}
                    sx={{ color: colors[2] }}
                  />
                }
                label="Diabetes Probability"
              />
            </FormGroup>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={fetchData}
              size="small"
            >
              Refresh Data
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Health Risk Trends Over Time
          </Typography>
          {chartSeries.length > 0 && healthData.length > 0 ? (
            <Box sx={{ width: '100%', height: 400 }}>
              <LineChart
                series={chartSeries}
                xAxis={[{ 
                  data: xAxisData,
                  scaleType: 'point'
                }]}
                yAxis={[{
                  label: 'Probability (%)',
                  min: 0,
                  max: yAxisMax
                }]}
                margin={{ left: 70, right: 30, top: 30, bottom: 70 }}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          ) : (
            <Box 
              sx={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'text.secondary'
              }}
            >
              <Typography>Select at least one metric to display the chart</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button variant="outlined" size="small" href="/ai-health-prediction">
              Detail Reports
            </Button>
            <Button variant="contained" size="small" href="/generate-report">
              Add New
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HealthAnalytics;
