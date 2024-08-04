"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Typography,
  Stack,
  Button,
  palette,
  TextField,
} from "@mui/material";
import {
  query,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { FaPlus, FaMinus, FaXmark } from "react-icons/fa6";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const updatePantry = async () => {
    const snap = query(collection(firestore, "inventory"));
    const docs = await getDocs(snap);

    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setPantry(inventoryList);
  };

  const increaseQuantity = async (itemId) => {
    const docRef = doc(collection(firestore, "inventory"), itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let itemQuantity = docSnap.data().quantity;
      itemQuantity += 1;

      await updateDoc(docRef, {
        quantity: itemQuantity,
      });
    } else {
      alert("Increase Count Item Doesn't exist");
    }

    await updatePantry();
  };

  const decreaseQuantity = async (itemId) => {
    const docRef = doc(collection(firestore, "inventory"), itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let itemQuantity = docSnap.data().quantity;
      itemQuantity -= 1;

      if (itemQuantity > 0) {
        await updateDoc(docRef, {
          quantity: itemQuantity,
        });
      } else {
        await deleteDoc(docRef);
      }
    } else {
      alert("Decrease Count Item Doesn't exist");
    }

    await updatePantry();
  };

  const changeOpenAdd = () => {
    setOpenAdd(!openAdd);
  };

  const clearSearch = () => {
    setSearchName("");
  };

  useEffect(() => {
    updatePantry();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        border="1px solid black"
        width="100%"
        maxWidth="800px"
        minHeight="500px"
        borderRadius="5px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="15px"
        p="10px"
        m="10px"
      >
        {/*Header*/}
        <Box
          display="flex"
          justifyContent="space-between"
          p="10px 15px"
          width="100%"
          border="1px solid black"
        >
          <Typography variant="h3">Pantry Tracker</Typography>
          <Button
            onClick={changeOpenAdd}
            sx={{
              color: "#FFF",
              bgcolor: openAdd ? "red" : "green",
              p: "5px 10px",
              "&:hover": {
                bgcolor: openAdd ? "#840000" : "#004B00",
              },
            }}
          >
            {openAdd ? "Close" : "Add"}
          </Button>
        </Box>

        {/*Foods*/}
        <Box
          p="10px 15px"
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="10px"
          border="1px solid black"
        >
          {/* Search Function */}
          <Box
            width="100%"
            display="flex"
            justifyContent="space-around"
            gap="15px"
            mb="10px"
          >
            <TextField
              variant="outlined"
              fullWidth
              p="5px 10px"
              size="small"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Button
              onClick={clearSearch}
              sx={{
                color: "#FFF",
                bgcolor: "#4169E1",
                p: "5px 10px",
                "&:hover": {
                  bgcolor: "#00035B",
                },
              }}
            >
              Clear
            </Button>
          </Box>

          {/* Food Display */}
          {pantry.map((food) => (
            <Box
              key={food.id}
              width="80%"
              p="8px 10px 8px 20px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              border="1px solid black"
              borderRadius="5px"
            >
              <Box>
                <Typography variant="h6">{food.foodName}</Typography>
                <Typography variant="subtitle1">
                  Quantity: {food.quantity}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-around"
                minWidth="125px"
                fontSize="20px"
              >
                <FaPlus
                  color="green"
                  cursor="pointer"
                  onClick={() => {
                    increaseQuantity(food.id);
                  }}
                />
                <FaMinus
                  color="orange"
                  cursor="pointer"
                  onClick={() => {
                    decreaseQuantity(food.id);
                  }}
                />
                <FaXmark color="red" />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
