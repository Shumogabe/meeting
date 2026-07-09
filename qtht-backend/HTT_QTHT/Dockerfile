#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
ENV TZ=Asia/Bangkok
RUN apt-get update && apt install telnet inetutils-ping dnsutils vim wget -y
WORKDIR /app
EXPOSE 9004

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ENV TZ=Asia/Bangkok
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["HTT_QTHT.csproj", "."]
RUN dotnet restore "./HTT_QTHT.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "./HTT_QTHT.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ENV TZ=Asia/Bangkok
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./HTT_QTHT.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
ENV TZ=Asia/Bangkok
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HTT_QTHT.dll"]