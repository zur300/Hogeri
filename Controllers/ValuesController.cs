using Hogeri.Data;
using Hogeri.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;  // Add this for logging
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ValuesController : ControllerBase
{
    private readonly MyDbContext _context;
    private readonly ILogger<ValuesController> _logger;  // Declare the logger

    // Inject both MyDbContext and ILogger<ValuesController> in the constructor
    public ValuesController(MyDbContext context, ILogger<ValuesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<string> Get()
    {
        return "Hello from ASP.NET Core Web API!";
    }

    // ... [Your existing imports and declarations]

    [HttpPost]
    public async Task<IActionResult> AddEntity([FromBody] AccountOwnerWithAccountsDto dto)
    {
        try
        {
            var accountOwners = new List<AccountOwner>();
            var createdAccounts = new List<Account>(); // To store the created accounts

            // First, create the accounts outside the owner loop and save them
            foreach (var accountDto in dto.Owners.First().Accounts) // Assuming all owners in dto have the same accounts
            {
                var account = new Account
                {
                    AccountId = Guid.NewGuid(),
                    GeneralAccountName = accountDto.GeneralAccountName,
                    CoinType = accountDto.CoinType,
                    AccountType = accountDto.AccountType,
                    CashInvested = accountDto.CashInvested
                };
                _context.Accounts.Add(account);
                createdAccounts.Add(account);
            }

            await _context.SaveChangesAsync(); // Save accounts to database

            foreach (var ownerDto in dto.Owners)
            {
                var existingAccountOwner = await _context.AccountOwners
                                        .Include(ao => ao.AccountOwnerAccounts)
                                        .ThenInclude(aoa => aoa.Account)
                                        .FirstOrDefaultAsync(ao => ao.OwnerId == ownerDto.OwnerId);

                if (existingAccountOwner != null)
                {
                    // Update the properties of the existing owner
                    existingAccountOwner.Name = ownerDto.Name;
                    existingAccountOwner.Gender = ownerDto.Gender;
                    existingAccountOwner.DateOfBirth = ownerDto.DateOfBirth;

                    // Associate existing owner with the pre-created accounts
                    foreach (var account in createdAccounts)
                    {
                        var accountOwnerAccount = new AccountOwnerAccount
                        {
                            AccountOwner = existingAccountOwner,
                            Account = account
                        };
                        _context.AccountOwnerAccounts.Add(accountOwnerAccount);
                    }
                }
                else
                {
                    var accountOwner = new AccountOwner
                    {
                        OwnerId = ownerDto.OwnerId,
                        Name = ownerDto.Name,
                        Gender = ownerDto.Gender,
                        DateOfBirth = ownerDto.DateOfBirth,
                    };
                    _context.AccountOwners.Add(accountOwner);
                    accountOwners.Add(accountOwner);

                    // Associate new owner with the pre-created accounts
                    foreach (var account in createdAccounts)
                    {
                        var accountOwnerAccount = new AccountOwnerAccount
                        {
                            AccountOwner = accountOwner,
                            Account = account
                        };
                        _context.AccountOwnerAccounts.Add(accountOwnerAccount);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { AccountOwners = accountOwners });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while processing the AddEntity request.");
            return BadRequest($"Error: {ex.Message}");
        }
    }





    // You can add other necessary methods here as well
}
