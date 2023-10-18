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

    [HttpPost]
    public async Task<IActionResult> AddEntity([FromBody] AccountOwnerWithAccountsDto dto)
    {
        try
        {
            var accountOwners = new List<AccountOwner>();

            foreach (var ownerDto in dto.Owners)
            {
                // Check if an owner with the given ID already exists
                var existingAccountOwner = await _context.AccountOwners
                                                         .Include(ao => ao.AccountOwnerAccounts)
                                                         .ThenInclude(aoa => aoa.Account)
                                                         .FirstOrDefaultAsync(ao => ao.Name == ownerDto.Name); // Assuming Name as unique identifier

                if (existingAccountOwner != null)
                {
                    // Update the properties of the existing owner
                    existingAccountOwner.Name = ownerDto.Name;
                    existingAccountOwner.Gender = ownerDto.Gender;
                    existingAccountOwner.DateOfBirth = ownerDto.DateOfBirth;

                    // Handle accounts associated with the existing owner
                    foreach (var accountDto in ownerDto.Accounts)
                    {
                        var account = new Account
                        {
                            AccountId = Guid.NewGuid(),
                            GeneralAccountName = accountDto.GeneralAccountName,
                            CoinType = accountDto.CoinType,
                            AccountType = accountDto.AccountType,
                            CashInvested = accountDto.CashInvested
                        };

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
                        Name = ownerDto.Name,
                        Gender = ownerDto.Gender,
                        DateOfBirth = ownerDto.DateOfBirth,
                    };

                    _context.AccountOwners.Add(accountOwner);
                    accountOwners.Add(accountOwner);

                    // Handle accounts for the new owner
                    foreach (var accountDto in ownerDto.Accounts)
                    {
                        var account = new Account
                        {
                            AccountId = Guid.NewGuid(),
                            GeneralAccountName = accountDto.GeneralAccountName,
                            CoinType = accountDto.CoinType,
                            AccountType = accountDto.AccountType,
                            CashInvested = accountDto.CashInvested
                        };

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
