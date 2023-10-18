import React, { Component } from 'react';
import './AccountForm.css';

export class AccountForm extends Component {
    static displayName = AccountForm.name;

    constructor(props) {
        super(props);
        this.state = {
            Owners: [{
                Id: "",
                Name: "",
                Gender: "Male",
                DateOfBirth: ""
            }],
            Accounts: [
                { GeneralAccountName: "", CoinType: "", AccountType: "", CashInvested: 0 }
            ]
        };
    }

    handleOwnerChange = (index, field, value) => {
        const updatedOwners = [...this.state.Owners];
        updatedOwners[index][field] = value;
        this.setState({ Owners: updatedOwners });
    }

    handleAddOwner = () => {
        this.setState(prevState => ({
            Owners: [...prevState.Owners, { Id: "", Name: "", Gender: "Male", DateOfBirth: "" }]
        }));
    }

    handleAddAccount = () => {
        if (this.state.Accounts.length < 3) {
            this.setState(prevState => ({
                Accounts: [...prevState.Accounts, { GeneralAccountName: "", CoinType: "", AccountType: "", CashInvested: 0 }]
            }));
        }
    }

    handleAccountChange = (index, field, value) => {
        const updatedAccounts = [...this.state.Accounts];
        if (field === 'CashInvested') {
            value = Number(value);
        }
        updatedAccounts[index][field] = value;
        this.setState({ Accounts: updatedAccounts });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        console.log(this.state);

        const formData = {
            Owners: this.state.Owners,
            Accounts: this.state.Accounts
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
        const { Owners, Accounts } = this.state;
        return (
            <div className="container">
                <h2>Account Owner Form</h2>
                <form onSubmit={this.handleSubmit}>
                    {Owners.map((owner, index) => (
                        <div key={index}>
                            <h3>Owner Details</h3>
                            <label>
                                ID:
                                <input type="text" value={owner.Id} onChange={e => this.handleOwnerChange(index, 'Id', e.target.value)} required />
                            </label><br />
                            <label>
                                Name:
                                <input type="text" value={owner.Name} onChange={e => this.handleOwnerChange(index, 'Name', e.target.value)} required />
                            </label><br />
                            <label>
                                Gender:
                                <select value={owner.Gender} onChange={e => this.handleOwnerChange(index, 'Gender', e.target.value)}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </label><br />
                            <label>
                                Date of Birth:
                                <input type="date" value={owner.DateOfBirth} onChange={e => this.handleOwnerChange(index, 'DateOfBirth', e.target.value)} required />
                            </label><br />
                        </div>
                    ))}
                    <button type="button" onClick={this.handleAddOwner}>Add Another Owner</button>

                    {Accounts.map((account, index) => (
                        <div key={index}>
                            <h3>Account Details (Max 3)</h3>
                            <label>
                                General Account Name:
                                <input type="text" value={account.GeneralAccountName} onChange={e => this.handleAccountChange(index, 'GeneralAccountName', e.target.value)} required />
                            </label><br />
                            <label>
                                Coin Type:
                                <input type="text" value={account.CoinType} onChange={e => this.handleAccountChange(index, 'CoinType', e.target.value)} required />
                            </label><br />
                            <label>
                                Account Type:
                                <input type="text" value={account.AccountType} onChange={e => this.handleAccountChange(index, 'AccountType', e.target.value)} required />
                            </label><br />
                            <label>
                                Cash Invested:
                                <input type="number" value={account.CashInvested} onChange={e => this.handleAccountChange(index, 'CashInvested', e.target.value)} required />
                            </label><br />
                        </div>
                    ))}
                    {Accounts.length < 3 && (
                        <button type="button" onClick={this.handleAddAccount}>Add Another Account</button>
                    )}

                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}
