const express = require("express");
var bodyParser = require("body-parser");
const googleTrends = require("google-trends-api");
const app = express();

app.use(bodyParser.json());

app.post("/gt", (req, res) => {
  // const searchWord = req.body.searchWord;
  let keyWords = req.body.keyWords.filter(
    (w) => typeof w === "string" && w.length > 0
  );
  if (keyWords.length === 1) {
    keyWords = keyWords[0];
  }
  console.log("Key words: ", keyWords);
  googleTrends
    .interestOverTime({ keyword: keyWords })
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.statusCode = 400;
      res.send("Failed to get interest over time");
    });
});

app.listen(5000);

/*
    explorer.past30Days().searchProvider(gTrends.SearchProviders.News)
    .addKeyword('Cats')
    .addKeyword('Dogs')
    .download().then((csv: string) => {
        console.log(csv)
    });
    */
