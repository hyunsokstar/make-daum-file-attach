const express = require("express");
const mime = require("mime-types");
const multer = require("multer");
const { v4: uuid } = require("uuid");

console.log("uuid : ", uuid());

const app = express();
const PORT = 5000;

// express.static("uploads") 으로 스태틱 폴더를 설정하면 uploads 폴더의 이미지에 url 로 접근할수 있게 된다.
app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  // filename: (req, file, cb) => cb(null, uuid()),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

// const upload = multer({ storage });
const upload = multer({
  storage,

});

// app.post("/upload", upload.single("imageTest"), (req, res) => {
// app.post("/upload", upload.single("image"), (req, res) => {
app.post("/upload", upload.array("image", 5), async (req, res) => {
  const files = req.files;

  console.log("files : " , files);
  res.json(req.file);
});

app.listen(PORT, () => console.log("Express server listening on PORT " + PORT));
