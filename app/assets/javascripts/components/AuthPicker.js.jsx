var AuthPicker = React.createClass({
  propTypes: {
    formToShow: React.PropTypes.string.isRequired,
    onFormChange: React.PropTypes.func.isRequired
  },

  render: function () {
    var modalTitle;
    var modalBody;
    if (this.props.formToShow == "SignUp") {
      modalTitle = "Sign Up";
      modalBody = <SignUpContainer onFormChange={this.props.onFormChange} shouldRedirect={false}/>;
    } else if (this.props.formToShow == "Login") {
      modalTitle = "Log In";
      modalBody = <LoginContainer onFormChange={this.props.onFormChange} shouldRedirect={false}/>;
    }

    return (
      <div>
      <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#modalSignUp">
        Launch demo modal
      </button>
      <div className="modal" id="modalSignUp" data-backdrop="static" data-keyboard={false}  data-show={true}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">{modalTitle}</h4>
            </div>
            <div className="modal-body">
              {modalBody}
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
});
