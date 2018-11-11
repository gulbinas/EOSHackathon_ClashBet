const _ = require('lodash');
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  Button,
  Form,
  ScrollView,
} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import uuid from 'uuid';
import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs-rn';

const ENDPOINT = 'http://10.7.1.73:8888';

const wow = new JsonRpc(ENDPOINT);

const accounts = {
    challenger: {
        'name': "alice",
        'privateKey': "5Kcu8cbdyjTXD5e1QsRLmX6JYqGMC9mSRsFgDwKPk48j4MmPyBW",
        'publicKey': "EOS7yHr8Hd55v4GVs6QTMrAiK3x1g89sMRMgkxvTw4TrrSzExmTdv"
    },
    challengee: {
        "name": "bob",
        "privateKey": "5JofWdxYbzV6ipNmEdiaZibVxg9GYMLAFiKEWiYSuz3YEEHJHbb",
        "publicKey": "EOS8Ke736LWfLfXdw4vFVYGG3Hf5iVDJhdPherwA7P9nuxdKaUfz7"
    }
};

class ChallangeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opponentTag: '123456789',
      betValue: '0',
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async createChallenge() {
    let account = accounts.challenger.name;
    let privateKey = accounts.challenger.privateKey;

    // prepare variables for the switch below to send transactions
    let uid = uuid.v4();

    let actionName = "createchall";
    let actionData = {
      player: this.state.opponentTag,
      amount: Number(this.state.betValue),
      challangeHash: uid
    };

    // eosjs function call: connect to the blockchain
    const rpc = new JsonRpc(ENDPOINT);
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

        alert('!!!!')
        console.log('!!!!', this.state);
    } catch (e) {
        console.log('Caught exception: ' + e);
        if (e instanceof RpcError) {
            console.log(JSON.stringify(e.json, null, 2));
        }
    }
  }

  handleNameChange(text) {
    this.setState({ opponentTag: text.toUpperCase() });
  }

  handleValueChange(text) {
    this.setState({ betValue: text.toUpperCase() });
  }

  async handleSubmit(event) {
    event.preventDefault();
    await this.createChallenge();
  }

  render() {
    return (
      <ImageBackground style={styles.bgImg} source={require('./iphoneCRBg.png')}>
      <View style={styles.columnContainer}>
        <View style={styles.buttonContainer}>
          <TextInput
            style={styles.inputContainer}
            value={this.state.opponentTag}
            onChangeText={this.handleNameChange}
            maxLength={9}
          />
          <TextInput
            style={styles.inputContainer}
            value={this.state.betValue}
            onChangeText={this.handleValueChange}
            maxLength={9}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title='Challange' color="#000000" onPress={this.handleSubmit} />
        </View>
        </View>
      </ImageBackground>
    );
  }
}

// amount: 10
// challangeWinner: “”
// challangerName: “alice”
// gameId: 1
// hash: “537252cd-73bc-4f45-b55c-9e81c28d86c8”
// key: 0
// opponentName: “bob”
// state: 20

const CellVariant = (props) => (
  <Cell
    {...props}
    cellContentView={
      <View
        style={{ alignItems: 'center', flexDirection: 'column', flex: 1, paddingVertical: 10, alignSelf: 'stretch', height: 150}}
        key={props.key}
      >
        <Text
          allowFontScaling
          numberOfLines={2}
          style={{ flex: 1, fontSize: 20 }}
        >
          Challanger: {props.name} {'\n'}
          Winner: {props.winner} {'\n'}
        </Text>
        <View style={styles.buttonAccept}>
          <Button title='Accpet Challange' color="#000000" onPress={() => props.handlePress(props.hhh)}/>
        </View>
      </View>
    }
  />
);

class ChallangesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rows: [] };
  }
  componentDidMount() {
    wow.get_table_rows({
       json: true,
       code: 'clashbet',   // contract who owns the table
       scope: 'clashbet',  // scope of the table
       table: 'challange',    // name of the table as specified by the contract abi
       limit: 100,
    })
    .then(result => {
      this.setState({
        rows: result.rows,
      });
    });
  }
  async acceptChallenge(uid) {
    console.log('INN acceptChallenge', uid);
    let account = accounts.challengee.name;
    let privateKey = accounts.challengee.privateKey;

    let actionName = "acceptchal";
    let actionData = {
        player: account,
        challangeHash: uid,
    };


    // eosjs function call: connect to the blockchain
    const rpc = new JsonRpc(ENDPOINT);
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
        console.log('!!!STATE!!');
        this.getTable();
    } catch (e) {
        console.log('Caught exception: ' + e);
        if (e instanceof RpcError) {
            console.log(JSON.stringify(e.json, null, 2));
        }
    }
  }
  handlePress(uid) {
    console.log('!!!', uid);
    this.acceptChallenge(uid);
  }
  render() {
    return (
      <View style={{ paddingVertical: 60 }}>
      <ScrollView contentContainerStyle={styles.stage}>
      <TableView>
        <Section>
          {this.state.rows.map(row => <CellVariant name={row.challangerName} key={row.hash} hhh={row.hash} winner={row.challangeWinner} handlePress={this.handlePress.bind(this)} />)}
        </Section>
      </TableView>
      </ScrollView>
      </View>
    );
  }
}
//
// <TableView
//   style={{ flex: 1 }}
//   tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
// >
//   <Section>
//     {this.state.rows.map(row => <Item key={row.state}>{row.state}</Item>)}
//   </Section>
// </TableView>

const Tab = createBottomTabNavigator({
    Challange: {screen: ChallangeScreen},
    Challanges: {screen: ChallangesScreen},
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return < Tab />;
    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.welcome}>Welcome to React Native!</Text>
    //     <Text style={styles.instructions}>To get started, edit App.js</Text>
    //     <Text style={styles.instructions}>{instructions}</Text>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  columnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bgImg: {
    width: '100%',
    height: '100%'
  },
  input: {
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    height: 44,
    fontSize: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    width: '80%',
  },
  buttonAccept: {
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#526EFF',
    overflow: 'hidden',
    width: '80%',
  },
});
