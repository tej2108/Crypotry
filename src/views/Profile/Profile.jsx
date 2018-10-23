import React from 'react';
import {Link} from 'react-router-dom';
import {render} from "react-dom";
import {modelInstance} from '../../data/APIetcModel.jsx';
import Progress from '../Progress/Progress'
// import WatchCoin from '../Ticker/WatchCoin'
import CoinTable from '../Ticker/CoinTable'
// import feed from '../../feed-socket.io'
import socketIOClient from "socket.io-client";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './Profile.css';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'My Wallet',
            status_prof: 'INITIAL',
            status_ticker: 'INITIAL',
            user: '',
            currentCurr: 'BTC',
            transactionamount: 0,
            walletValue: 0, //Total value of everything in the wallet
            walletChange: 0, //The total earn/loss
        }
        this.newTransaction = this.newTransaction.bind(this);
    }

    // TODO: pull user preferences into
    loadProfileData = () => {
        console.log('props', user.data)
        fetch(`api/user/${user.data}`).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    this.setState({
                        status_prof: 'LOADED',
                        user: data,
                        currentCurr: modelInstance.getCurrentCurr()
                    });
                });
            } else {
                response.json().then(error => {
                    alert("Failed to fetch issues:" + error.message)
                });
            }
        }).catch(err => {
            alert("Error in fetching user data from server:", err);
        });
    };

    componentDidMount = () => {
        this.loadProfileData()
    }

    newCurr = (e) => {
    modelInstance.setCurrentCurr(e.target.value);
    this.setState({currentCurr: e.target.value});
    };

    newAmount = (e) => {
        this.setState({transactionamount: e.target.value});
    };

    newTransaction() {
        modelInstance.makeNewTransaction(this.state.transactionamount);
    };

    walletUpdate() {
        this.setState({walletValue: modelInstance.getCurrentWalletValue(),
            walletChange: modelInstance.getComparison(all)
        });
    };


    update(){
        this.setState({
            currentCurr: modelInstance.getCurrentCurr(),
            walletValue: modelInstance.getWallet(),
            walletChange: modelInstance.getComparison(all)
        });
    }

    render() {
        let profile;
        switch (this.state.status_prof) {
            case 'INITIAL':
                profile = <Progress/>
                break;
            case 'LOADED':
                profile =
                    <div className="navProfile">
                        <img src={this.state.user.data.avatar}/>
                        <div className="navProfileText">
                            {this.state.user.data.name}
                            <br/>
                            <a href="/logout">Log out</a><br/><br/>
                        </div>
                    </div>;
                break;
        }

        return (
            <div className="pageLayout">
                <div className="navbar">
                    <div>
                        <img src="https://i.imgur.com/s5krUs0.png" width="100%"/>
                    </div>
                    <div>
                        <h2>You're following:</h2>
                        <CoinTable following={this.state.user.following}/>
                    </div>
                    {profile}
                </div>
                <div className="myWallet">
                    <h1 align="center">{this.state.title}</h1>
                    <br/>
                    <form>
                        <p>Total value of all cryptocurrencies in wallet: {this.state.walletValue} Euro</p>
                        <p>Earnings/Losses: {this.state.walletChange} Euro</p>
                        <br/>

                        <label>
                            Select currency:
                        </label>
                        <select onChange={this.newCurr}>
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
                        <p>Selected currency: {this.state.currentCurr}</p>
                        <h3>Add new transaction</h3>
                        <label> Amount </label>
                        <br/>
                        <label>A positive value if you're buying, negative if you're selling</label>
                        <br/>
                        <input id="transactionamount" type="text" onChange={this.newAmount}/>
                        <br/><br/>
                        <input type="button" value="Add transaction and update wallet" onClick={this.newTransaction}/>

                        <br/><br/>
                        <br/><br/>
                        <br/><br/>



                        <label> Cryptocurrency: </label>
                        <input type="text" disabled value="123123" />
                        <br/><br/>
                        <label> Current Amount: </label>
                        <input type="text" />
                        <br/><br/>
                        <label> Last Updated: </label>
                        <br/><br/>
                        <label> History of Purchases: </label>
                        <br/><br/>
                        <input type="button" value="Update Wallet to Current Value"/>
                    </form>
                </div>

            </div>
    );
    }
    }

    render(
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <Profile/>
        </MuiThemeProvider>
    ,
    document.getElementById('profile'));

    if (module.hot) {
        module.hot.accept();
    }
