Tầng API: 
  - Định nghĩa các filter, middleware
  - Đăng kí các đepenencies
  - Định nghĩa endpoint, forward request người dùng tới tầng Application thông qua MediatR, sau đó nhận response từ tầng Application và trả về cho client.

Tầng Application (Use case)
  - Tầng này chịu trách nhiệm xử lí nghiệp vụ (business logic)
  - Chứa các interface nghiệp vụ của ứng dụng

Tầng Infrastructure 
  - Tầng này chịu trách nhiệm quản lí Dbcontext
  - Định nghĩa các services implements các interface ở tầng Application
  - Tầng này sẽ bao gồm các services như: Identity, Cloudinary, SignalR, v.v

Tầng Domain:
  - Là tầng cốt lõi của ứng dụng, không  phụ thuộc vào bất kì tầng nào
  - Chứa các Domain Entity, constant
    
