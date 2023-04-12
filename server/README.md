# System-backend

## Yêu cầu về hệ thống
1. Node >= 16
2. PostgresSQL

## Cài đặt môi trường

Copy file .env.example sang .env hoặc chạy lệnh dưới
```bash
cp .env.example .env
```

Cài đặt node packages
```bash
npm i --production
```

Cài đặt pm2
```
npm i --save-dev pm2
```

## Biến môi trường
1. DATABASE_URL: URI kết nối đến database server
2. JWT_SECRET_KEY: 1 đoạn văn bản ngẫu nhiên, hỗ trợ tạo access_token
3. Các biến liên quan đến AWS: Hệ thống sử dụng AWS S3 Bucket để lưu ảnh

## Cấu hình database

Migration database
```bash
npx prisma db push --accept-data-loss
```

Seed database
```
npx prisma db seed
```

## Sử dụng
### Đối với trường hợp chạy ứng dụng lần đầu
```bash
npx pm2 start index.js
```
### Đối với trường hợp cần restart app (chạy các lần kế tiếp)
```bash
npx pm2 restart index.js
```
### Đối với chạy trên các hosting CPanel
```bash
node index.js
```