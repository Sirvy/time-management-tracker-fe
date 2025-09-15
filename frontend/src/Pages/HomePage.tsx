// import React from "react";
// import logo from '../Assets/logo.svg';
// import { Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { Button, Container, Typography, Box, AppBar, Toolbar } from '@mui/material';

import React from 'react';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center'
}));

const HeroSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(6),
    borderRadius: '8px',
    marginBottom: theme.spacing(4)
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: '8px'
}));

export const HomePage = () => {
    return (
        <StyledContainer>
            {/* Hero Section */}
            <HeroSection>
                <Typography variant="h1" component="h1" gutterBottom color="#1976D2">
                    TimeLance
                </Typography>
                <Typography variant="h5" component="p" gutterBottom>
                    Take Control of Your Day and Stop Wasting Time.
                </Typography>
                <Typography variant="h5" component="p" gutterBottom>
                    Track your habits, monitor your routines, and gain insight into how you spend your time.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ borderRadius: '20px', marginTop: '24px' }}
                >
                    Sign Up Free
                </Button>
            </HeroSection>

            {/* Features Section */}
            <Box my={6}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Why Choose TimeLance?
                </Typography>
                <Grid container spacing={4} my={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard elevation={4}>
                            <Typography variant="h6" component="h3">
                                Stop Wasting Time
                            </Typography>
                            <Typography component="p">
                                TimeLance empowers you to see exactly how you spend your day, helping you take back
                                control.
                            </Typography>
                        </FeatureCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard elevation={4}>
                            <Typography variant="h6" component="h3">
                                Daily Reflection
                            </Typography>
                            <Typography component="p">
                                Log your activities and get a clear view of your time usage, making it easier to
                                pinpoint areas for improvement.
                            </Typography>
                        </FeatureCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard elevation={4}>
                            <Typography variant="h6" component="h3">
                                Better Yourself
                            </Typography>
                            <Typography component="p">
                                With TimeLance, you can track how much time you spend on distractions versus meaningful
                                activities.
                            </Typography>
                        </FeatureCard>
                    </Grid>
                </Grid>
            </Box>

            <Box my={8}>

                <Typography variant="h5" component="p" gutterBottom>
                    See exactly where your time goes.
                </Typography>

                <img src="timelance.webp" alt="TimeLance"
                     style={{ 'boxShadow': '5px 5px 10px gray', 'marginTop': '24px' }} />
            </Box>
        </StyledContainer>
    );
};


// export const HomePage0 = () => {
//     const { isAuthenticated } = useAuth();

//     return (
//         <Container maxWidth="md">
//             <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
//                 <img src={logo} alt="logo" style={{ width: '150px', height: '150px' }} />
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Welcome to TimeLance
//                 </Typography>
//                 <Typography variant="subtitle1" component="p" gutterBottom>
//                     Your ultimate tool for time management and productivity improvement
//                 </Typography>
//                 {!isAuthenticated ? (
//                     <Box mt={2}>
//                         <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mr: 2 }}>
//                             Login
//                         </Button>
//                         <Button variant="outlined" color="primary" component={Link} to="/register">
//                             Register
//                         </Button>
//                     </Box>
//                 ) : (
//                     <Box mt={2}>
//                         <Button variant="contained" color="primary" component={Link} to="/user/profile" sx={{ mr: 2 }}>
//                             Profile
//                         </Button>
//                         <Button variant="outlined" color="secondary" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>
//                             Logout
//                         </Button>
//                     </Box>
//                 )}
//             </Box>
//         </Container>
//     );
// }