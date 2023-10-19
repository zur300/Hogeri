import React, { Component } from 'react';
import './AccountForm.css';

export class AccountForm extends Component {
    static displayName = AccountForm.name;

    constructor(props) {
        super(props);
        this.state = {
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
    }

    handleOwnerChange = (index, field, value) => {
        const updatedOwners = [...this.state.Owners];
        updatedOwners[index][field] = value;
        this.setState({ Owners: updatedOwners });
    }

    handleAddOwner = () => {
        this.setState(prevState => ({
            Owners: [...prevState.Owners, { OwnerId: "", Name: "", Gender: "Male", DateOfBirth: "" }]
        }));
    }

    handleAddAccount = (ownerIndex) => { // Pass the index of the owner to which you want to add an account
        const updatedOwners = [...this.state.Owners];
        if (updatedOwners[ownerIndex].Accounts.length < 3) {
            updatedOwners[ownerIndex].Accounts.push({ GeneralAccountName: "", CoinType: "", AccountType: "", CashInvested: 0 });
            this.setState({ Owners: updatedOwners });
        }
    }

    handleAccountChange = (ownerIndex, accountIndex, field, value) => {
        const updatedOwners = [...this.state.Owners];
        if (field === 'CashInvested') {
            value = Number(value);
        }
        updatedOwners[ownerIndex].Accounts[accountIndex][field] = value;
        this.setState({ Owners: updatedOwners });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
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
        } else {
            alert('Error saving data!');
        }
    }


    render() {
        const { Owners } = this.state;

        return (
            <div className="container">
                <h2>Account Owner Form</h2>
                <form onSubmit={this.handleSubmit}>

                    {Owners.map((owner, ownerIndex) => (
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
                            <button type="button" onClick={this.handleAddOwner}>Add Another Owner</button>

                            {owner.Accounts.map((account, accountIndex) => (
                                <div key={accountIndex}>
                                    <h3>Account Details (Max 3)</h3>

                                    <label>
                                        General Account Name:
                                        <input type="text" value={account.GeneralAccountName} onChange={e => this.handleAccountChange(ownerIndex, accountIndex, 'GeneralAccountName', e.target.value)} required />
                                    </label><br />

                                    <label>
                                        Coin Type:
                                        <input type="text" value={account.CoinType} onChange={e => this.handleAccountChange(ownerIndex, accountIndex, 'CoinType', e.target.value)} required />
                                    </label><br />

                                    <label>
                                        Account Type:
                                        <input type="text" value={account.AccountType} onChange={e => this.handleAccountChange(ownerIndex, accountIndex, 'AccountType', e.target.value)} required />
                                    </label><br />

                                    <label>
                                        Cash Invested:
                                        <input type="number" value={account.CashInvested} onChange={e => this.handleAccountChange(ownerIndex, accountIndex, 'CashInvested', e.target.value)} required />
                                    </label><br />
                                </div>
                            ))}

                            {owner.Accounts.length < 3 && (
                                <button type="button" onClick={() => this.handleAddAccount(ownerIndex)}>Add Another Account</button>
                            )}
                        </div>
                    ))}

                    

                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }

}
