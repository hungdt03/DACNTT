# Hướng Dẫn Cài Đặt và Chạy Dự Án MXH

## 1. Yêu Cầu Hệ Thống
- **Backend:** .NET 8.0 hoặc mới hơn, SQL Server, Docker Desktop
- **Frontend:** Node.js (phiên bản mới nhất khuyến nghị)
- **Công cụ hỗ trợ:** Visual Studio 2022, VS Code, NuGet, npm

---
## 2. Cài Đặt Backend
### **Bước 1: Mở Backend trong Visual Studio**
1. Mở **Visual Studio**.
2. Chọn **Open a project or solution**, tìm thư mục `SocialNetwork.API` và mở dự án lên.

### **Bước 2: Cấu Hình Kết Nối Cơ Sở Dữ Liệu**
1. Mở file `appsettings.json` trong `SocialNetwork.API`.
2. Chỉnh sửa giá trị trong `ConnectionStrings` để phù hợp với SQL Server trên máy:
```json
"ConnectionStrings": {
  "MyDbConnection": "Server=.\\SQLEXPRESS;Database=SocialNetworkDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```
> ⚠️ **Lưu ý**: Thay `Server=.\SQLEXPRESS` thành tên SQL Server của bạn nếu khác.

### **Bước 3: Cài Đặt Migration và Cập Nhật Database**
1. Mở **Tools > NuGet Package Manager > Package Manager Console**.
2. Chạy lệnh sau để tạo migration:
```powershell
Add-Migration InitialCreate -Project SocialNetwork.Infrastructure -StartupProject SocialNetwork.API -OutputDir Persistence/Migrations
```
3. Chạy tiếp lệnh cập nhật database:
```powershell
Update-Database -Project SocialNetwork.Infrastructure -StartupProject SocialNetwork.API
```

### **Bước 4: Chạy Backend với Docker**
1. Đảm bảo **Docker Desktop** đã chạy.
2. Mở **Command Prompt** tại thư mục gốc của Solution và di chuyển vào thư mục `SocialNetwork.API`:
```sh
cd SocialNetwork.API
```
3. Chạy lệnh khởi động Docker:
```sh
docker-compose up -d
```
4. Trên Visual Studio, bấm nút **Start** để chạy server.
5. Khi **Swagger API** xuất hiện trên trình duyệt, server đã khởi động thành công.

---
## 3. Cài Đặt Frontend
### **Bước 1: Cài Đặt Thư Viện**
1. Đảm bảo **Node.js** đã được cài đặt trên máy.
2. Mở **Command Prompt**, di chuyển vào thư mục frontend `SocialNetwork.WebApp`:
```sh
cd path/to/SocialNetwork.WebApp
```
3. Chạy lệnh cài đặt thư viện:
```sh
npm install
```

### **Bước 2: Chạy Dự Án Frontend**
1. Sau khi cài đặt xong, chạy lệnh sau để khởi động frontend:
```sh
npm run dev
```
2. Mở trình duyệt và truy cập địa chỉ hiển thị trên console (thường là `http://localhost:5173`).

---
## 4. Kiểm Tra Hoạt Động
- Nếu cả **Backend** và **Frontend** đều chạy thành công:
  - Swagger API hiển thị trên trình duyệt.
  - Trang React hiển thị giao diện mạng xã hội.
- Nếu gặp lỗi, kiểm tra lại các bước hoặc chạy lại lệnh `docker-compose up -d`.


