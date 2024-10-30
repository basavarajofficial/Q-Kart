import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Box
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

// ---------dummy data---------
// let product={
//   "name":"Tan Leatherette Weekender Duffle",
//   "category":"Fashion",
//   "cost":150,
//   "rating":4,
//   "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//   "_id":"PmInA797xJhMIPti"
//   }
const ProductCard = ({ product, handleAddToCart }) => {
  
  // console.log("product img:");
  // // console.log(product);
  // console.log(product.image);
  return (
    // refer notes below
    <Card className="card">
    <CardMedia
        component="img"
        image={product.image}
        alt="product"
      />      
   <CardContent>
        <Typography gutterBottom variant="body2" component="div">
          {product.name}
        </Typography>
        <Typography
          variant="h6"
          color="textPrimary"
          sx={{ fontWeight: "bold" }}
          mb={1}
        >
          ${product.cost}
        </Typography>
        <Box display="flex">
          <Rating
            name="read-only"
            value={product.rating}
            readOnly
            size="small"
          />
          <Box sx={{ ml: 1 }}>({product.rating})</Box>
        </Box>
      </CardContent>
      <CardActions className="card-actions">
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={(e)=>handleAddToCart()}
          className="card-button"
        >
          <AddShoppingCartOutlined /> &nbsp; ADD TO CART
        </Button>
      </CardActions>
    </Card> 
  );
};

export default ProductCard;


// ----------------notes---------------------
// <Typography gutterBottom variant="body2" component="div">
// This component is used for displaying the product name. 
// The gutterBottom prop adds some spacing at the bottom of the text. 
// The variant prop sets the text style to "body2," which is a smaller and less prominent text style. 
// The component prop specifies that this is a "div" element. 

//<Box sx={{ ml: 1 }}>({product.rating})</Box>
// This is a box element used to display the number of ratings next to the star rating. 
// The ml prop adds left margin to separate it from the star rating.

// <AddShoppingCartOutlined /> &nbsp; ADD TO CART
// This code should provide you with a button containing the shopping cart icon and 
// the "ADD TO CART" label using Material-UI components.




/*
Address API
Get:
curl 'http://localhost:8082/api/v1/user/addresses' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFwb29ydmEiLCJpYXQiOjE2OTkxNzI1NjEsImV4cCI6MTY5OTE5NDE2MX0.iBWu40HyVDGJrZGjngNY-E-UttjNBzPtS_gFiXhPJtQ' \

O/P: [{"_id":"PibT8nJFigjMso9gdcS2P","address":"Test address\n12th street, Mumbai"},{"_id":"SwjYoyY6LzivUNl2VQVC8","address":"NewTest addresMore\n14th street, Bangalore"}]


Post:
curl 'http://localhost:8082/api/v1/user/addresses' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFwb29ydmEiLCJpYXQiOjE2OTkxNzI1NjEsImV4cCI6MTY5OTE5NDE2MX0.iBWu40HyVDGJrZGjngNY-E-UttjNBzPtS_gFiXhPJtQ' \
  -H 'Content-Type: application/json' \
  --data-raw '{"address":"Test address\n12th street, Mumbai"}' \

O/P:[{"_id":"PibT8nJFigjMso9gdcS2P","address":"Test address\n12th street, Mumbai"}]

curl 'http://localhost:8082/api/v1/user/addresses' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFwb29ydmEiLCJpYXQiOjE2OTkxNzI1NjEsImV4cCI6MTY5OTE5NDE2MX0.iBWu40HyVDGJrZGjngNY-E-UttjNBzPtS_gFiXhPJtQ' \
  -H 'Content-Type: application/json' \
  --data-raw '{"address":"NewTest addresMore\n14th street, Bangalore"}' \





eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFwYXJuYSIsImlhdCI6MTY5OTE3MjI1NCwiZXhwIjoxNjk5MTkzODU0fQ.lVM6E4LtM3zplO9POACIbCvigtZCcRtrjb7Maibmifc

*/

