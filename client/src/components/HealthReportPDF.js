import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';


// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
    // TODO: Add logo here
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333333',
  },
  field: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
  },
  recommendationText: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey',
    fontSize: 10,
  }
});




const Field = ({ label, value }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);


// Create Document Component
const HealthReportPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Health Prediction Report</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>User Information</Text>
        <Field label="Full Name" value={data.userAccount.FullName} />
        <Field label="Email" value={data.userAccount.Email} />
        <Field label="Phone Number" value={data.userAccount.PhoneNumber} />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Personal Health Data (ID: {data.healthData.HealthDataID})</Text>
        <Field label="Gender" value={data.healthData.Gender} />
        <Field label="Age" value={data.healthData.AGE} />
        <Field label="Weight (kg)" value={data.healthData.WeightKilogram} />
        <Field label="Height (m)" value={data.healthData.HeightMeter} />
        <Field label="Alcohol" value={data.healthData.Alcohol ? 'Yes' : 'No'} />
        <Field label="Smoking Status" value={data.healthData.SmokingStatus} />
        <Field label="Marital Status" value={data.healthData.MaritalStatus} />
        <Field label="Working Status" value={data.healthData.WorkingStatus} />
        <Field label="Exercise" value={data.healthData.Exercise ? 'Yes' : 'No'} />
        <Field label="Hypertension" value={data.healthData.Hypertension ? 'Yes' : 'No'} />
        <Field label="Heart Disease" value={data.healthData.HeartDisease ? 'Yes' : 'No'} />
        <Field label="Diabetes" value={data.healthData.Diabetes ? 'Yes' : 'No'} />
        <Field label="Blood Glucose" value={data.healthData.BloodGlucose} />
        <Field label="Data Recorded At" value={new Date(data.healthData.CreatedAt).toLocaleString()} />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Prediction Results</Text>
        <Field label="Stroke" value={`${(data.prediction.StrokeChance * 100).toFixed(0)}%`} />
        <Field label="CVD" value={`${(data.prediction.CardioChance * 100).toFixed(0)}%`} />
        <Field label="Diabetes" value={`${(data.prediction.DiabetesChance * 100).toFixed(0)}%`} />
        <Field label="Report Generated At" value={new Date(data.prediction.CreatedAt).toLocaleString()} />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Recommendations</Text>
        <Text style={{...styles.label, marginBottom: 5}}>Exercise Recommendation:</Text>
        <Text style={styles.recommendationText}>{data.recommendations.exercise_recommendation}</Text>
        <Text style={{...styles.label, marginTop: 10, marginBottom: 5}}>Diet Recommendation:</Text>
        <Text style={styles.recommendationText}>{data.recommendations.diet_recommendation}</Text>
        <Text style={{...styles.label, marginTop: 10, marginBottom: 5}}>Lifestyle Recommendation:</Text>
        <Text style={styles.recommendationText}>{data.recommendations.lifestyle_recommendation}</Text>
      </View>

      <Text style={styles.footer}>
        © 2025 WellAI. All rights reserved.
      </Text>
    </Page>
  </Document>
);

export default HealthReportPDF;
