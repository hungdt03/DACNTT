using Microsoft.AspNetCore.Mvc;

namespace SocialNetwork.API.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public FileController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpGet("images/{fileName}")]
        public async Task<IActionResult> ReadFile([FromRoute] string fileName)
        {
            var filePath = Path.Combine(_environment.WebRootPath, "images", fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "File not found." });
            }

            try
            {
                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                var mimeType = GetMimeType(fileName);
                return File(fileBytes, mimeType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error reading file.", details = ex.Message });
            }
        }

        private string GetMimeType(string fileName)
        {
            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(fileName, out var contentType))
            {
                contentType = "application/octet-stream"; // MIME mặc định
            }
            return contentType;
        }
    }
}
