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

const GenerateReportForm = () => {

    function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log({
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            email: data.get("email"),
            age: data.get("age"),
            alcohol: data.get("alcohol"),
            smoker: data.get("smoker")
        });
    }
    return (
        <Card sx={{ maxWidth: 1000, margin: "2rem auto", padding: 2 }}>
            <CardHeader title="Generate Report" />
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    
                        <Typography variant="h6">
                            Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField name="firstName" label="First Name" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name="lastName" label="Last Name" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name="email" label="Email" type="email" />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField name="age" label="Age" type="number" />
                            </Grid>
                        </Grid>

                        <Typography variant="h6" >
                            Physique
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField name="weight" label="weight" type="number" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name="height" label="height" type="number" />
                            </Grid>
                        </Grid>
                        <Typography variant="h6" >
                            Fitness
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField name="bloodGlucose" label="Blood Glucose" type="number" />
                        </Grid>
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
                        </Grid>

                    <Typography variant="h6" >
                        Lifestyle
                    </Typography>
                    <Grid container spacing={2}>
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
                    </Grid>
                    
                    <Typography variant="h6" >
                        Life Events
                    </Typography>
                    <Grid container spacing={2}>
                    <FormLabel>Marital Status
                        <RadioGroup row name="maritalSatus">
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
                    </Grid>
                    <Button variant="contained" type="submit">Submit</Button>
                </Box>
            </CardContent>
        </Card>

    );
}


export default GenerateReportForm