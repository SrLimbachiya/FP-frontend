import {withRouter} from 'react-router-dom'
import {Component} from 'react'
import Cookie from 'js-cookie'
import './index.css'

class Header extends Component {
  state = {fullname: '', init: ''}

  componentDidMount() {
    this.getUser()
  }

  getUser = async () => {
    const myToken = Cookie.get('jwt_token')
    const url = 'https://financepeer-server.herokuapp.com/get-user'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    }
    const response = await fetch(url, option)
    const data = await response.json()
    const user = data.fullname
    this.setState(
      {fullname: data.fullname, init: user.slice(0, 1)},
      this.randomColorGen,
    )
  }

  randomColorGen = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff3333', '#ff6600']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const thatDiv = document.getElementById('init')
    thatDiv.style.backgroundColor = randomColor
  }

  logMeOut = () => {
    const {history} = this.props
    Cookie.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    const {fullname, init} = this.state

    return (
      <nav className="nav-header">
        <div className="nav-content">
          <div className="user-data">
            <div id="init" className="user-init">
              {init}
            </div>
            <p>{fullname}</p>
          </div>
          <div className="nav-menu-item">
            <p className="nav-menu-item-link" onClick={this.logMeOut}>
              Logout
            </p>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
