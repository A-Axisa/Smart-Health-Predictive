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

const UserLanding = ({ }) => {
  const navigate = useNavigate();

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
		<Box sx={{ backgroundColor: '#127067', width: '100vw', height: '100vh', padding: '0', margin: '0' }}>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Card variant="outlined" sx={{ width: "50vw", height: "90vh", boxShadow: 10, borderRadius: 5, marginLeft: "2rem", padding: 2, display: "flex", flexDirection: "column" }}>
						<Typography variant="h3" fontWeight={600} color="primary" sx={{ ml: 35, mb: 3 }} >
							Welcome, [First Name]
						</Typography>
						<CardContent>
							<Box sx={{ ml: 5 }}>
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
							</Box>
						</CardContent>

						<CardActions disableSpacing sx={{ mt: "auto", justifyContent: "end" }}>							
								<Stack spacing={2}>
								<Button variant="outlined" onClick={logout}>Logout</Button>
								<Button type='submit' href="generate-report" variant="contained" size="large">Generate Report </Button>
								<Button type='submit' href="ai-health-prediction" variant="contained" size="large">Health Prediction History</Button>
								</Stack>
						</CardActions>

					</Card>
				</Grid>
				<Grid item xs={4}>
					<Stack spacing={2}>
						<Card variant="outlined" sx={{ width: "40vw", height: "40vh", boxShadow: 4, borderRadius: 5, padding: 2, display:"flex",flexDirection: "column" }}>
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
							<CardActions disableSpacing sx={{ mt: "auto", justifyContent:"end" }}>
								<Button type='submit' href="user-settings" variant="contained" size="large">User Settings</Button>
							</CardActions>

						</Card>


						<Card variant="outlined" sx={{ width: "40vw", height: "45vh", boxShadow: 4, borderRadius: 5, padding: 2, display: "flex", flexDirection: "column" }}>
							<Typography variant="h3" fontWeight={600} color="primary" align="center">
								Analytics
							</Typography>
							<CardContent>
								<Box>
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
								</Box>
							</CardContent>
							<CardActions disableSpacing sx={{ mt: "auto", justifyContent: "end" }}>
								<Button type='submit' href="health-analytics" variant="contained" size="large">Health Anaylitics</Button>
							</CardActions>
						</Card>
					</Stack>
				</Grid>



			</Grid>



		</Box>


	);
}

export default UserLanding
