        public async Task<{{use_case_name}}Response> {{use_case_name}}({{use_case_name}}Request request, ICollection<Message> errors)
        {
            Func<string, Exception, bool> appendMessage = new Func<string, Exception, bool>((msg, ex) =>
            {
                return _accumulator.AppendMessage(MSGTYPE.{{use_case_names}}_FAILURE, msg, ex: ex, errors: errors, args: request);
            });

            try
            {

            }
            catch (Exception ex)
            {
                appendMessage(MSGSTATUS.EXCEPTION, ex);
            }

            return new {{use_case_name}}Response(httpStatus: HttpStatusCode.BadRequest);
        }