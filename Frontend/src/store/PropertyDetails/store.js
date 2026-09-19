import { configureStore} from "@reduxjs/toolkit";
import propertyReducer from "./property-slice.js";
import { propertyDetails } from "../../store/Property/propertyDetails-action";
const store = configureStore({
    reducer:{
        properties:propertyReducer,
    },
})


export default store;