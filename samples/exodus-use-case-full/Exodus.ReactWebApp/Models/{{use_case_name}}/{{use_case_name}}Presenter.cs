using Exodus.Core.Application.UseCases.{{use_case_name}}.Models;

namespace Exodus.ReactWebApp.Models.{{use_case_name}}
{
    public class {{use_case_name}}Presenter : BaseRequestPresenter<{{use_case_name}}Response>
    {
        public override void Handle({{use_case_name}}Response response)
        {
            base.Handle(response);
            ContentResult.StatusCode = (int)response.HttpStatus;
        }
    }

}
