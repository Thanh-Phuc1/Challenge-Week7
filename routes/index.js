const express = require('express');
const sendResponse = require('../helpers/utility');
const router = express.Router();
const fs = require("fs");

// const loadData = () => {
//   let db = fs.readFileSync("data.json", "utf8");
// return JSON.parse(db);

// };
// console.log(loadData())

router.get("/", function (req, res, next)  {
  return sendResponse(200,{}, "Home", res, next)
});

const companiRoutes = require("./compani.api.js");
router.use("/company", companiRoutes);



module.exports = router;
