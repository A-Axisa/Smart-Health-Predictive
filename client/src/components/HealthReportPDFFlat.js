import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import WellAiLogo from '../assets/WellAiLogoTR.png';

// Styles reused for flat report PDF
const styles = StyleSheet.create({
  page: { 
    flexDirection: 'column', 
    backgroundColor: '#FFFFFF', 
    paddingTop: 100,    // Space for fixed header
    paddingBottom: 70,  // Space for fixed footer
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica'
  },
  watermarkContainer: {
    position: 'absolute',
    top: 250,
    left: 80,
    right: 80,
    opacity: 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1
  },
  watermarkImage: {
    width: 400,
    height: 400,
    objectFit: 'contain'
  },
  headerContainer: {
    position: 'absolute',
    top: 30,
    left: 40,
    right: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  headerLeftText: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 5
  },
  logo: {
    width: 120, 
    height: 35,
    objectFit: 'contain'
  },
  headerLineContainer: {
    position: 'relative',
    height: 8,
    marginBottom: 10,
  },
  headerLine: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#888888'
  },
  headerLineLeftDrop: {
    position: 'absolute',
    top: 4,
    left: 0,
    width: 1,
    height: 4,
    backgroundColor: '#888888'
  },
  headerLineRightDrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 1,
    height: 4,
    backgroundColor: '#888888'
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  metaText: {
    fontSize: 10,
    color: '#000',
  },
  content: {
    flex: 1,
  },
  reportTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    textAlign: 'center',
    textDecoration: 'underline',
    marginBottom: 15,
  },
  sessionTitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 12,
    textDecoration: 'underline',
    marginBottom: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeaderCell: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCellText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  tableCellTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textAlign: 'center',
  },
  recommendationSection: {
    marginBottom: 12,
  },
  recommendationLabel: {
    fontSize: 10,
    marginBottom: 2,
    fontFamily: 'Helvetica',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 20,
    paddingRight: 10,
  },
  bulletSign: {
    width: 12,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  bulletContent: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  disclaimer: {
    fontSize: 9,
    lineHeight: 1.3,
    textAlign: 'justify',
  },
  privacyText: {
    fontSize: 9,
  },
  link: {
    color: '#0066cc',
    textDecoration: 'underline',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
  },
  footerLine: {
    height: 1,
    backgroundColor: '#888888',
    marginBottom: 5,
  },
  footerLineLeftDrop: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    width: 1,
    height: 5,
    backgroundColor: '#888888'
  },
  footerLineRightDrop: {
    position: 'absolute',
    bottom: 6,
    right: 0,
    width: 1,
    height: 5,
    backgroundColor: '#888888'
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: '#888',
  }
});

const getRisk = (val) => {
  const percentage = Number(val || 0);
  if (percentage >= 50) return { label: 'HIGH', color: '#FF0000' };
  if (percentage >= 30) return { label: 'MEDIUM', color: '#FFB800' };
  return { label: 'LOW', color: '#00B050' };
};

const pct = (v) => `${Number(v || 0).toFixed(1)}%`;

const TableRow = ({ index, disease, chance, risk, noBorderBottom }) => (
  <View style={[styles.tableRow, noBorderBottom ? { borderBottomWidth: 0 } : {}]}>
    <View style={[styles.tableCell, { width: '10%', borderRightColor: '#000', borderRightWidth: 1 }]}>
       <Text>{index}</Text>
    </View>
    <View style={[styles.tableCell, { width: '40%', borderRightColor: '#000', borderRightWidth: 1, alignItems: 'flex-start', paddingLeft: 10 }]}>
       <Text>{disease}</Text>
    </View>
    <View style={[styles.tableCell, { width: '25%', borderRightColor: '#000', borderRightWidth: 1 }]}>
       <Text>{pct(chance)}</Text>
    </View>
    <View style={[styles.tableCell, { width: '25%' }]}>
       <Text style={[styles.tableCellTitle, { color: risk.color }]}>{risk.label}</Text>
    </View>
  </View>
);

const renderParagraph = (text) => {
  if (!text) return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletSign}>-</Text>
      <Text style={styles.bulletContent}>N/A</Text>
    </View>
  );
  
  const lines = text.replace(/\r/g, '').split('\n');
  return lines.map((line, idx) => {
    let t = line.trim();
    if (!t) return null;
    if (t.startsWith('-') || t.startsWith('•') || t.startsWith('*')) {
      t = t.substring(1).trim();
    }
    return (
      <View key={idx} style={styles.bulletRow}>
         <Text style={styles.bulletSign}>-</Text>
         <Text style={styles.bulletContent}>{t}</Text>
      </View>
    );
  });
};

