import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as Mui from '@mui/material';

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
        <Mui.Box component="form" onSubmit={handleSubmit}>
            <Mui.TextField name="firstName" label="First Name" />
            <Mui.TextField name="lastName" label="Last Name" />
            <Mui.TextField name="email" label="Email" type="email" />
            <Mui.TextField name="age" label="Age" type="number" />
            <Mui.TextField name="weight" label="weight" type="number" />
            <Mui.TextField name="height" label="height" type="number" />
            <Mui.TextField name="bloodGlucose" label="Blood Glucose" type="number" />

            <Mui.FormLabel>Alcohol
                <Mui.RadioGroup row name="alcohol">
                    <Mui.FormControlLabel value="Yes" control={<Mui.Radio />} label="Yes" />
                    <Mui.FormControlLabel value="No" control={<Mui.Radio />} label="No" />
                </Mui.RadioGroup>
            </Mui.FormLabel>

            <Mui.FormLabel>Smoker
                <Mui.RadioGroup row name="smoker">
                    <Mui.FormControlLabel value="Yes" control={<Mui.Radio />} label="Yes" />
                    <Mui.FormControlLabel value="No" control={<Mui.Radio />} label="No" />
                </Mui.RadioGroup>
            </Mui.FormLabel>

            <Mui.FormLabel>Excercise
                <Mui.RadioGroup row name="excercise">
                    <Mui.FormControlLabel value="Yes" control={<Mui.Radio />} label="Yes" />
                    <Mui.FormControlLabel value="No" control={<Mui.Radio />} label="No" />
                </Mui.RadioGroup>
            </Mui.FormLabel>

            <Mui.FormLabel>Hyper Tension
                <Mui.RadioGroup row name="hyperTension">
                    <Mui.FormControlLabel value="Yes" control={<Mui.Radio />} label="Yes" />
                    <Mui.FormControlLabel value="No" control={<Mui.Radio />} label="No" />
                </Mui.RadioGroup>
            </Mui.FormLabel>

            <Mui.FormLabel>Heart Disease
                <Mui.RadioGroup row name="heartDisease">
                    <Mui.FormControlLabel value="Yes" control={<Mui.Radio />} label="Yes" />
                    <Mui.FormControlLabel value="No" control={<Mui.Radio />} label="No" />
                </Mui.RadioGroup>
            </Mui.FormLabel>

            <Mui.FormLabel>Diabetes
                <Mui.RadioGroup row name="diabetes">
                    <Mui.FormControlLabel value="Yes" control={<Mui.Radio />} label="Yes" />
                    <Mui.FormControlLabel value="No" control={<Mui.Radio />} label="No" />
                </Mui.RadioGroup>
            </Mui.FormLabel>

            <Mui.FormLabel>Marital Status
                <Mui.RadioGroup row name="maritalSatus">
                    <Mui.FormControlLabel value="Married" control={<Mui.Radio />} label="Married" />
                    <Mui.FormControlLabel value="Single" control={<Mui.Radio />} label="Single" />
                </Mui.RadioGroup>
            </Mui.FormLabel>

            <Mui.FormLabel>Working Status
                <Mui.RadioGroup row name="workingStatus">
                    <Mui.FormControlLabel value="Private" control={<Mui.Radio />} label="Private" />
                    <Mui.FormControlLabel value="Public" control={<Mui.Radio />} label="Public" />
                    <Mui.FormControlLabel value="Student" control={<Mui.Radio />} label="Student" />
                    <Mui.FormControlLabel value="Unemployed" control={<Mui.Radio />} label="Unemployed" />
                </Mui.RadioGroup>
            </Mui.FormLabel>


            <Mui.Button variant="contained" type="submit">Submit</Mui.Button>
        </Mui.Box>


    );
}


export default GenerateReportForm