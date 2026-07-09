using HTT.Api.Services;
using Minio.DataModel.Args;
using Minio.Exceptions;
using Minio;
using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using HTT.Api.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace QTHT.Api.Utils
{
    public class MinioHelper
    {
        public IConfiguration _config { get; }
        private string endpoint;
        private string accessKey;
        private string secretKey;
        private string minio_bucket;
        public MinioHelper(IConfiguration config)
        {
            _config = config;

        }
        public async Task<string> UploadFile(IFormFile file, string filePath)
        {
            try
            {
                string minioAccessKey = _config["minioConfig:accessKey"];
                string minioSecretKey = _config["minioConfig:secretKey"];
                string minioBucket = _config["minioConfig:keybucket"];
                string minioEndpoint = _config["minioConfig:endpoint"];

                var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);

                // Create MinIO client
                var minio = new MinioClient()
                    .WithEndpoint(minioEndpoint)
                    .WithCredentials(minioAccessKey, minioDataSecretKey)
                    .Build();
                if (file == null || file.Length == 0)
                {
                    return "";
                }
                using (var bs = file.OpenReadStream()) // Open the stream
                {
                    var putObjectArgs = new PutObjectArgs()
                        .WithBucket(minioBucket)
                        .WithObject(filePath + "/" + file.FileName)
                        .WithStreamData(bs) // Use the stream directly
                        .WithContentType(file.ContentType)
                        .WithObjectSize(file.Length);

                    await minio.PutObjectAsync(putObjectArgs).ConfigureAwait(false); // Upload the object
                }
                return file.FileName;
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}
