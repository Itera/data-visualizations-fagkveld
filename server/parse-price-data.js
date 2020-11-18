const csv = require("csv-parser");
const fs = require("fs");
const results = [];

fs.createReadStream("apple-price-data.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    console.log(results);
    fs.writeFileSync("./apple-price-data.json", JSON.stringify(results));
  });
