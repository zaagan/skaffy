using Exodus.Core.Application.Models;
using Exodus.Core.Domain.Enums;

namespace Exodus.Core.Application.UseCases.{{use_case_name}}.Models
{
    public class {{use_case_name}}Request : RequestPayload
    {

        public string Data1 { get; }


        public {{use_case_name}}Request(string data1)
        {
            Data1 = data1;
        }

    }
}
