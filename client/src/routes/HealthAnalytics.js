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
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { LineChart } from '@mui/x-charts/LineChart';

const formatXAxisLabel = (label, index, total, isMobile) => {
  if (!label) {
    return label;
  }

  if (!isMobile) {
    return label;
  }

  // Thin out middle ticks for crowded datasets on smaller screens
  if (total > 4 && index > 0 && index < total - 1) {
    if (total > 6 && index % 2 === 1) {
      return '';
    }
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    const [, month, day] = label.split('-');
    return `${month}/${day}`;
  }

  const parts = label.split(' ');
  if (parts.length === 2 && parts[1].length === 4) {
    return parts[0];
  }

  return label;
};

const HealthAnalytics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // data state
  const [healthData, setHealthData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState({
    strokeProbability: true,
    cardioProbability: true,
    diabetesProbability: true
  });
  const [showSettings, setShowSettings] = useState(!isMobile);

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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update showSettings when switching between mobile and desktop
  useEffect(() => {
    setShowSettings(!isMobile);
  }, [isMobile]);

  // handle selection change
  const handleMetricChange = (metric) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  // Helpers for aggregation and y-axis scaling
  const colors = [theme.palette.primary.main, '#ff7043', '#42a5f5'];

  const cardWrapperSx = useMemo(() => ({
    mb: 3,
    borderRadius: 2,
    boxShadow: isMobile ? 3 : 24,
    bgcolor: '#ffffff',
    overflow: 'hidden',
  }), [isMobile]);

  const cardContentSx = useMemo(() => ({
    p: isMobile ? 2 : 3,
  }), [isMobile]);

  const chartCardContentSx = useMemo(() => ({
    p: isMobile ? 1 : 3,
    pt: isMobile ? 2 : 3,
    '&:last-child': {
      pb: isMobile ? 1.5 : 3,
    }
  }), [isMobile]);

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

  const xAxisValueFormatter = useMemo(() => {
    if (!xAxisData || xAxisData.length === 0) {
      return undefined;
    }

    return (value) => {
      const index = xAxisData.indexOf(value);
      if (index === -1) {
        return value;
      }
      return formatXAxisLabel(value, index, xAxisData.length, isMobile);
    };
  }, [xAxisData, isMobile]);

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 3 : 4, px: isMobile ? 2 : 3 }}>
      <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
        Health Analytics
      </Typography>

      <Card sx={cardWrapperSx}>
        <CardContent sx={cardContentSx}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: showSettings ? 2 : 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Probability Metrics Selection
            </Typography>
            {isMobile && (
              <IconButton 
                onClick={() => setShowSettings(!showSettings)}
                size="small"
                sx={{ ml: 1 }}
              >
                {showSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>
          
          <Collapse in={showSettings}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormGroup row={!isMobile}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMetrics.strokeProbability}
                    onChange={() => handleMetricChange('strokeProbability')}
                    sx={{ 
                      color: colors[0],
                      '&.Mui-checked': { color: colors[0] }
                    }}
                  />
                }
                label="Stroke Probability"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMetrics.cardioProbability}
                    onChange={() => handleMetricChange('cardioProbability')}
                    sx={{ 
                      color: colors[1],
                      '&.Mui-checked': { color: colors[1] }
                    }}
                  />
                }
                label="Cardio Probability"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMetrics.diabetesProbability}
                    onChange={() => handleMetricChange('diabetesProbability')}
                    sx={{ 
                      color: colors[2],
                      '&.Mui-checked': { color: colors[2] }
                    }}
                  />
                }
                label="Diabetes Probability"
              />
            </FormGroup>
          </FormControl>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={fetchData}
              sx={{ 
                py: { xs: '0.8rem', sm: '0.6rem' }, 
                fontSize: { xs: '1rem', sm: '0.875rem' },
                fontWeight: 500,
              }}
            >
              Refresh Data
            </Button>
          </Box>
          </Collapse>
        </CardContent>
      </Card>

      <Card sx={cardWrapperSx}>
        <CardContent sx={chartCardContentSx}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Health Risk Trends Over Time
          </Typography>
          {chartSeries.length > 0 && healthData.length > 0 ? (
            <Box sx={{ 
              width: '100%', 
              height: isMobile ? 350 : 420,
              overflow: 'visible',
            }}>
              <LineChart
                series={chartSeries}
                xAxis={[{ 
                  data: xAxisData,
                  scaleType: 'point',
                  valueFormatter: xAxisValueFormatter,
                  tickLabelStyle: {
                    angle: 0,
                    textAnchor: 'middle',
                    fontSize: isMobile ? 9 : 11,
                    fill: '#666',
                  }
                }]}
                yAxis={[{
                  label: isMobile ? '' : 'Probability (%)',
                  min: 0,
                  max: yAxisMax,
                  tickLabelStyle: {
                    fontSize: isMobile ? 10 : 12,
                    fill: '#666',
                  }
                }]}
                margin={isMobile ? { left: 3, right: 30, top: 55, bottom: 50 } : { left: 70, right: 30, top: 40, bottom: 70 }}
                grid={{ vertical: true, horizontal: true }}
                slotProps={{
                  legend: {
                    direction: isMobile ? 'column' : 'row',
                    position: { vertical: 'top', horizontal: 'middle' },
                    padding: 0,
                    itemMarkWidth: isMobile ? 12 : 20,
                    itemMarkHeight: 2,
                    markGap: isMobile ? 4 : 5,
                    itemGap: isMobile ? 6 : 10,
                    labelStyle: {
                      fontSize: isMobile ? 9 : 12,
                      fill: '#333',
                    }
                  }
                }}
              />
            </Box>
          ) : (
            <Box 
              sx={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography>Select at least one metric to display the chart</Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: isMobile ? 'stretch' : 'flex-end',
              alignItems: isMobile ? 'stretch' : 'center',
              mt: 3,
              gap: isMobile ? 1.5 : 1,
            }}
          >
            <Button
              variant="outlined"
              href="/ai-health-prediction"
              sx={{ 
                width: isMobile ? '100%' : 'auto',
                py: { xs: '0.8rem', sm: '0.6rem' }, 
                fontSize: { xs: '1rem', sm: '0.875rem' },
                fontWeight: 500,
              }}
            >
              Detail Reports
            </Button>
            <Button
              variant="contained"
              href="/generate-report"
              sx={{ 
                width: isMobile ? '100%' : 'auto',
                py: { xs: '0.8rem', sm: '0.6rem' }, 
                fontSize: { xs: '1rem', sm: '0.875rem' },
                fontWeight: 500,
              }}
            >
              Add New
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HealthAnalytics;
