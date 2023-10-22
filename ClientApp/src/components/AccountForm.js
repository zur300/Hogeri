import React, { Component } from 'react';
import './AccountForm.css';

export class AccountForm extends Component {
    static displayName = AccountForm.name;
   

    constructor(props) {
        super(props);
        const defalutState = {
            Owners: [{
                OwnerId: "",
                Name: "",
                Gender: "Male",
                DateOfBirth: "",
                Accounts: [ // Nest accounts within owners
                    { GeneralAccountName: "", CoinType: "", AccountType: "", CashInvested: 0 }
                ]
            }]
        };
        this.state = defalutState 
    }

    handleOwnerChange = (index, field, value) => {
        const updatedOwners = [...this.state.Owners];
        updatedOwners[index][field] = value;
        this.setState({ Owners: updatedOwners });
    }

    handleAddOwner = () => {
        this.setState(prevState => ({
            Owners: [...prevState.Owners, { OwnerId: "", Name: "", Gender: "Male", DateOfBirth: "", Accounts: [] }]
        }));
    }

    handleAddAccount = (ownerIndex) => { // Pass the index of the owner to which you want to add an account
        const updatedOwners = [...this.state.Owners];
        if (updatedOwners[ownerIndex].Accounts.length < 3) {
            updatedOwners[ownerIndex].Accounts.push({ GeneralAccountName: "", CoinType: "", AccountType: "", CashInvested: 0 });
            this.setState({ Owners: updatedOwners });
        }
    }

    handleAccountChange = (accountIndex, field, value) => {
        const updatedOwners = [...this.state.Owners];
        if (field === 'CashInvested') {
            value = Number(value);
        }
        updatedOwners[0].Accounts[accountIndex][field] = value;
        this.setState({ Owners: updatedOwners });
    };


    // Async function because ?  Front speaks with the server in async way ( two way )
    handleSubmit = async (e) => {
        e.preventDefault();
        const updateAccounts = { ...this.state };

        // Check if there is more then one account submited 
        if (updateAccounts.Owners[1]) {
            updateAccounts.Owners[1].Accounts = this.state.Owners[0].Accounts;
        }

        if (updateAccounts.Owners[2]) {
            updateAccounts.Owners[2].Accounts = this.state.Owners[0].Accounts;
        }
        this.setState(updateAccounts);


        console.log(this.state);


        const formData = {
            Owners: this.state.Owners
 
        };


        const response = await fetch('https://localhost:7063/api/values', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Data saved successfully!');
            this.setState({
                Owners: [{
                    OwnerId: "",
                    Name: "",
                    Gender: "Male",
                    DateOfBirth: "",
                    Accounts: [ // Nest accounts within owners
                        { GeneralAccountName: "", CoinType: "", AccountType: "", CashInvested: 0 }
                    ]
                }]
            });
        } else {
            alert('Error saving data!');
        }
    }

    // REnder the AccountFrom
    render() {
        const { Owners } = this.state;

        return (
            <div className="container">
                <h2>Account Owner Form</h2>
                <form onSubmit={this.handleSubmit}>

                    {Owners?.map((owner, ownerIndex) => (
                        <div key={ownerIndex}>
                            <h3>Owner Details</h3>

                            <label>
                                ID:
                                <input type="text" value={owner.OwnerId} onChange={e => this.handleOwnerChange(ownerIndex, 'OwnerId', e.target.value)} required />
                            </label><br />

                            <label>
                                Name:
                                <input type="text" value={owner.Name} onChange={e => this.handleOwnerChange(ownerIndex, 'Name', e.target.value)} required />
                            </label><br />

                            <label>
                                Gender:
                                <select value={owner.Gender} onChange={e => this.handleOwnerChange(ownerIndex, 'Gender', e.target.value)}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </label><br />

                            <label>
                                Date of Birth:
                                <input type="date" value={owner.DateOfBirth} onChange={e => this.handleOwnerChange(ownerIndex, 'DateOfBirth', e.target.value)} required />
                            </label><br />

                        </div>

                    ))}
                    {Owners.length < 3 && (
                    <button type="button" onClick={this.handleAddOwner}>Add Another Owner</button>
                    )}

                    {Owners[0].Accounts.map((account, accountIndex) => (
                                <div key={accountIndex}>
                                    <h3>Account Details (Max 3)</h3>

                                    <label>
                                        General Account Name:
                                        <input type="text" value={account.GeneralAccountName} onChange={e => this.handleAccountChange( accountIndex, 'GeneralAccountName', e.target.value)} required />
                                    </label><br />

                                    <label>
                                        Coin Type:
                                        <input type="text" value={account.CoinType} onChange={e => this.handleAccountChange( accountIndex, 'CoinType', e.target.value)} required />
                                    </label><br />

                                    <label>
                                        Account Type:
                                        <input type="text" value={account.AccountType} onChange={e => this.handleAccountChange( accountIndex, 'AccountType', e.target.value)} required />
                                    </label><br />

                                    <label>
                                        Cash Invested:
                                        <input type="number" value={account.CashInvested} onChange={e => this.handleAccountChange( accountIndex, 'CashInvested', e.target.value)} required />
                                    </label><br />
                           
                                </div>
                    ))}
                    {Owners[0].Accounts.length < 3 && (
                        <button type="button" onClick={() => this.handleAddAccount(0)}>Add Another Account</button>
                    )}

                            
                  

                    

                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }

}
