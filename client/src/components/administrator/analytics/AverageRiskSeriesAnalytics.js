import {
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
const DEFAULT_YEAR = 2026;

/**
 * A page used to display registration information and provide a form to allow
 * users to register.
 */
const AverageRiskSeriesAnalytics = () => {
  const [data, setData] = useState({});
  const [availableYears, setAvailableYears] = useState({});
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [xAxisData, setXAxisData] = useState([]);
  const [strokeData, setStrokeData] = useState([]);
  const [diabetesData, setDiabetesData] = useState([]);
  const [cvdData, setCVDData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/admin-dashboard/ave-risk-series/${year}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setXAxisData(data.map((d) => new Date(d.date)));
        setStrokeData(data.map((d) => d.stroke));
        setDiabetesData(data.map((d) => d.diabetes));
        setCVDData(data.map((d) => d.cvd));
        setData(data);
      });
  }, [year]);

  function extractXAxisData(rawData) {
    return rawData.map((d) => new Date(d.date));
  }

  return (
    <Card sx={{ p: "5px" }}>
      <CardContent>
        <Grid container rowSpacing={1}>
          <Grid size={1} />
          <Grid alignContent="center" size={10}>
            <Typography variant="h6" textAlign="center">
              Average Disease Risk (%)
            </Typography>
          </Grid>
          <Grid size={1}>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              <MenuItem value={2026}>2026</MenuItem>
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <LineChart
              sx={{
                "& .MuiChartsAxis-tickLabel": { fontSize: "15px !important" },
              }}
              xAxis={[
                {
                  id: "date",
                  data: xAxisData,
                  scaleType: "point",
                  valueFormatter: (date) => dayjs(date).format("YYYY-MM"),
                  label: "Month",
                  height: 60,
                  tickLabelStyle: {
                    angle: -20, // Rotation angle
                    textAnchor: "end",
                  },
                },
              ]}
              yAxis={[
                {
                  label: "Risk(%)",
                },
              ]}
              series={[
                {
                  data: strokeData,
                  label: "Stroke",
                },
                {
                  data: diabetesData,
                  label: "Diabetes",
                },
                {
                  data: cvdData,
                  label: "CVD",
                },
              ]}
              height={400}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AverageRiskSeriesAnalytics;
