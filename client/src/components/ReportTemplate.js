import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Divider,
	Card,
	Grid
} from '@mui/material';


const ReportTemplate = ({ report, date }) => {
	const workingStatusMap = {
    0: "Unemployed",
    1: "Private",
    2: "Student",
    4: "Public"
  };

  const smokingStatusMap = {
    0: "No",
    1: "Yes",
    2: "Former"
  };

	return (
		<Box>
			<Typography
				variant="h3"
				sx={{ fontWeight: 600, textAlign: "center", mt: 3, mb: 3, color: 'primary.main' }}>
				Report {new Date(date).toLocaleDateString('en-AU')}
			</Typography>
			<Divider sx={{ borderColor: '#e0e0e0' }} />

			<Typography variant="h4" sx={{ mb: 3, mt: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }}>
				Health Information Summary
			</Typography>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
					gap: 2,
					p: 2,
					px: 5
				}}>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Age:</Typography>
					<Typography>{report.age}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Weight:</Typography>
					<Typography>{report.weight}kg</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Height:</Typography>
					<Typography>{report.height}cm</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Gender:</Typography>
					<Typography>{report.gender === 0 ? "Female" : "Male"}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Blood Glucose:</Typography>
					<Typography>{report.bloodGlucose}mmol/L</Typography>
				</Box>
				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Systolic Blood Pressure:</Typography>
					<Typography>{report.ap_hi}mmHg</Typography>
				</Box>
				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Diastolic Blood Pressure:</Typography>
					<Typography>{report.ap_lo}mmHg</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Exercise:</Typography>
					<Typography>{report.exercise === 1 ? "Yes" : "No"}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Hypertension:</Typography>
					<Typography>{report.hyperTension === 1 ? "Yes" : "No"}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Heart Disease:</Typography>
					<Typography>{report.heartDisease === 1 ? "Yes" : "No"}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Diabetes:</Typography>
					<Typography>{report.diabetes === 1 ? "Yes" : "No"}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>High Cholesterol:</Typography>
					<Typography>{report.highCholesterol === 1 ? "Yes" : "No"}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Alcohol:</Typography>
					<Typography>{report.alcohol === 1 ? "Yes" : "No"}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Smoker:</Typography>
					<Typography>{smokingStatusMap[report.smoker]}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Marital Status:</Typography>
					<Typography>{report.maritalStatus === 1 ? "Married" : "Single"}</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<Typography sx={{ fontWeight: 600 }}>Working Status:</Typography>
					<Typography>{workingStatusMap[report.workingStatus]}</Typography>
				</Box>
			</Box>


			<Divider sx={{ borderColor: '#e0e0e0' }} />
			{/* Health Predictions */}
			<Typography variant="h4" sx={{ mb: 3, mt: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }}>
				Health Prediction
			</Typography>
			<Box sx={{
				display: "grid",
				gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
				gap: 3,
				p: 2
			}} >

				<Typography variant="h6" sx={{ textAlign: "center" }} >
					Stroke: {report.strokeChance}%
				</Typography>

				<Typography variant="h6" sx={{ textAlign: "center" }}>
					Diabetes: {report.diabetesChance}%
				</Typography>

				<Typography variant="h6" sx={{ textAlign: "center" }}>
					CVD: {report.CVDChance}%
				</Typography>
			</Box>

			<Divider sx={{ borderColor: '#e0e0e0' }} />

			<Box sx={{
				display: "grid",
				gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
				gap: 3,
				p: 2
			}} >
				{/* Lifestyle Recommendations */}
				<Card variant="outlined" sx={{ width: "90%", margin: "2rem auto", padding: 2, height: "90%" }}>
					<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }} >
						Lifestyle Recommendations
					</Typography>
					<List>
						<ListItem>
							<ListItemText primary={report.lifestyleRecommendation || 'No lifestyle recommendation available.'} />
						</ListItem>
					</List>
				</Card>

				{/* Exercise Recommendations*/}
				<Card variant="outlined" sx={{ width: "90%", margin: "2rem auto", padding: 2, height: "90%" }}>
					<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }} >
						Exercise Recommendations
					</Typography>
					<List>
						<ListItem>
							<ListItemText primary={report.exerciseRecommendation || 'No exercise recommendation available.'} />
						</ListItem>
					</List>
				</Card>

				{/* Diet Recommendations*/}
				<Card variant="outlined" sx={{ width: "90%", margin: "2rem auto", padding: 2, height: "90%" }}>
					<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }} >
						Diet Recommendations
					</Typography>
					<List>
						<ListItem>
							<ListItemText primary={report.dietRecommendation || 'No diet recommendation available.'} />
						</ListItem>
					</List>
				</Card>

				{/* Diet to Avoid */}
				<Card variant="outlined" sx={{ width: "90%", margin: "2rem auto", padding: 2, height: "90%" }}>
					<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }} >
						Diet to Avoid
					</Typography>
					<List>
						<ListItem>
							<ListItemText primary={report.dietToAvoidRecommendation || 'No diet-to-avoid recommendation available.'} />
						</ListItem>
					</List>
				</Card>
			</Box>
		</Box>

	);
}

export default ReportTemplate