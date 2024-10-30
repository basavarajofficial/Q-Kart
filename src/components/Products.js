import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart"
import {generateCartItemsFrom} from "./Cart";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  // Original products list fetched from API
  const [productDetails, setProductDetails] = useState([]);

  //filtered list after user tried to search somthing by product category/name.
  const [filteredProduct, setFilteredProduct]= useState([]);

  //timer for debounce search
  const [debounceTime, setDebounceTime]= useState(0);

 //  Loading Animation
 const [isLoading, setIsLoading] = useState(false);

 // cart items for a user
 const [cartItem, setCartItem]= useState([]);

 //to call FetchCart fucntion in useEffect when "", henec use the below state in dependency array:
 const [cartLoad, setcartLoad]= useState(false);

 // to use snackbar 
  const { enqueueSnackbar } = useSnackbar();
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username");

  //dummy data for use
  let product = {
    name: "Tan Leatherette Weekender Duffle",
    category: "Fashion",
    cost: 150,
    rating: 4,
    image:
      "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
    _id: "PmInA797xJhMIPti",
  };

 

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);
    try {
      
      let response = await axios.get(`${config.endpoint}/products`);

      // console.log(response.data);
      
      setProductDetails(response.data);
      setFilteredProduct(response.data);
      // console.log({productDetails});
       // Fetch cartItems
      setcartLoad(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
    //End loading
    setIsLoading(false);
    // return productDetails;
    
  };

  
  // //intial api call to populate the products on product page
  useEffect(() => {
    
    performAPICall();
  }, []);

  // //get req to fetch cart items for a logged in user
  useEffect(()=>{
         fetchCart(token)
  },[cartLoad]);

  //-------------------------------------
  //a better logic using useEffect to call performAPICall then fetchCart and finally generateCartItemsFrom
  // useEffect(()=>{
  //   const onLoadHandler= async()=>{
  //     const productsData=await performAPICall();
  //     const cartData=await fetchCart(token);

  //     console.log("cartData:",cartData);
  //     const finalArray=generateCartItemsFrom(cartData,productsData);
  // setCartItem(finalArray);
  //  }
  //  onLoadHandler();
  // },[]) ;
//------------------------------


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setIsLoading(true);
    try {
      
      // console.log(text);
      let response = await axios.get(`${config.endpoint}/products/search?value=${text}`);

      setFilteredProduct(response.data);
    }
    
     catch (error) {

      //https://stackoverflow.com/questions/39153080/how-can-i-get-the-status-code-from-an-http-error-in-axios/39153411#39153411
      // console.log(JSON.stringify(error)); use these two options to tap into error object returned from axios.
      if (error.response) {
        //if product not found, show nothing
        if (error.response.status === 404) {
          setFilteredProduct([]);
          //now since (filteredProduct.length) is zero, hence only no product found will be there :(
        }

        //if server side error, then show full product list
        if (error.response.status === 500) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
          setFilteredProduct(productDetails);
        }
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
    setIsLoading(false);


  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTime
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeId) => {
    
    //stored the entered keyword by user

    var text=event.target.value;
    // console.log("text :");
    // console.log(text);

    //debounce logic
    if(debounceTimeId){
      clearTimeout(debounceTimeId);

    }

    const newTimeOut= setTimeout(()=>{performSearch(text)},500);

    setDebounceTime(newTimeOut);
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
  
      let response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        //Update cartItems
        console.log("response :",response);
       
        // return response.data;
        // console.log('fetchCart: generateCartItemsFrom ',generateCartItemsFrom(response.data,productDetails));
        setCartItem(generateCartItemsFrom(response.data,productDetails));
        // console.log("CartItem :",cartItem);
      }

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i=0;i<items.length;i++){
      if(items[i].productId===productId){
        return true;
      }
    }
    return false;
     
      
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  //we will call this function (addToCart) inside another helper function ie: handleCart and pass this handleCart to ProductCard fucntion (as a prop) so that when
  // "add to cart" button gets clicked (on any product card) that passed fucntion (handleCart) will get called.
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty=1,
    options = { preventDuplicate: false }
  ) => {
    //check if user is logged in

    if(token){
      //now check if item is already in the cart or 
       if(isItemInCart(items, productId)){
         enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "error",
          }
        );
       }
       else{
         //make post req with product id and qty
          addInCart(productId,qty);
       }
     
     }
    else{
      // 
      enqueueSnackbar(
        "Login to add an item to the Cart",
        {
          variant: "error",
        }
      );

    }
  };


  //helper function for addToCart (addition to the cart logic here)
  const addInCart=async(productId,qty)=>{
    // console.log("qty passed in addInCart:",qty);
     try{
      let response= await axios.post(
        `${config.endpoint}/cart` ,
        {
          productId:productId,
          qty:qty
         },
         {
          headers: {
            Authorization: `Bearer ${token}`,
          }

         }

      );
      //update the cart items again
      setCartItem(generateCartItemsFrom(response.data,productDetails)); 
     }
     catch(e){
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;

     }
  }

  //another helper function to be passed as a prop to ProductCard, and we are taking productId form travesing filteredItems array.
  let handleCart=(productId)=>{
    addToCart(
      token,
      cartItem,
      productDetails,
      productId
      // 1
    );
  }

