// Write your code here
import {Component} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const api = {
  success: 'SUCCESS',
  initial: 'INITIAL',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class CowinDashboard extends Component {
  state = {data: [], apiStatus: api.initial}

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: api.inProcess})
    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const update = {
        last7DaysVaccination: data.last_7_days_vaccination.map(each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({data: update, apiStatus: api.success})
    } else {
      this.setState({apiStatus: api.failure})
    }
  }

  success = () => {
    const {data} = this.state

    return (
      <>
        <VaccinationCoverage details={data.last7DaysVaccination} />
        <VaccinationByGender details={data.vaccinationByGender} />
        <VaccinationByAge details={data.vaccinationByAge} />
      </>
    )
  }

  loading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failure = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case api.success:
        return this.success()
      case api.failure:
        return this.failure()
      case api.inProcess:
        return this.loading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="logo-container">
          <img
            className="logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          />
          <h1 className="logo-name">Co-WIN</h1>
        </div>
        <h1 className="content-heading">CoWin Vaccination in India</h1>
        <div className="box1">{this.renderStatus()}</div>
      </div>
    )
  }
}

export default CowinDashboard
