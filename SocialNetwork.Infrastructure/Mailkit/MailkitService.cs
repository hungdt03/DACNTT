using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Infrastructure.Options;

namespace SocialNetwork.Infrastructure.Mailkit
{
   
    public class MailkitService : IMailkitService
    {
        const string INFRASTRUCTURE_PATH = "Infrastructure";
        const string API_PATH = "API";

        private readonly IOptions<EmailOptions> emailOptions;

        public MailkitService(IOptions<EmailOptions> emailOptions)
        {
            this.emailOptions = emailOptions;
        }

        public async Task SendAsync(string to, string subject)
        {
            var currentDirectory = Directory.GetCurrentDirectory().Replace(API_PATH, INFRASTRUCTURE_PATH);
            string templatePath = Path.Combine(currentDirectory, "Mailkit", "Templates", "AccountVerification.html");
            string body = LoadTemplateAccountVerification(templatePath);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Đội ngũ MXH", emailOptions.Value.From));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(emailOptions.Value.SmtpServer, 587, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(emailOptions.Value.UserName, emailOptions.Value.Password);
                    await client.SendAsync(message);
                }
                finally
                {
                    await client.DisconnectAsync(true);
                }
            }
        }

        public static string LoadTemplateAccountVerification(string templatePath)
        {
            string template = File.ReadAllText(templatePath);
            //foreach (var placeholder in replacements)
            //{
            //    template = template.Replace($"{{{{{placeholder.Key}}}}}", placeholder.Value);
            //}
            return template;
        }
    }
}
