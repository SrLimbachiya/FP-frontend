import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import {AiOutlineCheckCircle} from 'react-icons/ai'
import Cookie from 'js-cookie'

import './index.css'

class Signup extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    showSubmitError: false,
    userDone: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangeFullName = event => {
    this.setState({fullname: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeConPassword = event => {
    this.setState({confirmPassword: event.target.value})
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async () => {
    const {username, password, fullname} = this.state
    const userDetails = {username, fullname, password}
    const url = 'https://financepeer-server.herokuapp.com/register/'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.setState({userDone: true}, this.redirectTimeout)
    } else if (response.status === 400) {
      this.onSubmitFailure(data.error_msg)
    }
  }

  redirectTimeout = () => {
    setTimeout(() => {
      const {history} = this.props
      history.replace('/login')
    }, 4000)
  }

  renderUserCreated = () => (
    <div className="success-login">
      <div className="card">
        <div className="upper-side">
          <AiOutlineCheckCircle size="65px" />
          <h3 className="status">Success</h3>
        </div>
        <div className="lower-side">
          <p className="message">
            Congratulations, your account has been successfully created.
          </p>
          <Link className="login-link" to="/login">
            <p className="contBtn">Continue</p>
          </Link>
        </div>
      </div>
    </div>
  )

  checkPasswordAndSubmit = event => {
    event.preventDefault()
    const {password, confirmPassword, username} = this.state
    if (username !== '' && password !== '') {
      if (password === confirmPassword) {
        this.submitForm()
      } else {
        this.setState({
          showSubmitError: true,
          errorMsg: "Password didn't match!",
        })
      }
    } else {
      this.setState({showSubmitError: true, errorMsg: 'Enter Username!'})
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderConPasswordField = () => {
    const {confirmPassword} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          CONFIRM PASSWORD
        </label>
        <input
          type="password"
          id="password1"
          className="password-input-field"
          value={confirmPassword}
          onChange={this.onChangeConPassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  renderFullnameField = () => {
    const {fullname} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          FULL NAME
        </label>
        <input
          type="text"
          id="fullname"
          className="username-input-field"
          value={fullname}
          onChange={this.onChangeFullName}
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const isToken = Cookie.get('jwt_token')
    if (isToken !== undefined) {
      return <Redirect to="/" />
    }

    const {showSubmitError, errorMsg, userDone} = this.state
    return (
      <div className="signup-form-container">
        {userDone ? (
          this.renderUserCreated()
        ) : (
          <form
            className="form-container"
            onSubmit={this.checkPasswordAndSubmit}
          >
            <h1>Register</h1>
            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderFullnameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
            <div className="input-container">
              {this.renderConPasswordField()}
            </div>
            <button type="submit" className="signup-button">
              Signup
            </button>
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </form>
        )}
      </div>
    )
  }
}

export default Signup
