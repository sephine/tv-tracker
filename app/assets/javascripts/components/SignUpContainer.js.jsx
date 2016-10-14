var SignUpContainer = React.createClass({
  propTypes: {
    onFormChange: React.PropTypes.func.isRequired,
    shouldRedirect: React.PropTypes.bool.isRequired
  },

  getInitialState: function () {
    return { errors: {} };
  },

  submitData: function (data) {
    var modified_data = {
      "user[email]": data.email,
      "user[password]": data.password,
      "user[password_confirmation]": data.password_confirmation
    };
    $.ajax({
      type: "POST",
      url: "/users",
      data: modified_data,
      success: function(msg) {
        console.log(msg);
        this.setState({errors: msg});
      }.bind(this),
      error: function() {
        alert("failure");
      }
    });
  },

  render: function () {
    return (
      <div>
        <SignUpForm errors={this.state.errors} onSubmit={this.submitData} onFormChange={this.props.onFormChange} shouldRedirect={this.props.shouldRedirect}/>
      </div>
    );
  }
});
