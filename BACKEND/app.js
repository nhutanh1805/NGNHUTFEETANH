const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error"); 

// 1. IMPORT ROUTES MỚI
const storyRouter = require("./app/routes/story.route"); // <-- ĐÃ THÊM DÒNG NÀY

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ecommerce application." });
});

// 2. SỬ DỤNG ROUTES
app.use("/api/stories", storyRouter); // <-- ĐÃ THÊM DÒNG NÀY

// Middleware xử lý lỗi 404 (Phải nằm sau tất cả các route đã định nghĩa)
app.use((req, res, next) => {
    // Nếu request không khớp với bất kỳ route nào ở trên, nó sẽ rơi vào đây
    return next(new ApiError(404, "Resource not found"));
});


// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;