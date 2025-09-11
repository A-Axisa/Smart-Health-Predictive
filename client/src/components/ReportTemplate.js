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


const ReportTemplate = ({ report }) => {

	return (
		<Box>
			<Typography
				variant="h3"
				sx={{ fontWeight: 600, textAlign: "center", mt: 3, mb: 3, color: 'primary.main' }}>
				Report {report.date}
			</Typography>
			<Divider sx={{ borderColor: '#e0e0e0' }} />

			<Typography variant="h4" sx={{ mb: 3, mt: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }}>
				Health Information Summary
			</Typography>
			<Typography variant="body1" sx={{ mb: 3, ml: 5 }} >
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere. Nunc
				fringilla commodo neque vel scelerisque. Sed id dictum massa, eu
				tristique enim. Vestibulum pellentesque quis nibh et egestas.
				Nulla efficitur quam et venenatis rhoncus. Quisque nec odio a
				ligula facilisis semper vel ut mi. Quisque ac nulla tortor.
				Curabitur egestas dictum risus, ac efficitur diam vulputate sed.
				Vivamus sed tortor nunc.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere. Nunc
				fringilla commodo neque vel scelerisque. Sed id dictum massa, eu
				tristique enim. Vestibulum pellentesque quis nibh et egestas.
				Nulla efficitur quam et venenatis rhoncus. Quisque nec odio a
				ligula facilisis semper vel ut mi. Quisque ac nulla tortor.
				Curabitur egestas dictum risus, ac efficitur diam vulputate sed.
				Vivamus sed tortor nunc.
			</Typography>

			<Divider sx={{ borderColor: '#e0e0e0' }} />
			{/* Health Predictions */}
			<Typography variant="h4" sx={{ mb: 3, mt: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }}>
				Health Prediction
			</Typography>
			<Grid container spacing={2}>
				<Grid size={4}>
					<Typography variant="h6" sx={{ textAlign: "center" }} >
						Stroke: {report.strokeChance}%
					</Typography>
				</Grid>
				<Grid size={4}>
					<Typography variant="h6" sx={{ textAlign: "center" }}>
						Diabetes: {report.diabetesChance}%
					</Typography>
				</Grid>
				<Grid size={4}>
					<Typography variant="h6" sx={{ textAlign: "center" }}>
						CVD: {report.cardioChance}%
					</Typography>
				</Grid>
			</Grid>

			<Divider sx={{ borderColor: '#e0e0e0' }} />

			<Grid container spacing={2}>
				{/* Lifestyle Recomendations */}
				<Grid size={6}>
					<Card variant="outlined" sx={{ maxWidth: 800, margin: "2rem auto", padding: 2 }}>
						<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }} >
							Lifestyle Recomendations
						</Typography>
						<List>
							<ListItem>
								<ListItemText primary="Recomendation 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere." />
							</ListItem>
							<ListItem>
								<ListItemText primary="Recomendation 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere. " />
							</ListItem>
							<ListItem>
								<ListItemText primary="Recomendation 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere." />
							</ListItem>
						</List>
					</Card>
				</Grid>

				{/* Exercise Recomendations*/}
				<Grid size={6}>
					<Card variant="outlined" sx={{ maxWidth: 800, margin: "2rem auto", padding: 2 }}>
						<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }} >
							Exercise Recomendations
						</Typography>
						<List>
							<ListItem>
								<ListItemText primary="Recomendation 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere." />
							</ListItem>
							<ListItem>
								<ListItemText primary="Recomendation 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere. " />
							</ListItem>
							<ListItem>
								<ListItemText primary="Recomendation 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere." />
							</ListItem>
						</List>
					</Card>
				</Grid>

				{/* Diet Recomendations*/}
				<Grid size={6}>
					<Card variant="outlined" sx={{ maxWidth: 800, margin: "2rem auto", padding: 2 }}>
						<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }} >
							Diet Recomendations
						</Typography>
						<List>
							<ListItem>
								<ListItemText primary="Recomendation 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere." />
							</ListItem>
							<ListItem>
								<ListItemText primary="Recomendation 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere. " />
							</ListItem>
							<ListItem>
								<ListItemText primary="Recomendation 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere." />
							</ListItem>
						</List>
					</Card>
				</Grid>

				{/* Diet to Avoid*/}
				<Grid size={6}>
					<Card variant="outlined" sx={{ maxWidth: 800, margin: "2rem auto", padding: 2 }}>
						<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: "center" }} >
							Diet to Avoid
						</Typography>
						<List>
							<ListItem>
								<ListItemText primary="Recomendation 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere." />
							</ListItem>
							<ListItem>
								<ListItemText primary="Recomendation 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere. " />
							</ListItem>
							<ListItem>
								<ListItemText primary="Recomendation 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
				facilisis arcu et ex tristique, ut hendrerit est posuere." />
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}

export default ReportTemplate