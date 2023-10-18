namespace Hogeri.Models
{
    public class AccountOwnerAccount
    {
        public string AccountOwnerId { get; set; }
        public AccountOwner AccountOwner { get; set; }

        public int AccountId { get; set; }
        public Account Account { get; set; }
    }
}
