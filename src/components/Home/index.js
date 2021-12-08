import Cookie from 'js-cookie'
import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import {Redirect} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const apiState = {
  init: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAIL',
}

class Home extends Component {
  state = {
    upload: [],
    gotData: [],
    showData: false,
    uploaded: false,
    getDataStatus: apiState.init,
  }

  uploadFile = async e => {
    e.preventDefault()
    const {upload} = this.state
    if (upload.length > 1) {
      const myToken = Cookie.get('jwt_token')
      const apiUrl = 'https://financepeer-server.herokuapp.com/data/'
      const options = {
        method: 'POST',
        headers: {
          'access-control-allow-origin': '*',
          Authorization: `Bearer ${myToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(upload),
      }
      fetch(apiUrl, options)
      this.setState({uploaded: true})
    } else {
      alert('Please Select File')
      this.setState({getDataStatus: apiState.failed})
    }
  }

  logFile = event => {
    const str = event.target.result
    const json = JSON.parse(str)
    this.setState({upload: json})
  }

  handleSubmit = event => {
    // Stop the form from reloading the page
    event.preventDefault()

    // Create a new FileReader() object
    const reader = new FileReader()

    // Setup the callback event to run when the file is read
    reader.onload = this.logFile

    // Read the file
    reader.readAsText(event.target.files[0])
  }

  changeOnUpload = e => {
    this.handleSubmit(e)
  }

  getData = async () => {
    this.setState({getDataStatus: apiState.loading})
    const myToken = Cookie.get('jwt_token')
    const apiUrl = 'https://financepeer-server.herokuapp.com/return/'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${myToken}`,
        'access-control-allow-origin': '*',
      },
    }
    try {
      const response = await fetch(apiUrl, options)
      const data = await response.json()
      const finalData = data.getFromDatabase
      this.setState({
        gotData: finalData,
        showData: true,
        getDataStatus: apiState.success,
      })
    } catch {
      console.log('return api error')
    }
  }

  renderTh = obj => {
    const {showData} = this.state

    if (showData) {
      return obj.map(each => (
        <tr key={uuidv4()}>
          <th>{each.user_id}</th>
          <th>{each.id}</th>
          <th>{each.title}</th>
          <th>{each.body}</th>
        </tr>
      ))
    }
    return null
  }

  renderfunc = () => {
    const {gotData} = this.state
    if (gotData.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Content Id</th>
              <th>Title</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>{this.renderTh(gotData)}</tbody>
        </table>
      )
    }
    return (
      <div>
        <h1 className="no-data-error">
          No Data in Database, <br /> Please Upload JSON File with Data.
        </h1>
      </div>
    )
  }

  renderLoader = () => (
    <div>
      <h1>loading</h1>
    </div>
  )

  renderEverything = () => {
    const {getDataStatus} = this.state
    switch (getDataStatus) {
      case apiState.loading:
        return this.renderLoader()
      case apiState.success:
        return this.renderfunc()
      default:
        return null
    }
  }

  render() {
    const isCookie = Cookie.get('jwt_token')
    if (isCookie === undefined) {
      return <Redirect to="/login" />
    }
    const {showData, uploaded} = this.state

    return (
      <>
        <Header />
        <div className="home-container">
          <img
            className="bg-img"
            src="https://res.cloudinary.com/srlimbachiya/image/upload/v1637937815/KitchensApp/pngegg_imx2nl.png"
            alt="bg"
          />
          <div className="home-content">
            <h1 className="home-heading">Upload Your Json Below</h1>
            <p className="home-description">
              after clicking on upload, click on &apos;Load Data&apos; button to
              load data from database.
            </p>
            <form className="upload-form" onSubmit={this.uploadFile}>
              <input
                id="fileuploader"
                onChange={this.changeOnUpload}
                type="file"
              />
              {uploaded ? (
                <button
                  disabled
                  className="shop-now-button disabled"
                  type="submit"
                >
                  Submit
                </button>
              ) : (
                <button className="shop-now-button" type="submit">
                  Submit
                </button>
              )}
              <button
                type="button"
                onClick={this.getData}
                className="shop-now-button"
              >
                Load Data
              </button>
            </form>
            {uploaded ? (
              <div className="alert-box">
                <p>Data has been uploaded to database!</p>
              </div>
            ) : null}
          </div>
          <div className="table-container">{this.renderEverything()}</div>
        </div>
      </>
    )
  }
}
export default Home
