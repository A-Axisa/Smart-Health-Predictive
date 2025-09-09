import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
	Card,
	CardHeader,
	CardContent,
	Box,
	Grid,
	Typography,
	TextField,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Button
} from "@mui/material";
import AppThemeProvider from '../components/AppThemeProvider';

const GenerateReportForm = () => {

	function handleSubmit(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		console.log({
			// Personal Information
			firstName: data.get("firstName"),
			lastName: data.get("lastName"),
			email: data.get("email"),
			age: data.get("age"),
			weight: data.get("weight"),
			height: data.get("height"),

			// Fitness
			bloodGlucose: data.get("bloodGlucose"),
			exercise: data.get("exercise"),
			hyperTension: data.get("hyperTension"),
			heartDisease: data.get("heartDisease"),
			diabetes: data.get("diabetes"),

			// Lifestyle
			alcohol: data.get("alcohol"),
			smoker: data.get("smoker"),

			// Life Events
			maritalStatus: data.get("maritalStatus"),
			workingStatus: data.get("workingStatus")

		});
	}
	return (
		<AppThemeProvider>
			<Card variant="outlined" sx={{ maxWidth: 800, margin: "2rem auto", padding: 2 }}>
				<CardHeader title="Generate Report" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} />
				<CardContent>
					<Box component="form" onSubmit={handleSubmit}>
						{/* Personal Information Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
							Personal Information
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, }}>
							<TextField name="firstName" label="First Name" fullWidth />
							<TextField name="lastName" label="Last Name" fullWidth />
						</Box>
						<TextField name="email" label="Email" type="email" sx={{ mt: 3, gridColumn: '1 / -1' }} fullWidth />

						{/* Age & Physique Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} >
							Age & Physique
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, }}>
							<TextField name="weight" label="Weight" type="number" inputProps={{ step: "0.01", min: 0, max: 200 }} />
							<TextField name="age" label="Age" type="number" inputProps={{min: 0, max: 100 }} fullWidth />
							<TextField name="height" label="Height" type="number" inputProps={{ step: "0.01", min: 0, max: 3 }} />
						</Box>
						{/* Fitness Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} >
							Fitness
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, }}>
							<TextField name="bloodGlucose" label="Blood Glucose" type="number" inputProps={{ step: "0.01", min: 0, max: 3000 }} fullWidth />
							<FormLabel>Exercise
								<RadioGroup row name="exercise">
									<FormControlLabel value="Yes" control={<Radio />} label="Yes" />
									<FormControlLabel value="No" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Hyper Tension
								<RadioGroup row name="hyperTension">
									<FormControlLabel value="Yes" control={<Radio />} label="Yes" />
									<FormControlLabel value="No" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Heart Disease
								<RadioGroup row name="heartDisease">
									<FormControlLabel value="Yes" control={<Radio />} label="Yes" />
									<FormControlLabel value="No" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Diabetes
								<RadioGroup row name="diabetes">
									<FormControlLabel value="Yes" control={<Radio />} label="Yes" />
									<FormControlLabel value="No" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>
						</Box>
						{/* Lifestyle Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} >
							Lifestyle
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3  }}>

								<FormLabel>Alcohol
									<RadioGroup row name="alcohol">
										<FormControlLabel value="Yes" control={<Radio />} label="Yes" />
										<FormControlLabel value="No" control={<Radio />} label="No" />
									</RadioGroup>
								</FormLabel>

								<FormLabel>Smoker
									<RadioGroup row name="smoker">
										<FormControlLabel value="Yes" control={<Radio />} label="Yes" />
										<FormControlLabel value="No" control={<Radio />} label="No" />
									</RadioGroup>
								</FormLabel>
							
						</Box>

						{/* Life Events Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
							Life Events
						</Typography>
						<Box sx={{ display: 'grid',  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, }}>
							<FormLabel>Marital Status
								<RadioGroup row name="maritalStatus">
									<FormControlLabel value="Married" control={<Radio />} label="Married" />
									<FormControlLabel value="Single" control={<Radio />} label="Single" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Working Status
								<RadioGroup row name="workingStatus">
									<FormControlLabel value="Private" control={<Radio />} label="Private" />
									<FormControlLabel value="Public" control={<Radio />} label="Public" />
									<FormControlLabel value="Student" control={<Radio />} label="Student" />
									<FormControlLabel value="Unemployed" control={<Radio />} label="Unemployed" />
								</RadioGroup>
							</FormLabel>

						</Box>
						<Button variant="contained" type="submit" size="large">Submit</Button>
					</Box>

				</CardContent>
			</Card>
		</AppThemeProvider>
	);
}


export default GenerateReportForm