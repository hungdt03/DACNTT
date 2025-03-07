﻿using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Infrastructure.Options;

namespace SocialNetwork.Infrastructure.Mailkit
{
    public class MailkitService : IMailkitService
    {
        private const string INFRASTRUCTURE_PATH = "Infrastructure";
        private const string API_PATH = "API";

        private readonly IOptions<EmailOptions> emailOptions;

        public MailkitService(IOptions<EmailOptions> emailOptions)
        {
            this.emailOptions = emailOptions;
        }

        public async Task SendOtpAccountVerificationAsync(string to, string otp, string fullName)
        {
            var currentDirectory = Directory.GetCurrentDirectory().Replace(API_PATH, INFRASTRUCTURE_PATH);
            string templatePath = Path.Combine(currentDirectory, "Mailkit", "Templates", "AccountVerification.html");
            string body = LoadTemplateHTML(templatePath, fullName, otp);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Đội ngũ Social Network", emailOptions.Value.From));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = "Xác thực tài khoản người dùng";

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

        private static string LoadTemplateHTML(string templatePath, string fullName, string otp)
        {
            string template = File.ReadAllText(templatePath);
            template = template.Replace("[FullName]", fullName);
            template = template.Replace("[InsertOTP]", otp);
            return template;
        }

        public async Task SendOtpForgotPasswordAsync(string to, string otp, string fullName)
        {
            var currentDirectory = Directory.GetCurrentDirectory().Replace(API_PATH, INFRASTRUCTURE_PATH);
            string templatePath = Path.Combine(currentDirectory, "Mailkit", "Templates", "ForgotPassword.html");
            string body = LoadTemplateHTML(templatePath, fullName, otp);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Đội ngũ Social Network", emailOptions.Value.From));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = "Khôi phục mật khẩu tài khoản";

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

        public async Task SendOtpChangeEmailAsync(string to, string otp, string fullName)
        {
            var currentDirectory = Directory.GetCurrentDirectory().Replace(API_PATH, INFRASTRUCTURE_PATH);
            string templatePath = Path.Combine(currentDirectory, "Mailkit", "Templates", "ChangeEmail.html");
            string body = LoadTemplateHTML(templatePath, fullName, otp);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Đội ngũ Social Network", emailOptions.Value.From));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = "Thay đổi email tài khoản";

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
    }
}
