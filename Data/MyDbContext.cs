using Microsoft.EntityFrameworkCore;
using Hogeri.Models;
using Pomelo.EntityFrameworkCore.MySql;

namespace Hogeri.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        // DBSet properties representing the tables in the database
        public DbSet<MyEntity> MyEntities { get; set; }
        public DbSet<AccountOwner> AccountOwners { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<AccountOwnerAccount> AccountOwnerAccounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuring the composite key for the AccountOwnerAccount junction table
            modelBuilder.Entity<AccountOwnerAccount>()
                .HasKey(aoa => new { aoa.AccountOwnerId, aoa.AccountId });

            // Setting up the many-to-many relationship between AccountOwner and Account
            // Configuring the foreign key and navigation properties for the AccountOwner side of the relationship
            modelBuilder.Entity<AccountOwnerAccount>()
                .HasOne(aoa => aoa.AccountOwner)
                .WithMany(ao => ao.AccountOwnerAccounts)
                .HasForeignKey(aoa => aoa.AccountOwnerId);

            // Configuring the foreign key and navigation properties for the Account side of the relationship
            modelBuilder.Entity<AccountOwnerAccount>()
                .HasOne(aoa => aoa.Account)
                .WithMany(a => a.AccountOwnerAccounts)
                .HasForeignKey(aoa => aoa.AccountId);

            // Automatically generate account numbers for new Account entities using UUIDs (for MySQL)
            modelBuilder.Entity<Account>()
                .Property(a => a.AccountId)
                .HasDefaultValueSql("UUID()");
        }
    }
}
