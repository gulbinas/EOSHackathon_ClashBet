import React, {Component} from 'react';
import {Api, JsonRpc, RpcError, JsSignatureProvider} from 'eosjs'; // https://github.com/EOSIO/eosjs
import {TextDecoder, TextEncoder} from 'text-encoding';
import uuid from "uuid";
// import { Redirect } from 'react-router-dom';

// material-ui dependencies
import {withStyles} from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';

// import TextField from '@material-ui/core/TextField';
// import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';

const accounts = {
    challenger: {
        "name": "alice",
        "privateKey": "5Kcu8cbdyjTXD5e1QsRLmX6JYqGMC9mSRsFgDwKPk48j4MmPyBW",
        "publicKey": "EOS7yHr8Hd55v4GVs6QTMrAiK3x1g89sMRMgkxvTw4TrrSzExmTdv"
    },
    challengee: {
        "name": "bob",
        "privateKey": "5JofWdxYbzV6ipNmEdiaZibVxg9GYMLAFiKEWiYSuz3YEEHJHbb",
        "publicKey": "EOS8Ke736LWfLfXdw4vFVYGG3Hf5iVDJhdPherwA7P9nuxdKaUfz7"
    }
};

// eosio endpoint
const endpoint = "http://10.7.1.73:8888";

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!

const states = {
    "waiting": 10,
    "playing": 20,
    "pending": 25,
    "settling": 30
};

// set up styling classes using material-ui "withStyles"

