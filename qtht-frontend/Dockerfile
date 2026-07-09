# FROM node:18 as builder 
# ENV TZ=Asia/Bangkok
# #Cài đặt các package
# # RUN apt-get update && apt install telnet inetutils-ping dnsutils vim -y
# #Thiết lập thư mục đang làm việc cho các chỉ thị khác như: RUN, CMD, ENTRYPOINT, COPY, ADD,…
# WORKDIR /app
# #Sao chép các file và thư mục vào container.
# COPY . .
# #Có thể tạo một lệnh khi build image. Được sử dụng để cài đặt các package vào container.
# RUN npm install --force


# #build image

# FROM node:18 as runner
# ENV TZ=Asia/Bangkok
# RUN apt-get update && apt install telnet inetutils-ping dnsutils vim -y
# WORKDIR /app
# COPY . .
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# #port
# #khai báo port lắng nghe của image.
# EXPOSE 9003
# #run image
# #Cung cấp một lệnh và đối số cho container thực thi. Các tham số có thể được ghi đè và chỉ có một CMD.
# CMD ["npm", "start"] 

FROM node:18 AS build-step
WORKDIR /app
COPY . .
RUN npm install --force && npm run build

FROM nginx:1.28.0-alpine
# FROM nginx:alpine
# RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build-step /app/build /usr/share/nginx/html
EXPOSE 9003
CMD ["nginx", "-g", "daemon off;"]