// PDF for flat report data returned from /getReportData/{id}
// Props: { data, metaId, metaDate }
const HealthReportPDFFlat = ({ data, metaId, metaDate }) => {
  const dateObj = metaDate ? new Date(metaDate) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const patientName = (data.patientName || '').trim() || 'Patient';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Watermark */}
        <View fixed style={styles.watermarkContainer}>
            <Image src={WellAiLogo} style={styles.watermarkImage} />
        </View>

        {/* Fixed Header */}
        <View fixed style={styles.headerContainer}>
            <View style={styles.headerTop}>
              <Text style={styles.headerLeftText}>Predictive Health Report for Early Detection</Text>
              <Image src={WellAiLogo} style={styles.logo} />
            </View>
            <View style={styles.headerLineContainer}>
              <View style={styles.headerLineLeftDrop} />
              <View style={styles.headerLine} />
              <View style={styles.headerLineRightDrop} />
            </View>
            <View style={styles.headerBottom}>
              <Text style={styles.metaText}>Name: {patientName}</Text>
              <Text style={styles.metaText}>Report date: {dateStr}</Text>
            </View>
        </View>

        {/* Fixed Footer */}
        <View fixed style={styles.footerContainer}>
            <View style={styles.footerLineLeftDrop} />
            <View style={styles.footerLine} />
            <View style={styles.footerLineRightDrop} />
            <View style={styles.footerContent}>
               <Text style={styles.footerText}>All Copyright Reserved © {dateObj.getFullYear()}</Text>
               <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            </View>
        </View>

        {/* Body Content */}
        <View style={styles.content}>
           {/* Title */}
           <Text style={styles.reportTitle}>Health Prediction Report</Text>

           {/* Session 1 */}
           <Text style={styles.sessionTitle}>Session 1 - Analysis Result</Text>
           <View style={styles.table}>
             {/* Table Header */}
             <View style={styles.tableHeader}>
               <View style={[styles.tableHeaderCell, { width: '10%', borderRightColor: '#000', borderRightWidth: 1 }]}><Text style={styles.tableHeaderCellText}>No.</Text></View>
               <View style={[styles.tableHeaderCell, { width: '40%', borderRightColor: '#000', borderRightWidth: 1 }]}><Text style={styles.tableHeaderCellText}>Disease Description</Text></View>
               <View style={[styles.tableHeaderCell, { width: '25%', borderRightColor: '#000', borderRightWidth: 1 }]}><Text style={styles.tableHeaderCellText}>AI-Powered{'\n'}Prediction Result</Text></View>
               <View style={[styles.tableHeaderCell, { width: '25%' }]}><Text style={styles.tableHeaderCellText}>Risk{'\n'}Category</Text></View>
             </View>
             
             {/* Rows */}
             <TableRow index={1} disease="Cardiovascular Disease" chance={data.CVDChance} risk={getRisk(data.CVDChance)} />
             <TableRow index={2} disease="Diabetics" chance={data.diabetesChance} risk={getRisk(data.diabetesChance)} />
             <TableRow index={3} disease="Stroke" chance={data.strokeChance} risk={getRisk(data.strokeChance)} noBorderBottom />
           </View>

           {/* Session 2 */}
           <Text style={styles.sessionTitle}>Session 2 – Personal Health Recommendations</Text>
           
           <View style={styles.recommendationSection}>
             <Text style={styles.recommendationLabel}>Lifestyle:</Text>
             {renderParagraph(data.lifestyleRecommendation || data.exerciseRecommendation)}
           </View>
           
           <View style={styles.recommendationSection}>
             <Text style={styles.recommendationLabel}>Food Intake:</Text>
             {renderParagraph(data.dietRecommendation)}
           </View>
           
           <View style={styles.recommendationSection}>
             <Text style={styles.recommendationLabel}>Food to Avoid:</Text>
             {renderParagraph(data.dietToAvoidRecommendation)}
           </View>
           
           <View style={styles.recommendationSection}>
             <Text style={styles.recommendationLabel}>Exercise Recommendations:</Text>
             {renderParagraph(data.exerciseRecommendation)}
           </View>

          {/* Break hint: we want disclaimer to either stay at the end or push to next page. */}
          <Text style={[styles.disclaimer, { marginTop: 30 }]} break>
            Disclaimer: The information provided by this health prediction report is intended for informational
            purposes only and should not be construed as medical advice. Always consult with a qualified
            healthcare professional regarding any questions or concerns you may have about your health. Kindly
            note that the predictions may not be completely accurate and may not take into account all relevant
            factors, and results may vary depending on your individual health history and circumstances. By using
            this prediction report, you agree that you understand and accept the limitations of the information
            provided.
          </Text>
          
          <View style={{ marginTop: 20 }}>
            <Text style={styles.privacyText}>
              For our privacy notice, please refer to <Text style={styles.link}>https://wellai.app/privacy-notice/</Text>.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default HealthReportPDFFlat;
