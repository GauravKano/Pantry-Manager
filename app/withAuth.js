import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Typography } from "@mui/material";

const WithAuth = (WrappedComponent) => {
  const AuthHoc = (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      // Update when Auth State Changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/"); // Push back to Home
        } else {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, [router]);

    //In between Home and Main
    if (loading) {
      return (
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          className="mainPage"
        >
          <Typography variant="h2" fontSize="80px" pb="50px">
            Loading...
          </Typography>
        </Box>
      );
    }

    // Return the Wrapped Content
    return <WrappedComponent {...props} />;
  };

  // Helps Debug Vercel
  AuthHoc.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthHoc;
};

export default WithAuth;
