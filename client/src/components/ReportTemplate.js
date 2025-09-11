import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    Divider,
    Button,
    Card
} from '@mui/material';


const ReportTemplate = ({report}) => {

    return (
        <Box>
            <Box>
                
            <Typography variant="h3" sx={ {fontWeight: 600 }}>
                Report {report.date }
                </Typography>
            </Box>
                <Divider sx={{ borderColor: '#e0e0e0' }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Stroke: (Low, 10%)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Diabeties: (Low, 10%)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                CVD: (Low, 10%)
            </Typography>
            <Divider sx={{ borderColor: '#e0e0e0' }} />

            <Typography variant="h5">
                Lifestyle Recomendations
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Text
            </Typography>

            <Typography variant="h5">
                Exercise Recomendations
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Text
            </Typography>

            <Typography variant="h5">
                Diet Recomendations
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Text
            </Typography>

            <Typography variant="h5">
                Diet to Avoid
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Text
            </Typography>
            </Box>
    );
}

export default ReportTemplate