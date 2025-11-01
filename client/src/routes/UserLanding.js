import {
	Card,
	CardHeader,
	CardContent,
	Box,
	Grid,
	Typography,
	Stack,
	Button,
	CardActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';

const UserLanding = ({ }) => {
	const navigate = useNavigate();
	const [name, setName] = useState(null)

	useEffect(() => {
		fetch(`http://localhost:8000/user/me`, {
			method: "GET",
			credentials: "include"
		})
			.then(response => response.json())
			.then(user => {
				setName(user.name);
			})
	}, []);

	async function logout(e) {
		e.preventDefault();

		await fetch('http://localhost:8000/logout', {
			method: 'POST',
			credentials: 'include'
		}).then(response => {
			if (!response.ok) {
				throw new Error(response.status)
			}
			return response.json()
		}).then(data => {
			navigate('/login')
		})
	}


	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "grid",
				gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
				gap: 3,
				justifyContent: "center",
				alignItems: "start",
				p: 3,
				bgcolor: '#f5f5f5', //bgcolor: "#127067", (Green background)
				boxShadow: 24
			}}>

			{/*Main information Section*/}
			<Card variant="outlined" sx={{
				minHeight: { xs: "auto", md: "90vh" },
				boxShadow: 10,
				borderRadius: 5,
				marginLeft: "2rem",
				padding: 2,
				display: "flex",
				flexDirection: "column"
			}}>
				<Typography variant="h3" fontWeight={600} color="primary" align="center">
					Welcome{ name ? ", " + name.split(' ')[0] : ""} 
				</Typography>
				<CardContent>
					<Typography variant="h6">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
						facilisis arcu et ex tristique, ut hendrerit est posuere. Nunc
						fringilla commodo neque vel scelerisque. Sed id dictum massa, eu
						tristique enim. Vestibulum pellentesque quis nibh et egestas.
						Nulla efficitur quam et venenatis rhoncus. Quisque nec odio a
						ligula facilisis semper vel ut mi. Quisque ac nulla tortor.
						Curabitur egestas dictum risus, ac efficitur diam vulputate sed.
						Vivamus sed tortor nunc.
					</Typography>
				</CardContent>
				<CardActions disableSpacing sx={{ mt: "auto", justifyContent: "end" }}>
					<Stack spacing={2}>
						<Button variant="outlined" onClick={logout}>Logout</Button>
						<Button type='submit' onClick={() => navigate("/generate-report")} variant="contained" size="large">Generate Report </Button>
						<Button type='submit' onClick={() => navigate("/ai-health-prediction")}  variant="contained" size="large">Health Prediction History</Button>
					</Stack>
				</CardActions>
			</Card>

			<Box
				sx={{
					display: "grid",
					gridTemplateRows: { xs: '1fr 1fr', md: '1fr 1fr' },
					gap: 3,

				}}>
				{/*Account Information Section*/}
				<Card sx={{
					minHeight: { xs: "auto", md: "40vh" },
					boxShadow: 10,
					borderRadius: 5,
					marginLeft: "2rem",
					padding: 2,
					display: "flex",
					flexDirection: "column"
				}}>
					<Typography variant="h3" fontWeight={600} color="primary" align="center">
						Account Information
					</Typography>
					<CardContent>
						<Typography variant="h6">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
							facilisis arcu et ex tristique, ut hendrerit est posuere. Nunc
							fringilla commodo neque vel scelerisque. Sed id dictum massa, eu
							tristique enim. Vestibulum pellentesque quis nibh et egestas.
							Nulla efficitur quam et venenatis rhoncus. Quisque nec odio a
							ligula facilisis semper vel ut mi. Quisque ac nulla tortor.
							Curabitur egestas dictum risus, ac efficitur diam vulputate sed.
							Vivamus sed tortor nunc.
						</Typography>
					</CardContent>
					<CardActions disableSpacing sx={{ mt: "auto", justifyContent: "end" }}>
						<Button variant="contained" onClick={() => navigate("/user-settings")} >User Settings</Button>
					</CardActions>
				</Card>

				{/*Analytics Section*/}
				<Card sx={{
					minHeight: { xs: "auto", md: "40vh" },
					boxShadow: 10,
					borderRadius: 5,
					marginLeft: "2rem",
					padding: 2,
					display: "flex",
					flexDirection: "column"
				}}>
					<Typography variant="h3" fontWeight={600} color="primary" align="center">
						Analytics
					</Typography>
					<CardContent>
						<Typography variant="h6">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
							facilisis arcu et ex tristique, ut hendrerit est posuere. Nunc
							fringilla commodo neque vel scelerisque. Sed id dictum massa, eu
							tristique enim. Vestibulum pellentesque quis nibh et egestas.
							Nulla efficitur quam et venenatis rhoncus. Quisque nec odio a
							ligula facilisis semper vel ut mi. Quisque ac nulla tortor.
							Curabitur egestas dictum risus, ac efficitur diam vulputate sed.
							Vivamus sed tortor nunc.
						</Typography>
					</CardContent>
					<CardActions disableSpacing sx={{ mt: "auto", justifyContent: "end" }}>
						<Button variant="contained" onClick={() => navigate("/health-analytics")}>Health Analytics</Button>
					</CardActions>
				</Card>
			</Box>
		</Box>
	);
}
export default UserLanding
