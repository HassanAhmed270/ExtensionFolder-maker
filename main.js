const express = require('express');
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// view engine set karna (EJS ke liye)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files serve karne ke liye
app.use(express.static(__dirname));

// ✅ Home route (form show karega)
app.get("/", (req, res) => {
  res.render("index", { msg: "" });
});

// ✅ Browse route (files move karega aur msg bhej dega)
app.get("/browse", (req, res) => {
  const folder = req.query.myValue;  
  if (!folder) return res.render("index", { msg: "❌ Please provide a folder path" });

  fs.readdir(folder, (err, files) => {
    if (err) {
      return res.render("index", { msg: "❌ Error reading folder!" });
    }

    files.forEach(f => {
      let ext = path.extname(f).slice(1) || "others";
      let destDir = path.join(folder, ext);

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
      }

      let oldpath = path.join(folder, f);
      let newpath = path.join(destDir, f);

      fs.rename(oldpath, newpath, (err) => {
        if (err) console.error("Cannot Move:", f);
      });
    });

    // ✅ Browser ko msg wapas bhejna
    res.render("index", { msg: "✅ Files Moved Successfully!" });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
