import AccountApprovalTable from "../components/administrator/AccountApprovalTable";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Container
} from "@mui/material";

const AdministratorApproval = () => {
  return (
    <Container
      maxWidth={false}
      variant="gradient"
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        pt: 1,
        pl: 5,
      }}
    >
      <Box
        sx={{
          pt: { xs: "65px", sm: "67px", md: "75px" },
          pl: { xs: "45px", sm: "62px", md: "70px" },
          pb: { xs: "2px", sm: "0px", md: "4px" },
          pr: { xs: "2px", sm: "0px", md: "4px" },
          mr: "0px",
        }}
      >
        <Stack spacing={1} sx={{ width: "100%", mb: 3 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: "2em", sm: "2em", md: "3em" } }}
          >
            Partner Access Requests
          </Typography>
          <Divider />
        </Stack>
        <AccountApprovalTable />
      </Box>
    </Container>
  );
};

export default AdministratorApproval;
