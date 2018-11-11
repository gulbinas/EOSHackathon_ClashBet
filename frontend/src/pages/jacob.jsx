import React, {Component} from 'react';
import {Api, JsonRpc, RpcError, JsSignatureProvider} from 'eosjs'; // https://github.com/EOSIO/eosjs

// material-ui dependencies
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';

const endpoint = "http://10.7.1.73:8888";

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

const states = {
    "waiting": 10,
    "playing": 20,
    "pending": 25,
    "settling": 30
};

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
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        margin: "auto",
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    formContents: {
        display: 'flex',
        marginBottom: "10px",
        flexFlow: 'column'
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
    challengeLineItem: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "5px",
        marginBottom: "5px",
    },
    pageTitle: {
        margin: 0,
        textAlign: "center",
        textTransform: "uppercase",
        marginBottom: "5px"
    }
});

class Jacob extends Component {

    constructor(props) {
        super(props);

        this.state = {
            challenges: []
        };

        this.acceptChallenge = this.acceptChallenge.bind(this);
    }

    getTable() {
        const rpc = new JsonRpc(endpoint);

        rpc.get_table_rows({
            "json": true,
            "code": "clashbet",   // contract who owns the table
            "scope": "clashbet",  // scope of the table
            "table": "challange",    // name of the table as specified by the contract abi
            "limit": 100,
        }).then(result => this.setState({ challenges: result.rows }));

    }

    componentDidMount() {
        this.getTable();
    }

    returnHome = (event) => {
        event.preventDefault();

        window.location.href = "/";
    };

    async acceptChallenge(event) {
        // stop default behaviour
        event.preventDefault();

        // collect form data
        // let account = event.target.account.value;
        let account = accounts.challengee.name;
        let privateKey = accounts.challengee.privateKey;
        // let challenger = event.target.challanger.value;
        // let amount = event.target.amount.value;
        let uid = event.target.uid.value;

        // prepare variables for the switch below to send transactions
        let actionName = "";
        let actionData = {};

        // define actionName and action according to event type
        switch (event.type) {
            case "submit":
                actionName = "acceptchal";
                actionData = {
                    player: account,
                    challangeHash: uid,
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

            this.setState({ "status": 10 });

            this.getTable();
        } catch (e) {
            console.log('Caught exception: ' + e);
            if (e instanceof RpcError) {
                console.log(JSON.stringify(e.json, null, 2));
            }
        }
    }

    render() {
        const { challenges } = this.state;
        const { classes } = this.props;

        const redirectButton = (
            <Button variant="outlined" onClick={this.returnHome} color="primary">Back Home</Button>
        );

        const footerContainer = (
            <div className={classes.footer}>
                Powered by <strong>ClashBet</strong>
            </div>
        );

        const generateChallenge = (key, uid, challanger, amount) => (
            <form className={classes.challengeLineItem} key={key} onSubmit={this.acceptChallenge}>
                <input type="hidden" name="uid" value={uid}/>
                <strong>{challanger}</strong> {amount} <Button type="submit" size="small" variant="contained" color="primary">Accept challenge</Button>
            </form>
        );

        let challengesList = challenges.map((row, i) =>
            (row.state ===  states.waiting) ? generateChallenge(i, row.hash, row.challangerName, row.amount) : ''
        );


        return (
            <div className="App">
                <div className={classes.clash}>
                    <div className={classes.mainCon}>
                        <h2 className={classes.pageTitle}>Available Challenges</h2>
                        <div className={classes.formContents}>
                            {challengesList}
                        </div>
                        <div className={classes.formFooter}>
                            {redirectButton}
                        </div>
                    </div>
                </div>
                {footerContainer}
            </div>
        )
    }
}

export default withStyles(styles)(Jacob);
