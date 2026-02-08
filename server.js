const express = require('express');
const path = require('path');
const app = express();
const PORT = 3838; // Standard web port (requires sudo)

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frog Game live at http://socioskop.dk/frog-game`);
});

