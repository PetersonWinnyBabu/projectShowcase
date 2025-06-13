import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const Listitem = props => {
  const {listitemDetails} = props
  const {name, imageUrl} = listitemDetails

  return (
    <li className="listItemContainer">
      <img className="listItemImage" src={imageUrl} alt={name} />
      <p className="namePara">{name}</p>
    </li>
  )
}

const apiStatusvalues = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    selectedCategory: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusvalues.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  onChangeSelect = e => {
    this.setState({selectedCategory: e.target.value}, this.getProjectsList)
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusvalues.loading})
    const {selectedCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectedCategory}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      const updatedList = data.projects.map(eachproject => ({
        id: eachproject.id,
        name: eachproject.name,
        imageUrl: eachproject.image_url,
      }))
      this.setState({
        projectsList: updatedList,
        apiStatus: apiStatusvalues.success,
      })
    } else {
      this.setState({apiStatus: apiStatusvalues.failure})
    }
  }

  renderFailureView = () => (
    <div className="failureViewContainer">
      <img
        className="failureImage"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failureHeading">Oops! Something Went Wrong</h1>
      <p className="failuretext">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retryButton"
        type="button"
        onClick={this.getProjectsList}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loaderContainer" data-testid="loader">
      <Loader />
    </div>
  )

  renderUL = () => {
    const {projectsList} = this.state
    return (
      <ul className="itemsList">
        {projectsList.map(eachItem => (
          <Listitem key={eachItem.id} listitemDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderitems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusvalues.loading:
        return this.renderLoader()
      case apiStatusvalues.success:
        return this.renderUL()
      case apiStatusvalues.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {selectedCategory} = this.state

    return (
      <div className="AppBAckground">
        <nav className="navbar">
          <img
            className="navbarImage"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="SelectSectionContainer">
          <select
            className="selectOPtions"
            onChange={this.onChangeSelect}
            value={selectedCategory}
          >
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderitems()}
      </div>
    )
  }
}

export default App
