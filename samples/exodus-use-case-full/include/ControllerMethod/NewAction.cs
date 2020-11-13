        [Authorize]
        [Route(RouteConfig.{{use_case_name}})]
        [HttpPut]
        public async Task<ActionResult> {{use_case_name}}([FromBody] {{use_case_name}}Request request)
        {
            await _{{use_case_name}}UseCase.Handle(request, _{{use_case_name}}Presenter);
            return _{{use_case_name}}Presenter.ContentResult;
        }
