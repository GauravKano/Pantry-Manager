"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, Button, TextField } from "@mui/material";
import {
  query,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { FaPlus, FaMinus, FaXmark } from "react-icons/fa6";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [addError, setAddError] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  // Update Pantry
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

  // Increase Quantitiy of Item
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

  // Decrease Quantitiy of Item
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

  // Delete Item
  const deleteItem = async (itemId) => {
    const docRef = doc(collection(firestore, "inventory"), itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    } else {
      alert("Delete Item Doesn't exist");
    }

    await updatePantry();
  };

  //Add Item
  const addItem = async () => {
    const inventoryRef = collection(firestore, "inventory");

    await addDoc(inventoryRef, {
      foodName: itemName,
      quantity: itemQuantity,
    });

    setItemName("");
    setItemQuantity(1);

    await updatePantry();
  };

  // Open Add Item Page
  const changeOpenAdd = () => {
    setOpenAdd(!openAdd);
    if (!openAdd) {
      setAddError(false);
    }
  };

  // Clear the Search Bar
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

        {/* Add Page */}
        {openAdd && (
          <Box
            p="15px 30px 20px"
            width="100%"
            border="1px solid black"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="20px"
          >
            <Box display="flex" justifyContent="center" gap="20px" width="100%">
              <Box maxWidth="400px" flex="1">
                <Typography variant="h6" fontSize="18px">
                  Enter Food Name:
                </Typography>
                <TextField
                  variant="outlined"
                  p="5px 10px"
                  placeholder="Ex: Mashed Potato"
                  fullWidth
                  size="small"
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: addError ? "red" : "rgba(0, 0, 0, 0.23)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: addError ? "red" : "rgba(0, 0, 0, 0.87)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: addError ? "red" : "#3f51b5",
                      },
                    },
                  }}
                />
              </Box>
              <Box maxWidth="150px" flex="1">
                <Typography variant="h6" fontSize="18px">
                  Enter Quantity:
                </Typography>
                <TextField
                  type="number"
                  variant="outlined"
                  placeholder="Ex: 1"
                  size="small"
                  fullWidth
                  value={itemQuantity}
                  onChange={(e) => {
                    const setValue = e.target.value;
                    if (setValue === "" || setValue > 0) {
                      setItemQuantity(e.target.value);
                    } else {
                      setItemQuantity(1);
                    }
                  }}
                  onBlur={() => {
                    if (itemQuantity === "" || itemQuantity <= 0) {
                      setItemQuantity(1);
                    }
                  }}
                  onKeyDown={(e) => {
                    const invalidChars = ["+", "-", "E", "e", ".", ","];
                    if (invalidChars.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Box>
            </Box>
            <Button
              sx={{
                width: "80%",
                color: "#FFF",
                bgcolor: "black",
                p: "5px 10px",
                "&:hover": {
                  bgcolor: "grey",
                },
              }}
              onClick={() => {
                if (itemName === "") {
                  setAddError(true);
                } else {
                  setAddError(false);
                  addItem();
                }
              }}
            >
              Add Item
            </Button>
          </Box>
        )}

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
            width="90%"
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
              placeholder="Search Food Item"
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
                <FaXmark
                  color="red"
                  cursor="pointer"
                  onClick={() => {
                    deleteItem(food.id);
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
