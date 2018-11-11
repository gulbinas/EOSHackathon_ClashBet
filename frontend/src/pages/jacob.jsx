import React, {Component} from 'react';
import {Api, JsonRpc, RpcError, JsSignatureProvider} from 'eosjs'; // https://github.com/EOSIO/eosjs

// material-ui dependencies
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const endpoint = "http://10.7.1.73:8888";

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
    }
});

class Jacob extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    getTable() {
        const rpc = new JsonRpc(endpoint);

        rpc.get_table_rows({
            "json": true,
            "code": "clashbet",   // contract who owns the table
            "scope": "clashbet",  // scope of the table
            "table": "challange",    // name of the table as specified by the contract abi
            "limit": 100,
        }).then(result => this.setState({ noteTable: result.rows }));

    }

    componentDidMount() {
        this.getTable();
    }

    returnHome = (event) => {
        event.preventDefault();

        window.location.href = "/";
    };

    render() {
        const {classes} = this.props;

        const redirectButton = (
            <Button variant="outlined" onClick={this.returnHome} color="secondary">Decline</Button>
        );

        const footerContainer = (
            <div className={classes.footer}>
                Powered by <strong>ClashBet</strong>
            </div>
        );

        return (
            <div className="App">
                <div className={classes.clash}>
                    <div className={classes.mainCon}>
                        <div className={classes.formFooter}>
                            <Button onClick={this.cancelChallenge} variant="contained" color="primary">Accept challenge</Button>
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
