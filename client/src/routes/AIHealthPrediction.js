import ReportTemplate from "../components/ReportTemplate";
import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    Divider,
    Button,
    Avatar,
    Switch,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Stack,
} from '@mui/material';

const AIHealthPrediction = ({ }) => {

    // dummy report data
    const report = [{
        id: 0,
        date: '11/09/2025'
    },
    {
        id: 1,
        date: '7/09/2025'
    },
    {
        id: 2,
        date: '3/09/2025'
    },
    ]
    const [selectedReport, setSelectedReport] = useState(report[0]);
    console.log(selectedReport)

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
                    {report.map((item) =>
                        <ListItem key={item.id} selected={selectedReport.id === item.id}
                            onClick={() => setSelectedReport(item)}
                            button
                            sx={{
                                py: 2,
                                px: 3,
                                borderLeft:
                                    selectedReport.id === item.id ? '4px solid' : '4px solid transparent',
                                borderLeftColor: 'primary.main',
                                bgcolor: selectedReport.id === item.id ? 'action.selected' : 'transparent',
                            }}
                        >
                            <ListItemText
                                primary={`Report: ${item.date}`}
                                slotProps={{
                                    primary: {
                                        style: {
                                            fontWeight: selectedReport.id === item.id ? 600 : 400,
                                        },
                                    },
                                }}
                            />
                        </ListItem>
                    )}
                </List>
            </Box>
            {/* Report Content */}
            <ReportTemplate report = {selectedReport} />
        </Box>
    );

}

export default AIHealthPrediction
