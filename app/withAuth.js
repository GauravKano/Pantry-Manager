import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Typography } from "@mui/material";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/");
        } else {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, [router]);

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

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
