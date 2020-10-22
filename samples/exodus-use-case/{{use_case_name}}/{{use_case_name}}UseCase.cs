using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Exodus.Core.Application.Constants;
using Exodus.Core.Application.Interfaces;
using Exodus.Core.Application.Interfaces.Services;
using Exodus.Core.Application.Models;
using Exodus.Core.Application.UseCases.{{use_case_name}}.Models;
using Exodus.Core.Domain.Extensions;

namespace Exodus.Core.Application.UseCases.{{use_case_name}}
{
    public class {{use_case_name}}UseCase : I{{use_case_name}}UseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private IMessageAccumulator _accumulator;

        public {{use_case_name}}UseCase(IUnitOfWork unitOfWork, IMessageAccumulator accumulator)
        {
            _unitOfWork = unitOfWork;
            _accumulator = accumulator;
        }

        public async Task<bool> Handle({{use_case_name}}Request request, IOutputPort<{{use_case_name}}Response> outputPort)
        {
            ICollection<Message> errors = new List<Message>();
        
            string  response_msg = _accumulator.GetMessageByStatus(status: MSGSTATUS.{{use_case_name}}_FAILURE);
            outputPort.Handle(new {{use_case_name}}Response(success: false, message: response_msg, errors: errors));
            return false;
        }
    }
}
