using System.Collections.Generic;
using System.Net;
using Exodus.Core.Application.Models;

namespace Exodus.Core.Application.UseCases.{{use_case_name}}.Models
{
    public class {{use_case_name}}Response : BaseUseCaseResponse<{{use_case_name}}ResponseData>
    {
        public {{use_case_name}}Response(
           bool? success = null,
           string message = null,
           IEnumerable<Message> errors = null,
           {{use_case_name}}ResponseData data = null,
           HttpStatusCode httpStatus = HttpStatusCode.BadRequest
        ) : base(success, message, errors, data, httpStatus)
        { }
    }

    public class {{use_case_name}}ResponseData
    {
        public string Data1 { get; set; }
    }
}
