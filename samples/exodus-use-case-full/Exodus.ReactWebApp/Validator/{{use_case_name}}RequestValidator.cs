using Exodus.Core.Application.UseCases.{{use_case_name}}.Models;
using FluentValidation;

namespace Exodus.ReactWebApp.Validator
{
    public class {{use_case_name}}RequestValidator : AbstractValidator<{{use_case_name}}Request>
    {

        public {{use_case_name}}RequestValidator()
        {
            Include(new DeviceInfoValidator());
            // RuleFor(x => x.Data1).MinimumLength(4).NotNull();

        }
    }
}
