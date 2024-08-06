"use client";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { provider, auth } from "@/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function landingPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const userSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
    } catch {
      console.error("There was an Error with Sign-In");
    }
  };

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

        {user ? (
          <Box display="flex" gap="40px">
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
                Continue to Pantry
              </Button>
            </Link>
            <Button
              onClick={userSignOut}
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
              Sign-out
            </Button>
          </Box>
        ) : (
          <Button
            onClick={userSignIn}
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
        )}
      </Box>
    </Box>
  );
}
