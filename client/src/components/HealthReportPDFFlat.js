import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Styles reused for flat report PDF
const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: 'grey' },
  section: { marginBottom: 10, padding: 10, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  title: { fontSize: 18, marginBottom: 10, color: '#333333' },
  field: { flexDirection: 'row', marginBottom: 5, gap: 6 },
  label: { fontSize: 12, fontWeight: 'bold' },
  value: { fontSize: 12 },
  recommendationText: { fontSize: 12, lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 10 }
});

const Field = ({ label, value }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// PDF for flat report data returned from /getReportData/{id}
// Props: { data, metaId, metaDate }
const HealthReportPDFFlat = ({ data, metaId, metaDate }) => {
  const yn = (v) => (v ? 'Yes' : 'No');
  // Values from /getReportData appear to already be percentages (matching UI), so don't multiply.
  const pct = (v) => `${Number(v || 0).toFixed(0)}%`;
  const formatGender = (g) => (Number(g) === 0 ? 'Female' : 'Male');
  const dateStr = metaDate ? new Date(metaDate).toLocaleString() : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Health Prediction Report</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Report Metadata</Text>
          <Field label="Health Data ID" value={String(metaId ?? '')} />
          <Field label="Record Date" value={dateStr} />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Health Information</Text>
          <Field label="Age" value={String(data.age ?? '')} />
          <Field label="Weight (kg)" value={String(data.weight ?? '')} />
          <Field label="Height (m)" value={String(data.height ?? '')} />
          <Field label="Gender" value={formatGender(data.gender)} />
          <Field label="Blood Glucose" value={String(data.bloodGlucose ?? '')} />
          <Field label="AP High" value={String(data.ap_hi ?? '')} />
          <Field label="AP Low" value={String(data.ap_lo ?? '')} />
          <Field label="High Cholesterol" value={yn(Boolean(data.highCholesterol))} />
          <Field label="Exercise" value={yn(Boolean(data.exercise))} />
          <Field label="Hypertension" value={yn(Boolean(data.hyperTension))} />
          <Field label="Heart Disease" value={yn(Boolean(data.heartDisease))} />
          <Field label="Diabetes" value={yn(Boolean(data.diabetes))} />
          <Field label="Alcohol" value={yn(Boolean(data.alcohol))} />
          <Field label="Smoker" value={yn(Boolean(data.smoker))} />
          <Field label="Marital Status" value={yn(Boolean(data.maritalStatus))} />
          <Field label="Working Status" value={yn(Boolean(data.workingStatus))} />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Prediction Results</Text>
          <Field label="Stroke" value={pct(data.strokeChance)} />
          <Field label="CVD" value={pct(data.CVDChance)} />
          <Field label="Diabetes" value={pct(data.diabetesChance)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Recommendations</Text>
          <Text style={{ ...styles.label, marginBottom: 5 }}>Exercise Recommendation:</Text>
          <Text style={styles.recommendationText}>{data.exerciseRecommendation || 'N/A'}</Text>
          <Text style={{ ...styles.label, marginTop: 10, marginBottom: 5 }}>Diet Recommendation:</Text>
          <Text style={styles.recommendationText}>{data.dietRecommendation || 'N/A'}</Text>
          <Text style={{ ...styles.label, marginTop: 10, marginBottom: 5 }}>Lifestyle Recommendation:</Text>
          <Text style={styles.recommendationText}>{data.lifestyleRecommendation || 'N/A'}</Text>
          <Text style={{ ...styles.label, marginTop: 10, marginBottom: 5 }}>Diet to Avoid:</Text>
          <Text style={styles.recommendationText}>{data.dietToAvoidRecommendation || 'N/A'}</Text>
        </View>

        <Text style={styles.footer}>© 2025 WellAI. All rights reserved.</Text>
      </Page>
    </Document>
  );
};

export default HealthReportPDFFlat;
