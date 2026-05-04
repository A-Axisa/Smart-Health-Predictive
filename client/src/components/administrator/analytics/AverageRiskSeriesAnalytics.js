import {
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
  Select,
  MenuItem,
  Grid,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
const DEFAULT_YEAR = 2026;

/**
 * Displays the average progression for stroke, diabetes, and cardiovascular
 * disease of the years.
 */
const AverageRiskSeriesAnalytics = () => {
  const [availableYears, setAvailableYears] = useState([]);
  const [year, setYear] = useState("");
  const [xAxisData, setXAxisData] = useState([]);
  const [strokeData, setStrokeData] = useState([]);
  const [diabetesData, setDiabetesData] = useState([]);
  const [cvdData, setCVDData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/admin-dashboard/predictions-distinct-years`, {
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
        setAvailableYears(data);
        setYear(data[0].year);
      });
  }, []);

  useEffect(() => {
    if (!year) {
      return;
    }

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
            <FormControl>
              <InputLabel id="year-label-id">Year</InputLabel>
              <Select
                labelId="year-label-id"
                value={year}
                label="Year"
                defaultValue={0}
                onChange={(e) => setYear(e.target.value)}
              >
                {availableYears.map((item) => (
                  <MenuItem key={item.year} value={item.year}>
                    {item.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                    angle: -20,
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
