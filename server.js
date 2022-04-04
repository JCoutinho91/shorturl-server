const app = require("./app");

//! Sets the PORT for our app to have access to it.
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server Running On Port http://localhost:${PORT}`);
});
