import{createSlice}from "@reduxjs/toolkit"

const initialState={
    bookings:[],
    bookingDetails:{},
    loading:false,
}
const bookingSlice =createSlice({
    name:"booking",
    initialState,
    reducers:{
        setBookings(state,action){
           state.bookings=action.payload;
        },
        addBooking:(state,action)=>{
            state.bookings.push(action.payload);

        },
        setBookingDetails:(state,action)=>{
            state.bookingDetails=action.payload.booking;
        }
    }
})

export const{setBookings,addBooking,setBookingDetails}=bookingSlice.actions;
export default bookingSlice;