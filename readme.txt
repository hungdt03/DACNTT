Hướng Dẫn Cài Đặt và Chạy Dự Án MXH

1. Yêu Cầu Hệ Thống
Backend: .NET 8.0 hoặc mới hơn, SQL Server, Docker Desktop
Frontend: Node.js (phiên bản mới nhất khuyến nghị)
Công cụ hỗ trợ: Visual Studio 2022, VS Code, NuGet, npm

2. Cài Đặt Backend
Bước 1: Mở Backend trong Visual Studio
Mở Visual Studio.
Chọn Open a project or solution, tìm thư mục SocialNetwork.API và mở dự án lên.

Bước 2: Cấu Hình Kết Nối Cơ Sở Dữ Liệu
Mở file appsettings.json trong SocialNetwork.API.
Chỉnh sửa giá trị trong ConnectionStrings để phù hợp với SQL Server trên máy:
"ConnectionStrings": {
  "MyDbConnection": "Server=.\\SQLEXPRESS;Database=SocialNetworkDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
⚠️ Lưu ý: Thay Server=.\SQLEXPRESS thành tên SQL Server của bạn nếu khác.

Bước 3: Cài Đặt Migration và Cập Nhật Database
Mở Tools > NuGet Package Manager > Package Manager Console.

Chạy lệnh sau để tạo migration:
    Add-Migration InitialCreate -Project SocialNetwork.Infrastructure -StartupProject SocialNetwork.API -OutputDir Persistence/Migrations

Chạy tiếp lệnh cập nhật database:
    Update-Database -Project SocialNetwork.Infrastructure -StartupProject SocialNetwork.API

Bước 4: Chạy Backend với Docker
Đảm bảo Docker Desktop đã chạy.

Mở Command Prompt tại thư mục gốc của Solution và di chuyển vào thư mục SocialNetwork.API:
    cd SocialNetwork.API

Chạy lệnh khởi động Docker:
    docker-compose up -d

Trên Visual Studio, bấm nút Start để chạy server.
Khi Swagger API xuất hiện trên trình duyệt, server đã khởi động thành công.

3. Cài Đặt Frontend

Bước 1: Cài Đặt Thư Viện
Đảm bảo Node.js đã được cài đặt trên máy.
Mở Command Prompt tại thư mục gốc của Solution, di chuyển vào thư mục frontend SocialNetwork.WebApp:
    cd SocialNetwork.WebApp

Chạy lệnh cài đặt thư viện:
    npm install
    
Bước 2: Chạy Dự Án Frontend
Sau khi cài đặt xong, chạy lệnh sau để khởi động frontend:
    npm run dev
Mở trình duyệt và truy cập địa chỉ hiển thị trên console (thường là http://localhost:5173).

4. Kiểm Tra Hoạt Động
Nếu cả Backend và Frontend đều chạy thành công:
Swagger API hiển thị trên trình duyệt.
Trang React hiển thị giao diện mạng xã hội.
Nếu gặp lỗi, kiểm tra lại các bước hoặc chạy lại lệnh docker-compose up -d.