import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "1234",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
let currentDate = new Date()
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
const day = currentDate.getDate();

// Format the date as a string (e.g., "YYYY-MM-DD")
const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;


app.get("/", async (req, res) => {
  const result = await db.query("select * from list order by id asc");
  items = result.rows;
  
  res.render("index.ejs", {
    listTitle: formattedDate,
    listItems: items,
  });
}); 

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
 
    await db.query("insert into list (title) values ($1)",[item]);
    res.redirect("/");

  
});

app.post("/edit", async (req, res) => {
  const item_title = req.body.updatedItemTitle;
  const item_id = req.body.updatedItemId;
  await db.query("update list set title = ($1) where id = ($2)",[item_title,item_id]);
  res.redirect('/')

});

app.post("/delete",async (req, res) => {
  const item_id = req.body.deleteItemId;
  await db.query("delete from list where id = ($1)",[item_id]);
  res.redirect('/')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
