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

export default function Main() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [addError, setAddError] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  // Update Pantry
  // const updatePantry = async () => {
  //   const snap = query(collection(firestore, "inventory"));
  //   const docs = await getDocs(snap);

  //   const inventoryList = [];
  //   docs.forEach((doc) => {
  //     inventoryList.push({
  //       id: doc.id,
  //       ...doc.data(),
  //     });
  //   });

  //   setPantry(inventoryList);
  // };

  const updateSearchPantry = async (searchItemName) => {
    setLoading(true);
    const snap = query(collection(firestore, "inventory"));
    const docs = await getDocs(snap);

    searchItemName = searchItemName.trim().replace(/\s+/g, " ").toLowerCase();
    const inventoryList = [];

    docs.forEach((doc) => {
      if (doc.data().foodName.toLowerCase().includes(searchItemName)) {
        inventoryList.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    });

    setPantry(inventoryList);
    setLoading(false);
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

      await updateSearchPantry(searchName);
    } else {
      alert("Increase Count Item Doesn't exist");
    }
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

      await updateSearchPantry(searchName);
    } else {
      alert("Decrease Count Item Doesn't exist");
    }
  };

  // Delete Item
  const deleteItem = async (itemId) => {
    const docRef = doc(collection(firestore, "inventory"), itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);

      await updateSearchPantry(searchName);
    } else {
      alert("Delete Item Doesn't exist");
    }
  };

  //Add Item
  const addItem = async () => {
    const inventoryRef = collection(firestore, "inventory");
    const addItemName = itemName.trim().replace(/\s+/g, " ");
    const addItemQuantity = Number(itemQuantity);
    await addDoc(inventoryRef, {
      foodName: addItemName,
      quantity: addItemQuantity,
    });

    setItemName("");
    setItemQuantity(1);

    await updateSearchPantry(searchName);
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
    updateSearchPantry("");
  };

  // Update when Starting
  useEffect(() => {
    updateSearchPantry(searchName);
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
        // border="1px solid black"
        width="100%"
        height="95%"
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
          p="10px 15px 10px 25px"
          width="100%"
          sx={{ borderBottom: "1px solid grey" }}
        >
          <Typography
            variant="h3"
            sx={{ fontSize: "clamp(2rem, 7vw, 2.7rem)" }}
          >
            Pantry Tracker
          </Typography>
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
              <Box flex="6">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "clamp(14px, 3vw, 18px)" }}
                >
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
                      fontSize: "clamp(.9rem, 3vw, 1rem)",
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
              <Box flex="4">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "clamp(14px, 3vw, 18px)" }}
                >
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
                  sx={{ fontSize: "clamp(.9rem, 3vw, 1rem)" }}
                />
              </Box>
            </Box>
            <Button
              sx={{
                width: "100%",
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
          p="15px 30px"
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="10px"
          // border="1px solid black"
          overflow="hidden"
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
              placeholder="Search Food Item"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                updateSearchPantry(e.target.value);
              }}
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

          <Box
            minHeight="300px"
            overflow="auto"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="10px"
            width="100%"
            height="100%"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#a1a1a1",
                },
              },
            }}
          >
            {loading ? (
              <Typography fontSize="20px">Loading...</Typography>
            ) : pantry.length === 0 ? (
              <Typography fontSize="20px">No Items Found</Typography>
            ) : (
              pantry.map((food) => (
                <Box
                  key={food.id}
                  width="95%"
                  p="8px 10px 8px 20px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  border="1px solid black"
                  borderRadius="5px"
                  gap="10px"
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: "clamp(1rem, 4vw, 1.4rem)" }}
                    >
                      {food.foodName}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "clamp(.9rem, 3vw, 1.1rem)" }}
                    >
                      Quantity: {food.quantity}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-around"
                    fontSize="20px"
                    minWidth={{ xs: "100px", md: "150px", sm: "125px" }}
                    sx={{
                      fontSize: "clamp(18px, 3vw, 22px)",
                    }}
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
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
