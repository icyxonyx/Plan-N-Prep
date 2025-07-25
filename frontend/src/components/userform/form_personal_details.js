import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { withRouter } from "react-router-dom";

class FormPersonalDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
    this.renderErrors = this.renderErrors.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.hitEnter = this.hitEnter.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.hitEnter);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.hitEnter);
  }

  hitEnter(e) {
    if(e.key === "Enter") {
      const { email, name, password, password2, height, weight, age } = this.props.values;
      this.props.signup({ email, name, password, password2, height, weight, age });
    }
  }

  componentWillUnmount() {
    this.props.clearErrors()
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser === true) {
      this.props.history.push("/index");
    }
    this.setState({ errors: nextProps.errors });
  }

  handleSignup() {
    const { email, name, password, password2, height, weight, age } = this.props.values;
    return e => {
      e.preventDefault();
      this.props.signup({ email, name, password, password2, height, weight, age });
    };
  }

  renderErrors() {
    return (
      <ul>
        {Object.keys(this.state.errors).map((error, i) => (
          <li className="login-error" key={`error-${i}`}>{this.state.errors[error]}</li>
        ))}
      </ul>
    );
  }

  render() {
    const { values, handleChange } = this.props;

    return (
      <MuiThemeProvider>
        <div className="session-background">
          <div className="signup-text"
            onClick={() => this.props.history.push("/")}>PlanNPrep</div>
          <a className="signup-form" class="btn">
            <span>
              <span>
                <span>
                  <form>
                    <input type="text"
                      value={values.height}
                      onChange={handleChange('height')}
                      placeholder="Enter Your Height (cm)"
                      className="login-text sign"
                    />
                    <br />
                    <input type="text"
                      value={values.weight}
                      onChange={handleChange('weight')}
                      placeholder="Enter Your Weight (kg)"
                      className="login-text sign"
                    />
                    <br />
                    <input type="text"
                      value={values.age}
                      onChange={handleChange('age')}
                      placeholder="Enter Your Age"
                      className="login-text sign"
                    />
                    <br />
                    {this.renderErrors()}
                    <div className="signup-bottom">
                      <button className="submit" onClick={this.back}>
                        Back
                      </button>
                      <button className="submit" onClick={this.handleSignup()}>
                        Sign Up
                      </button>
                    </div>
                  </form>
                </span>
              </span>
            </span>
          </a>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(FormPersonalDetails);
