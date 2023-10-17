﻿using System;
using System.Collections.Generic;

namespace Hogeri.Models
{
    public class AccountOwnerWithAccountsDto
    {
        public List<OwnerDto> Owners { get; set; }
        public List<AccountDto> Accounts { get; set; }
    }

    public class OwnerDto
    {
        public string Name { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
    }

    public class AccountDto
    {
        public string GeneralAccountName { get; set; }
        public string CoinType { get; set; }
        public string AccountType { get; set; }
        public double CashInvested { get; set; }
    }
}