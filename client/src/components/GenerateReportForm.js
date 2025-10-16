import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import {
	Card,
	CardHeader,
	CardContent,
	Box,
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
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		// Fetch request for AI Model
		await fetch('http://localhost:8000/AIPrediction', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: 1, //TODO Retreive user ID for logged in user
				age: e.target.age.value,
				weight: e.target.weight.value,
				height: e.target.height.value,
				gender: 1,
				bloodGlucose: e.target.bloodGlucose.value,
				ap_hi: e.target.apHigh.value,
				ap_lo: e.target.apLow.value,
				highCholesterol: e.target.highCholesterol.value,
				exercise: e.target.exercise.value,
				hyperTension: e.target.hyperTension.value,
				heartDisease: e.target.heartDisease.value,
				diabetes: e.target.diabetes.value,
				alcohol: e.target.alcohol.value,
				smoker: e.target.smoker.value,
				maritalStatus: e.target.maritalStatus.value,
				workingStatus: e.target.workingStatus.value,
				merchantID: null
			})
		}).then(response => {
			if (!response.ok) {
				throw new Error(response.status)
			}
			return response.json()
		}).then(data => {
			navigate('/ai-health-prediction') // Route the user to the Health prediction page after submission
		}).catch(error => {
			console.log(error)
		})
	}
	return (
		<AppThemeProvider>
			<Card variant="outlined" sx={{ maxWidth: 800, margin: "2rem auto", padding: 2 }}>
				<CardHeader title="Generate Report" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} />
				<CardContent>
					<Box component="form" onSubmit={handleSubmit}>

						{/* Age & Physique Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} >
							Age & Physique
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, }}>
							<TextField name="weight" label="Weight (Kg)" type="number" inputProps={{ step: "0.01", min: 0, max: 200 }} />
							<TextField name="age" label="Age" type="number" inputProps={{ min: 0, max: 100 }} fullWidth />
							<TextField name="height" label="Height (m)" type="number" inputProps={{ step: "0.01", min: 0, max: 3 }} />
						</Box>
						{/* Fitness Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} >
							Fitness
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, }}>
							<TextField name="bloodGlucose" label="Blood Glucose" type="number" inputProps={{ step: "0.01", min: 0, max: 3000 }} fullWidth />
							<TextField name="apHigh" label="AP High" type="number" inputProps={{ step: "0.1", min: 0, max: 200 }} fullWidth />
							<TextField name="apLow" label="AP Low" type="number" inputProps={{ step: "0.1", min: 0, max: 200 }} fullWidth />
							<FormLabel>Exercise
								<RadioGroup row name="exercise">
									<FormControlLabel value="1" control={<Radio />} label="Yes" />
									<FormControlLabel value="0" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Hyper Tension
								<RadioGroup row name="hyperTension">
									<FormControlLabel value="1" control={<Radio />} label="Yes" />
									<FormControlLabel value="0" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Heart Disease
								<RadioGroup row name="heartDisease">
									<FormControlLabel value="1" control={<Radio />} label="Yes" />
									<FormControlLabel value="0" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Diabetes
								<RadioGroup row name="diabetes">
									<FormControlLabel value="1" control={<Radio />} label="Yes" />
									<FormControlLabel value="0" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>
							<FormLabel>High Cholesterol
								<RadioGroup row name="highCholesterol">
									<FormControlLabel value="1" control={<Radio />} label="Yes" />
									<FormControlLabel value="0" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>
						</Box>
						{/* Lifestyle Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }} >
							Lifestyle
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>

							<FormLabel>Alcohol
								<RadioGroup row name="alcohol">
									<FormControlLabel value="1" control={<Radio />} label="Yes" />
									<FormControlLabel value="0" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Smoker
								<RadioGroup row name="smoker">
									<FormControlLabel value="1" control={<Radio />} label="Yes" />
									<FormControlLabel value="0" control={<Radio />} label="No" />
								</RadioGroup>
							</FormLabel>

						</Box>

						{/* Life Events Section */}
						<Typography variant="h5" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
							Life Events
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, }}>
							<FormLabel>Marital Status
								<RadioGroup row name="maritalStatus">
									<FormControlLabel value="1" control={<Radio />} label="Married" />
									<FormControlLabel value="0" control={<Radio />} label="Single" />
								</RadioGroup>
							</FormLabel>

							<FormLabel>Working Status
								<RadioGroup row name="workingStatus">
									<FormControlLabel value="1" control={<Radio />} label="Private/Public" />
									<FormControlLabel value="0" control={<Radio />} label="Student/Unemployed" />

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