import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import NotFoundImage from "../assets/images/404.png";

function NotFound() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      {/* Image Illustration */}
      <Box
        component="img"
        src={NotFoundImage}
        alt="404 Not Found"
        sx={{ width: "80%", maxWidth: 400, mb: 3 }}
      />

      {/* Heading */}
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        Oops! Page Not Found
      </Typography>

      {/* Subtitle */}
      <Typography variant="body1" color="text.secondary" gutterBottom>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>

      {/* Back to Home Button */}
      <Button
        variant="contained"
        size="large"
        component={Link}
        to="/"
        sx={{ mt: 3, px: 4 }}
      >
        Go Back Home
      </Button>
    </Container>
  );
}

export default NotFound;
