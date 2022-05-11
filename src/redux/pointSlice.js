const {createSlice} = require('@reduxjs/toolkit');

const points = createSlice({
  name: 'points',
  initialState: {
    value: 10,
  },
  reducers: {
    decrement: state => {
      state.value -= 1;
    },
    increamentByAmount: (state, action) => {
      state.value += action.payload;
    },
    decrementByAmount: (state, action) => {
      state.value -= action.payload;
    },
  },
});

export const {increamentByAmount, decrementByAmount, decrement} =
  points.actions;

export default points.reducer;