import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

/**
 * A template that can be filled in with health data from generated from
 * reports and displays them in a readable format.
 *
 * @param {Object} props
 * @param {Object} [props.report] - Health data in the report.
 * @param {Object} [props.date] - Date the report was generated.
 * @returns {@mui.material.Box}
 */
const ReportTemplate = ({ report, date }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const workingStatusMap = {
    0: "Unemployed",
    1: "Private",
    2: "Student",
    4: "Public",
  };

  const smokingStatusMap = {
    0: "No",
    1: "Yes",
    2: "Former",
  };

  const healthFields = [
    { label: "Age", value: report.age },
    { label: "Weight", value: `${report.weight}kg` },
    { label: "Height", value: `${report.height}cm` },
    { label: "Gender", value: report.gender === 0 ? "Female" : "Male" },

    {
      label: "Blood Glucose",
      value: `${report.bloodGlucose}mmol/L`,
    },

    {
      label: "Systolic Blood Pressure",
      value: `${report.apHi}mmHg`,
    },

    {
      label: "Diastolic Blood Pressure",
      value: `${report.apLo}mmHg`,
    },

    {
      label: "Exercise",
      value: report.exercise === 1 ? "Yes" : "No",
    },

    {
      label: "Hypertension",
      value: report.hypertension === 1 ? "Yes" : "No",
    },

    {
      label: "Heart Disease",
      value: report.heartDisease === 1 ? "Yes" : "No",
    },

    {
      label: "Diabetes",
      value: report.diabetes === 1 ? "Yes" : "No",
    },

    {
      label: "High Cholesterol",
      value: report.highCholesterol === 1 ? "Yes" : "No",
    },

    {
      label: "Alcohol",
      value: report.alcohol === 1 ? "Yes" : "No",
    },

    {
      label: "Smoker",
      value: smokingStatusMap[report.smoker],
    },

    {
      label: "Marital Status",
      value: report.maritalStatus === 1 ? "Married" : "Single",
    },

    {
      label: "Working Status",
      value: workingStatusMap[report.workingStatus],
    },
  ];

  function getRiskLevel(risk) {
    if (risk < 30) return "Low";
    if (risk < 70) return "Medium";
    return "High";
  }
  function getRiskColor(risk) {
    if (risk < 30) return "#00B050";
    if (risk < 70) return "#FFB800";
    return "#FF0000";
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        width: "100%",
        px: { xs: 1, sm: 2 },
        boxSizing: "border-box",
      }}
    >
      <Paper
        variant="report-section"
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          mx: "auto",
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"}
          sx={{
            textAlign: "center",
            mt: 3,
          }}
        >
          Health Risk Report
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            mb: 1,
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Generated on: {new Date(date).toLocaleDateString("en-AU")}
          {" at "}
          {`${new Date(date).toLocaleTimeString("en-AU")}`}
        </Typography>
      </Paper>

      <Paper
        variant="report-section"
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          mx: "auto",
        }}
      >
        {/* Health Predictions */}
        <Typography
          variant={isMobile ? "h5" : "h3"}
          sx={{
            mx: 3,
            mt: 3,
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          Health Risk Prediction
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3,
            p: 2,
          }}
        >
          <Card sx={{ textAlign: "center" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ color: "#747474" }}
            >
              Stroke
            </Typography>
            <Typography variant="h5">{report.strokeChance}%</Typography>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ color: "#747474" }}
            >
              Predicted Risk
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: getRiskColor(report.strokeChance) }}
            >
              {getRiskLevel(report.strokeChance)}
            </Typography>
          </Card>

          <Card sx={{ textAlign: "center" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ color: "#747474" }}
            >
              Diabetes
            </Typography>
            <Typography variant="h5">{report.diabetesChance}%</Typography>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ color: "#747474" }}
            >
              Predicted Risk
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: getRiskColor(report.diabetesChance) }}
            >
              {getRiskLevel(report.diabetesChance)}
            </Typography>
          </Card>

          <Card sx={{ textAlign: "center" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ color: "#747474" }}
            >
              CVD
            </Typography>
            <Typography variant="h5">{report.cvdChance}%</Typography>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ color: "#747474" }}
            >
              Predicted Risk
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: getRiskColor(report.cvdChance) }}
            >
              {getRiskLevel(report.cvdChance)}
            </Typography>
          </Card>
        </Box>
      </Paper>
      <Paper
        variant="report-section"
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          mx: "auto",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h3"}
          sx={{
            mx: 2,
            mt: 3,
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          Health Recommendations
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            p: 2,
          }}
        >
          {/* Exercise */}
          <Box>
            <Typography variant={isMobile ? "h6" : "h4"} sx={{ mb: 1 }}>
              Exercise Recommendations
            </Typography>
            <Typography variant="body1">
              {report.exerciseRecommendation ||
                "No exercise recommendation available."}
            </Typography>
          </Box>

          {/* Diet */}
          <Box>
            <Typography variant={isMobile ? "h6" : "h4"} sx={{ mb: 1 }}>
              Diet Recommendations
            </Typography>
            <Typography variant="body1">
              {report.dietRecommendation || "No diet recommendation available."}
            </Typography>
          </Box>

          {/* Lifestyle */}
          <Box>
            <Typography variant={isMobile ? "h6" : "h4"} sx={{ mb: 1 }}>
              Lifestyle Recommendations
            </Typography>
            <Typography variant="body1">
              {report.lifestyleRecommendation ||
                "No lifestyle recommendation available."}
            </Typography>
          </Box>

          {/* Diet to Avoid */}
          <Box>
            <Typography variant={isMobile ? "h6" : "h4"} sx={{ mb: 1 }}>
              Diet to Avoid
            </Typography>
            <Typography variant="body1">
              {report.dietToAvoidRecommendation ||
                "No diet-to-avoid recommendation available."}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        variant="report-section"
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          mx: "auto",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h3"}
          sx={{
            mx: 3,
            mb: 3,
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          Health Information Summary
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            p: 3,
          }}
        >
          {healthFields.map((field) => (
            <Box
              key={field.label}
              sx={{
                borderBottom: "1px solid #E0E0E0",
                pb: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#888888",
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                {field.label}
              </Typography>

              <Typography variant="h5">{field.value}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportTemplate;
