//This is the view displaying histograms etc.
import React, {Component} from 'react';
import {render} from 'react-dom';
import {VictoryChart, VictoryLine} from 'victory'; //Check for actual path.
// import './histogram.css';
import {modelInstance} from '../../data/APIetcModel';
import ReactBootstrapSlider from 'react-bootstrap-slider';

//import Slider from 'rc-slider/lib/Slider';
//import Range from 'rc-slider/lib/Range';
//import 'rc-slider/assets/index.css'; //These three need to be downloaded through npm. Check the paths.
//Also import react-bootstrap-slider from github/brownieboy
//import the other user data somehow

class Histogram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'INITIAL',
      //histogramdata: modelInstance.histogramData(1),
      slidervalue: 1,
      currentCurr: 'BTC'
    }
  }

  componentDidMount = () => {
    let _this = this
    //console.error(this.props);
    modelInstance.addObserver(this);
    //this.modelInstance.histogramData(slidervalue);
    //Arvids förslag: Gör ett anrop till getHistorical direkt. Gör två versioner av histogramData. Den ena kan anropas i början, den andra när det har laddat, för att undvika unresolved promises.
    modelInstance.histogramData(1).then((histo) =>{ //This goes in update too
      
      _this.setState({
        status: 'LOADED',
        //histogramdata: modelInstance.histogramData(1),
        slidervalue: 1,
        currentCurr: 'BTC',
        histo: histo
      })
      }).catch(() => {
        _this.setState({
          status: 'ERROR'
        })
      })
  }

  componentWillUnmount = () => {
    modelInstance.removeObserver(this)
  }

  update = () => {
    this.setState({
      //histogramdata: modelInstance.histogramData(this.state.slidervalue), 
      currentCurr: modelInstance.getCurrentCurr(),
      slidervalue: 1
    })
  }

  newCurr = (e) => {
    modelInstance.setCurrentCurr(e.target.value);
    this.setState({currentCurr: e.target.value});
  }

  OnSliderChangeValue = (e) => {
    this.setState({ slidervalue: e.target.value });
  }

  render() {
      let histogram = ''
      switch (this.state.status) {
        case 'INITIAL':
        histogram = <em>Loading...</em>
        break;
        case 'LOADED':
        histogram = 
      <div className='row'>
        <div className='col-md-10'>
          <div className='col-md-5'>
            <select id='currenciesdropdown' onChange={this.newCurr}>
              <option>All the coins! Or rather, one option for each available coin in the API. (Note: Just saw that that
                is 4796 coins, so... nope. We pick 10 or so.)
              </option>
              <option value='BTC'>Bitcoin</option>
              <option value='ETH'>Ethereum</option>
              <option value='DOGE'>Dogecoin</option>
              <option value='XRP'>Ripple</option>
              <option value='ADA'>Cardano</option>
              <option value='TRX'>Tron</option>
              <option value='XVG'>Verge</option>
              <option value='LTC'>Litecoin</option>
              <option value='EOS'>EOS</option>
              <option value='NEO'>NEO</option>
            </select>
          </div>
          <div className='col-md-5'>
            <h2>Current price: </h2><p>{modelInstance.getCurrentPrice(this.state.currentCurr, 'SEK')}</p>
          </div>

          <div className='row' id='graphOfSelectedCurrency'>
            <VictoryChart>
              <VictoryLine
                data={histo}
              />
            </VictoryChart>
            <ReactBootstrapSlider
              max={3}
              min={1}
              step={1}
              ticks={[1, 2, 3]}
              ticks_labels = {["Day", "Week", "Month"]}
              tooltip="hide"
              change={this.state.OnSliderChangeValue}
              value={this.state.slidervalue} 
              />
          </div>

           <div className='row' id='graphOfUserWallet'>
            <VictoryChart>
              <VictoryLine

              />
            </VictoryChart>
          </div>
        </div>
      </div>     
         break;        
}
return(
  <div>{histogram}</div>
);
  }}

render(
  <Histogram/>,
  document.getElementById('histogram'));

if (module.hot) {
  module.hot.accept();
}
