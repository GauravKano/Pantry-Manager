"use client";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { provider, auth } from "@/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //Handle Changes in Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    //Get 1% of screen vh
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh(); // Set initially

    window.addEventListener("resize", setVh);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", setVh);
    };
  }, []);

  // Handle Sign In
  const userSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
    } catch {
      console.error("There was an Error with Sign-In");
    }
  };

  // Handle Sign Out
  const userSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      console.error("There was an Error with Sign-Out");
    }
  };

  return (
    <Box
      width="100vw"
      height="calc(var(--vh, 1vh) * 100)"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="15px"
      p="10px"
      pb="40px"
      textAlign="center"
      className="mainPage"
    >
      {/* Show Welcome Header */}
      <Typography variant="h2" fontSize="80px">
        Welcome!
      </Typography>
      <Typography variant="h6" mb="30px" fontSize="24px" fontWeight="400">
        Your ultimate tool for effortless pantry and inventory management
      </Typography>

      {user ? (
        //Show Buttons Once Signed in
        <Box display="flex" gap={{ xs: "20px", sm: "40px" }}>
          <Link href="/main">
            <Button
              sx={{
                fontSize: "clamp(13.5px, 3vw, 20px)",
                color: "#FFF",
                bgcolor: "#00B2FF",
                p: "10px 25px",
                "&:hover": {
                  bgcolor: "#0075FF",
                },
              }}
            >
              Continue to Pantry
            </Button>
          </Link>
          <Button
            onClick={userSignOut}
            sx={{
              fontSize: "clamp(13.5px, 3vw, 20px)",
              color: "#FFF",
              bgcolor: "#00B2FF",
              p: "10px 25px",
              "&:hover": {
                bgcolor: "#0075FF",
              },
            }}
          >
            Sign-out
          </Button>
        </Box>
      ) : (
        //Show Sign in Button
        <Button
          onClick={userSignIn}
          sx={{
            fontSize: "20px",
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
      )}
    </Box>
  );
}