const styles = theme => ({
    clash: {
        minHeight: '100%',
        // backgroundImage: 'url(' + clashUrl + ')',
        backgroundSize: 'cover'
    },
    card: {
        margin: 20,
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    formButton: {
        marginTop: theme.spacing.unit,
        width: "100%",
    },
    pre: {
        background: "#ccc",
        padding: 10,
        marginBottom: 0,
        position: "absolute",
        bottom: 0,
        right: 0,
    },
    TextField: {
        backgroundColor: "#fff",
    },
    mainCon: {
        maxWidth: "400px",
        paddingTop: "10px",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        margin: "auto",
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    formContents: {
        display: 'flex',
        marginBottom: "10px"
    },
    formFooter: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    formAmountInput: {
        width: "80px",
    },
    footer: {
        backgroundColor: "#333",
        padding: "15px",
        textAlign: "right",
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        color: "#fff"
    },
    pageTitle: {
        margin: 0,
        textAlign: "center",
        textTransform: "uppercase",
        marginBottom: "5px"
    }
});

// Index component
class Index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: 0,
            challenge: {
                challenger: "Alice",
                amount: 10,
            },
            hash: null,
            noteTable: [] // to store the table rows from smart contract
        };

        // this.handleFormEvent = this.handleFormEvent.bind(this);
        this.returnHome = this.returnHome.bind(this);
        this.createChallenge = this.createChallenge.bind(this);
        // this.acceptChallenge = this.acceptChallenge.bind(this);
        this.cancelChallenge = this.cancelChallenge.bind(this);
        this.claimChallenge = this.claimChallenge.bind(this);
        this.acceptLoss = this.acceptLoss.bind(this);
    }

    // generic function to handle form events (e.g. "submit" / "reset")
    // push transactions to the blockchain by using eosjs
    async createChallenge(event) {
        // stop default behaviour
        event.preventDefault();

        // collect form data
        // let account = event.target.account.value;
        let account = accounts.challenger.name;
        let privateKey = accounts.challenger.privateKey;
        let amount = event.target.amount.value;

        // prepare variables for the switch below to send transactions
        let actionName = "";
        let actionData = {};
        let uid = uuid.v4();


        // define actionName and action according to event type
        switch (event.type) {
            case "submit":
                actionName = "createchall";
                actionData = {
                    player: account,
                    amount: amount,
                    challangeHash: uid
                };
                break;
            default:
                return;
        }

        // eosjs function call: connect to the blockchain
        const rpc = new JsonRpc(endpoint);
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const api = new Api({rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});

        try {

            await api.transact({
                actions: [{
                    account: "clashbet",
                    name: actionName,
                    authorization: [{
                        actor: account,
                        permission: 'active',
                    }],
                    data: actionData,
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });

            this.setState({ "status": 10, "hash": uid });

            console.log(this.state);
            // this.getTable();
        } catch (e) {
            console.log('Caught exception: ' + e);
            if (e instanceof RpcError) {
                console.log(JSON.stringify(e.json, null, 2));
            }
        }
    }

    async cancelChallenge(event) {
        // stop default behaviour
        event.preventDefault();

        if (typeof this.state.hash === "undefined") {
            this.setState({ "status": 0 })
        }


        // collect form data
        // let account = event.target.account.value;
        let account = accounts.challenger.name;
        let privateKey = accounts.challenger.privateKey;
        // let amount = event.target.amount.value;

        // prepare variables for the switch below to send transactions
        let actionName = "";
        let actionData = {};

        // define actionName and action according to event type
        switch (event.type) {
            case "submit":
                actionName = "cancelchall";
                actionData = {
                    player: account,
                    challangeHash: this.state.hash
                };
                break;
            default:
                return;
        }

        // eosjs function call: connect to the blockchain
        const rpc = new JsonRpc(endpoint);
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const api = new Api({rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});

        try {

            await api.transact({
                actions: [{
                    account: "clashbet",
                    name: actionName,
                    authorization: [{
                        actor: account,
                        permission: 'active',
                    }],
                    data: actionData,
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });

            this.setState({ "status": 0 });

            // console.log(result);
            // this.getTable();
        } catch (e) {
            console.log('Caught exception: ' + e);
            if (e instanceof RpcError) {
                console.log(JSON.stringify(e.json, null, 2));
            }
        }
    }



    // gets table data from the blockchain
    // and saves it into the component state: "noteTable"
    getTable() {
        const rpc = new JsonRpc(endpoint);

        rpc.get_table_rows({
            "json": true,
            "code": "clashbet",   // contract who owns the table
            "scope": "clashbet",  // scope of the table
            "table": "challange",    // name of the table as specified by the contract abi
            "limit": 100,
        }).then(result => {
            for(let i = 0; i < result.rows.length; i++) {
                if (result.rows[i].hash === this.state.hash && result.rows[i].state === 20) {
                    this.setState({ status: 20 });

                    break;
                }
            }
        });

    }

    componentDidMount() {
       // this.getTable();
    }

    returnHome = (event) => {
        event.preventDefault();

        this.setState({ "status": 0 });
    };

    // createChallenge = (event) => {
    //     event.preventDefault();
    //
    //     this.setState({ "status": 20 });
    // };

    // acceptChallenge = (event) => {
    //     event.preventDefault();
    //
    //     this.setState({ "status": 20 });
    // };

    // cancelChallenge = (event) => {
    //     event.preventDefault();
    //
    //     this.setState({ "status": 0 });
    // };

    claimChallenge = (event) => {
        event.preventDefault();

    };

    acceptLoss = (event) => {
        event.preventDefault();
    };

    render() {
        // const {noteTable} = this.state;
        const {classes} = this.props;

        // generate each note as a card
        // const generateCard = (key, user, note) => (
        //     <Card className={classes.card} key={key}>
        //         <CardContent>
        //             <Typography variant="headline" component="h2">
        //                 {user}
        //             </Typography>
        //             <Typography component="pre">
        //                 {note}
        //             </Typography>
        //         </CardContent>
        //     </Card>
        // );
        // let noteCards = noteTable.map((row, i) =>
        //     generateCard(i, row.user, row.note));



        /*
        <Paper className={classes.paper}>
            <form onSubmit={this.handleFormEvent}>
                <TextField
                    name="account"
                    autoComplete="off"
                    label="Account"
                    margin="normal"
                    fullWidth
                />
                <TextField
                    name="privateKey"
                    autoComplete="off"
                    label="Private key"
                    margin="normal"
                    fullWidth
                />
                <TextField
                    name="note"
                    autoComplete="off"
                    label="Note (Optional)"
                    margin="normal"
                    multiline
                    rows="10"
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.formButton}
                    type="submit">
                    Add / Update note
                </Button>
            </form>
        </Paper>
        <div>
                        {noteCards}
                    </div>
        */

        const redirectButton = (
            <Button variant="outlined" onClick={this.returnHome} color="primary">Home</Button>
        );

        const footerContainer = (
            <div className={classes.footer}>
                Powered by <strong>ClashBet</strong>
            </div>
        );

        switch (this.state.status) {
            case 10:

                for (let i = 1; i < 9; i++) {
                    setTimeout(() => {
                        this.getTable();
                    }, 2000*i)
                }

                return (
                    <div className="App">
                        <div className={classes.clash}>
                            <div className={classes.mainCon}>
                                <div className={classes.formContents}>
                                    <h2 className={classes.pageTitle}>Waiting for players</h2>
                                </div>
                                <div className={classes.formFooter}>
                                    <Button onClick={this.cancelChallenge} variant="contained" color="primary">Cancel challenge</Button>
                                    {redirectButton}
                                </div>
                            </div>
                        </div>
                        {footerContainer}
                    </div>
                );
            case 15:
                return (
                    <div className="App">
                        <div className={classes.clash}>
                            <div className={classes.mainCon}>
                                <Button onClick={this.acceptChallenge} variant="contained" color="primary">Accept Challenge</Button>
                                {redirectButton}
                            </div>
                        </div>
                        {footerContainer}
                    </div>
                );
            case 20:
                return (
                    <div className="App">
                        <div className={classes.clash}>
                            <div className={classes.mainCon}>
                                <div className={classes.formContents}>
                                    In Progress
                                </div>
                                {redirectButton}
                            </div>
                        </div>
                        {footerContainer}
                    </div>
                );
            case 30:
                return (
                    <div className="App">
                        <div className={classes.clash}>
                            <div className={classes.mainCon}>
                                <div className={classes.formContents}>
                                    win or loose
                                </div>
                                {redirectButton}
                            </div>
                        </div>
                        {footerContainer}
                    </div>
                );
            default:
                return (
                    <div className="App">
                        <div className={classes.clash}>
                            <form onSubmit={this.createChallenge} className={classes.mainCon}>
                                <div className={classes.formContents}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="challenger"
                                            label="Challenger ID"
                                            value={this.state.challenge.challenger}
                                            margin="normal"
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormControl className={classes.formAmountInput}>
                                        <TextField
                                            id="amount"
                                            label="Amount"
                                            value={this.state.challenge.amount}
                                            margin="normal"
                                        />
                                    </FormControl>
                                </div>
                                <Button type="submit" variant="contained" color="primary">Challenge</Button>
                            </form>
                        </div>
                        {footerContainer}
                    </div>
                );
        }
    }

}

export default withStyles(styles)(Index);
