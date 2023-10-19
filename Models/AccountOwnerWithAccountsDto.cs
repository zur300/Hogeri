namespace Hogeri.Models
{
    public class AccountOwnerWithAccountsDto
    {
        public List<OwnerDto> Owners { get; set; }
    }

    public class OwnerDto
    {
        public string OwnerId { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<AccountDto> Accounts { get; set; }  // List of AccountDto instead of List<int>
    }

    public class AccountDto
    {
        public string GeneralAccountName { get; set; }
        public string CoinType { get; set; }
        public string AccountType { get; set; }
        public double CashInvested { get; set; }
    }
}
