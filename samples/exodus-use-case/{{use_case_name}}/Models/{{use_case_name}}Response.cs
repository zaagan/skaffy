using Exodus.Core.Application.Models;
using System.Collections.Generic;

namespace Exodus.Core.Application.UseCases.{{use_case_name}}.Models
{
    public class {{use_case_name}}Response : UseCaseResponse
    {
     
        public {{use_case_name}}ResponseData Data { get;  }

        public {{use_case_name}}Response(bool success = false, string message = null, IEnumerable<Message> errors = null, {{use_case_name}}ResponseData data = null) : base(success, message, errors)
        {
            Data = data;
        }

    }


    public class {{use_case_name}}ResponseData
    {
        public string Data1 { get; set; }
    }

}
