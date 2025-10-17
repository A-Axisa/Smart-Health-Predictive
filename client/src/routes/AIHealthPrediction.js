import ReportTemplate from "../components/ReportTemplate";
import DownloadReportButton from "../components/DownloadReportButton";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import ConfirmationDialog from '../components/confirmationDialog';
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
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

	async function deleteReport() {
		console.log("Delete" + selectedDate.healthDataID);
		setDeleteDialogOpen(false);
	}

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
								onClick={(e) => setSelectedDate(item)}
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
									primary={`Report: ${new Date(item.date).toLocaleDateString('en-AU')}`}
									slotProps={{
										primary: {
											style: {
												fontWeight: selectedDate.healthDataID === item.healthDataID ? 600 : 400,
											},
										},
									}}
								/>
								{/* Delete Report Button */}
								{(selectedDate.healthDataID === item.healthDataID) &&
									<IconButton aria-label="delete" color="error" onClick={(e) => setDeleteDialogOpen(true)}>
										<CloseIcon />
									</IconButton>
								}
							</ListItem>
						)}
					</List>
				</Box>
				{/* Report Content */}
				<Box sx={{ flex: 1 }}>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
						<DownloadReportButton
							healthDataId={selectedDate?.healthDataID}
							flatReportData={reportData}
							meta={{ date: selectedDate?.date, healthDataID: selectedDate?.healthDataID }}
						/>
					</Box>
					<ReportTemplate report={reportData} date={selectedDate.date} />
				</Box>
				<ConfirmationDialog
					open={deleteDialogOpen}
					title="Delete Report"
					message={
						<>
							This action will permanently delete the selected health report and all related health data.
							Are you sure you want to delete this health report?.
						</>
					}
					confirmText="Delete"
					cancelText="Cancel"
					confirmColor="error"
					cancelColor="primary"
					confirm={() => deleteReport()}
					cancel={() => setDeleteDialogOpen(false)}
				/>

			</Box>
		);
	}
}

export default AIHealthPrediction
