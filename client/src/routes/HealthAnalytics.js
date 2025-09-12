import React, { useState, useEffect } from 'react';
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

  // demo data - replace with API call in real usage
  const generateMockData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((month, index) => ({
      month,
      strokeProbability: Math.random() * 30 + 10,
      cardioProbability: Math.random() * 25 + 15,
      diabetesProbability: Math.random() * 20 + 20
    }));
    setHealthData(data);
  };

  useEffect(() => {
    generateMockData();
  }, []);

  // handle selection change
  const handleMetricChange = (metric) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  // prepare chart data
  const chartSeries = [];
  const colors = [theme.palette.primary.main, '#ff7043', '#42a5f5'];
  
  if (selectedMetrics.strokeProbability) {
    chartSeries.push({
      data: healthData.map(item => item.strokeProbability),
      label: 'Stroke Probability (%)',
      color: colors[0]
    });
  }
  
  if (selectedMetrics.cardioProbability) {
    chartSeries.push({
      data: healthData.map(item => item.cardioProbability),
      label: 'Cardio Probability (%)',
      color: colors[1]
    });
  }
  
  if (selectedMetrics.diabetesProbability) {
    chartSeries.push({
      data: healthData.map(item => item.diabetesProbability),
      label: 'Diabetes Probability (%)',
      color: colors[2]
    });
  }

  const xAxisData = healthData.map(item => item.month);

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
              onClick={generateMockData}
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
                  max: 60
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
