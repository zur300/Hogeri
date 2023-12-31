﻿using System.ComponentModel.DataAnnotations;

namespace Hogeri.Models
{
    public class AccountOwner
    {
        [Key]
        public string OwnerId { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
       

        // Navigation property for the many-to-many relation
        public ICollection<AccountOwnerAccount> AccountOwnerAccounts { get; set; }
    }
}
