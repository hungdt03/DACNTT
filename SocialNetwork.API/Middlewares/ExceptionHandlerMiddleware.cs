
using SocialNetwork.Application.Exceptions;
using System.Net;
using System;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.API.Middlewares
{
    public class ExceptionHandlerMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);

            } catch (Exception e)
            {
                await HandleException(context, e);
            }
        }

        public async Task HandleException(HttpContext context, Exception exception)
        {
            BaseResponse error = new BaseResponse();
            error.Message = exception.Message;
            error.IsSuccess = false;

            if (exception is NotFoundException)
            {
                error.StatusCode = HttpStatusCode.NotFound;
            }
            else
            {
                error.StatusCode = HttpStatusCode.BadRequest;
            }

            await context.Response.WriteAsJsonAsync(error);

        }
    }

}
