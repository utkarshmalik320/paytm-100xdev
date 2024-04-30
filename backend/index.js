const express = require('express');
const cors =  require('cors');

app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index");

const app = express();

app.use("/api/v1" , mainRouter);
app.listen(3000);





// const app = express();
// const PORT = process.env.PORT || 3000; 

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });