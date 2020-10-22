using Exodus.Core.Application.Interfaces;
using Exodus.Core.Application.UseCases.{{use_case_name}}.Models;

namespace Exodus.Core.Application.UseCases.{{use_case_name}}
{
    public interface I{{use_case_name}}UseCase : IUseCaseHandler<{{use_case_name}}Request, {{use_case_name}}Response>
    { }
}
