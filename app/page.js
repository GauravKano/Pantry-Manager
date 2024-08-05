"use client";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function landingPage() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="mainPage"
    >
      <Box
        // border="1px solid black"
        width="100%"
        height="50%"
        maxWidth="800px"
        minHeight="500px"
        borderRadius="5px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="15px"
        p="10px"
        pb="40px"
        m="10px"
        textAlign="center"
      >
        <Typography variant="h2" fontSize="80px">
          Welcome!
        </Typography>
        <Typography variant="h6" mb="30px" fontSize="24px" fontWeight="400">
          Your ultimate tool for effortless pantry and inventory management
        </Typography>

        <Link href="/main">
          <Button
            sx={{
              fontSize: "16px",
              color: "#FFF",
              bgcolor: "#00B2FF",
              p: "10px 25px",
              "&:hover": {
                bgcolor: "#0075FF",
              },
            }}
          >
            Sign-in
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
