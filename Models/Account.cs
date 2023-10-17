namespace Hogeri.Models
{
    public class Account
    {
        public int Id { get; set; }
        public string AccountId { get; set; } // This seems to be a UUID based on your migration
        public string GeneralAccountName { get; set; }
        public string CoinType { get; set; }
        public string AccountType { get; set; }
        public double CashInvested { get; set; }

        // Navigation property for the many-to-many relation
        public ICollection<AccountOwnerAccount> AccountOwnerAccounts { get; set; }
    }
}
