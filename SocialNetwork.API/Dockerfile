# Sử dụng SDK .NET 8 để build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj và restore các package
COPY *.sln .
COPY SocialNetwork.API/*.csproj SocialNetwork.API/
RUN dotnet restore SocialNetwork.API/SocialNetwork.API.csproj

# Copy toàn bộ source code và build
COPY . .
WORKDIR /app/SocialNetwork.API
RUN dotnet publish -c Release -o /out

# Sử dụng runtime nhẹ để chạy ứng dụng
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out ./

# Thiết lập biến môi trường
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Chạy ứng dụng
ENTRYPOINT ["dotnet", "SocialNetwork.API.dll"]
