import ReportTemplate from "../components/ReportTemplate";
import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';

const AIHealthPrediction = ({ }) => {
	const [reportDates, setReportDates] = useState([]);
	const [selectedDate, setSelectedDate] = useState();
	const [reportData, setReportData] = useState();

	// Fetch the users health data ID and Dates
	React.useEffect(() => {
		fetch(`http://localhost:8000/getHealthDataDates/1`) // TODO Change 1 to the current users ID
			.then(response => response.json())
			.then(data => {
				setReportDates(data);
				if (data.length > 0) {
					setSelectedDate(data[0])
					console.log("The selected date is: " + selectedDate)
				}
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	// Fetch report data
	useEffect(() => {
		if (!selectedDate) return;
		fetch(`http://localhost:8000/getReportData/${selectedDate.healthDataID}`)
			.then(res => res.json())
			.then(data => setReportData(data))
			.catch(err => console.log(err));
	}, [selectedDate]);

	

	// Prevents page from loading if the user has no health record
	if (!reportData) {
		return <h1>User has no Health Prediction Reports</h1>;
	}
	else {

		return (
			<Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
				{/* Sidebar */}
				<Box sx={{ width: 400, bgcolor: 'background.paper', borderRight: '1px solid #e0e0e0' }}>
					<Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							Report History
						</Typography>
					</Box>
					<List component="nav" sx={{ p: 0 }}>
						{reportDates.map((item) =>
							<ListItem key={item.id} selected={selectedDate.healthDataID === item.healthDataID}
								onClick={() => setSelectedDate(item)}
								button
								sx={{
									py: 2,
									px: 3,
									borderLeft:
										selectedDate.healthDataID === item.healthDataID ? '4px solid' : '4px solid transparent',
									borderLeftColor: 'primary.main',
									bgcolor: selectedDate.healthDataID === item.healthDataID ? 'action.selected' : 'transparent',
								}}
							>
								<ListItemText
									primary={`Report: ${new Date(item.date).toLocaleDateString()}`}
									slotProps={{
										primary: {
											style: {
												fontWeight: selectedDate.healthDataID === item.healthDataID ? 600 : 400,
											},
										},
									}}
								/>
							</ListItem>
						)}
					</List>
				</Box>
				{/* Report Content */}
				<Box sx={{ flex: 1 }}>
					<ReportTemplate report={reportData} date={selectedDate.date} />
				</Box>
			</Box>
		);
	}
}

export default AIHealthPrediction