//helper function to handle the quantity of products ie + and - buttons will use this function(to add or remove quantity) and ultimately this function will call addInCart
const handleQuantity=(productId,qty)=>{
  // console.log("productId and qty in handleQuantity: "+productId+" "+qty);
  addInCart(productId,qty);
}
  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          // sx={{ m: 1, width: '50ch' }}
          
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
         
          // value={searchValue} ,since passing event from here, hence on need to give value
           //here debounceTime is a state we have declared
          onChange={(e) => debounceSearch(e, debounceTime)}
        />
        </Header>
        {/* The main way is with an "InputAdornment", This can be used to add a prefix, a suffix, or an action to an input. For instance, you can use an icon button to hide or reveal the password. */}
      
      

      {/* Search view for desktop, we are passing this <TextField/> code from here, and access this textField in header with the "chidren" keyword */}
      {/* also we need to show this search bar only when we are on the product page + "hasHiddenAuthButtons" is not passed from here to header, 
      hence that will be undefined when used in header.js, 
      but if we do this: {hasHiddenAuthButtons} ,  then it will be harmless, bcz undefined is inside {}*/}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTime)}
      />
      {/* here our main container grid starts */}
      <Grid container>
        {/* first item in main grid */}
        <Grid
          item
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          xs
          md
          // OR: md={token && productDetails.length>0 ? 9 : 12}
        >
        <Grid item className="product-grid" >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        {/* used a loading condition here to show loading during api call else show products */}
        {isLoading ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{margin:"auto"}}
            py={10}
          >
            <CircularProgress size={30} />
            <h4> Loading Products... </h4>
          </Box>
        ) : (
          // now show filtered products OR products using another grid...2nd item in main container grid
            //also check if filtered product array is not empty 

            
            <Grid
            container
            item
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="center"
            my={3}
          >
          {
            filteredProduct.length ? (
            filteredProduct.map((product) => (
              <Grid item key={product["_id"]} xs={6} md={3}>
                <ProductCard 
                product={product} 
                //taking _id from above
                handleAddToCart={(event)=>handleCart(product["_id"])}
                />
              </Grid>
            ))
          ):(
            <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  py={10}
                  sx={{margin: "auto"}}
                >
                  <SentimentDissatisfied size={40} />
                  <h4>No products found</h4>
                </Box>

          )}
          
      </Grid>
      )}
      </Grid>
      {/* second grid item of main conatiner grid...show only when there is a user logged in */}
      {username && (
      <Grid
        container
        item
        xs={12}
        md={3} //bcz after log out we want our main grid to take whole width
        style={{ backgroundColor: "#E9F5E1", height: "100vh" }}
        justifyContent="center"
        alignItems="stretch"
        >
        {/* cart component */}
            <Cart 
          products={productDetails}
          items={cartItem}
          handleQuantity={handleQuantity}
          />
        
        </Grid>
        )}
      </Grid>

      <Footer/>
    </div>
  );
};

export default Products;
