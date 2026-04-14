import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart } from "@mui/x-charts/BarChart";

/**
 * A page used to display a individual patient information for a merchant user.
 */
const PatientDetails = () => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({});

  const { patientID } = useParams();

  useEffect(() => {
    fetch(`${API_BASE}/patient-details/${patientID}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          navigate("/*");
        }
        return response.json();
      })
      .then((data) => {
        setPatientData(data);
      });
  }, []);

  const chartData = (patientData?.risks?.dates ?? [])
    .map((date, i) => ({
      date,
      stroke: patientData?.risks?.stroke?.[i] ?? 0,
      diabetes: patientData?.risks?.diabetes?.[i] ?? 0,
      cvd: patientData?.risks?.cvd?.[i] ?? 0,
    }))
    .reverse();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        ml: "250px",
        mt: "66px",
        pt: 1,
        pl: 5,
        pr: 5,
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid #d6d6d6",
          mb: 4,
          py: 3,
        }}
      >
        <Card sx={{ p: 2 }}>
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              textAlign: "center",
              mb: 2,
            }}
          >
            Patient Details
          </Typography>
          <hr />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr " }}>
            <Typography sx={{ mb: 1 }}>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Given Name:
              </Box>
              {" " + patientData?.patientInfo?.givenNames}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Last Name:
              </Box>
              {" " + patientData?.patientInfo?.familyName}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Date Of Birth:
              </Box>
              {" " + patientData?.patientInfo?.dateOfBirth}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Age:
              </Box>
              {" " + patientData?.patientInfo?.age}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Gender:
              </Box>{" "}
              {patientData?.patientInfo?.gender == 1 ? "Male" : "Female"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Weight:
              </Box>
              {" " + patientData?.patientInfo?.weight} kg
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Height:
              </Box>
              {" " + patientData?.patientInfo?.height} cm
            </Typography>
          </Box>
          <hr />
          <Typography variant="h5" sx={{ mb: 1 }}>
            It has been {patientData?.days} days since{" "}
            {patientData?.patientInfo?.givenNames}'s last health report
          </Typography>

          <Button
            variant="contained"
            onClick={(e) => navigate("/merchant-generate-report")}
          >
            Generate Report
          </Button>
        </Card>
      </Box>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Card Percentages */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {["stroke", "diabetes", "cvd"].map((key) => (
              <Card key={key} sx={{ borderRadius: "10px", flex: 1 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#747474" }}
                  >
                    {key.toUpperCase()}
                  </Typography>
                  <Typography variant="h4">
                    {patientData?.risks?.[key]?.slice(-1)[0] ?? 0}%
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      px: 0.4,
                      py: 0.1,
                      mt: 2,
                      borderRadius: "5px",
                      backgroundColor:
                        (patientData?.diff?.[key] ?? 0) >= 0
                          ? "rgb(255, 221, 221)"
                          : "#c6ffca",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: "bold",
                        color:
                          (patientData?.diff?.[key] ?? 0) >= 0
                            ? "#ff2424"
                            : "#17c940",
                      }}
                    >
                      {patientData?.diff?.[key] >= 0 ? "+ " : ""}
                      {(patientData?.diff?.[key] ?? 0).toFixed(2)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Bar chart */}
          <Card sx={{ p: 2 }}>
            <BarChart
              dataset={chartData}
              xAxis={[{ dataKey: "date" }]}
              series={[
                { dataKey: "stroke", label: "Stroke (%)" },
                { dataKey: "diabetes", label: "Diabetes (%)" },
                { dataKey: "cvd", label: "CVD (%)" },
              ]}
              colors={["#712b89", "#e091ff", "#3a0050"]}
              height={400}
            />
          </Card>
        </Box>

        {/* Recommendations */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              borderRadius: "10px",
              p: 2,
              height: "95%",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Latest Recommendations
            </Typography>
            <Box>
              {patientData?.recommendations &&
                Object.entries(patientData.recommendations).map(
                  ([key, value], index, arr) => (
                    <Box
                      key={key}
                      sx={{
                        pb: 2,
                        mb: 2,
                        borderBottom:
                          index !== arr.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {key.toUpperCase()}
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-line" }}>
                        {value}
                      </Typography>
                    </Box>
                  ),
                )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDetails;
