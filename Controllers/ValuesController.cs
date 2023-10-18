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
            var createdAccountIds = new List<Guid>(); // Change to Guid type

            foreach (var ownerDto in dto.Owners)
            {
                var accountOwner = new AccountOwner
                {
                    Name = ownerDto.Name,
                    Gender = ownerDto.Gender,
                    DateOfBirth = ownerDto.DateOfBirth
                };

                _context.AccountOwners.Add(accountOwner);
                accountOwners.Add(accountOwner);

                foreach (var acc in dto.Accounts)
                {
                    var account = new Account
                    {
                        GeneralAccountName = acc.GeneralAccountName,
                        CoinType = acc.CoinType,
                        AccountType = acc.AccountType,
                        CashInvested = acc.CashInvested,
                    };

                    _context.Accounts.Add(account);
                    await _context.SaveChangesAsync();  // Save immediately to generate the AccountId

                    createdAccountIds.Add(account.AccountId);

                    var accountOwnerAccount = new AccountOwnerAccount
                    {
                        AccountOwner = accountOwner,
                        Account = account
                    };

                    _context.AccountOwnerAccounts.Add(accountOwnerAccount);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { AccountOwners = accountOwners, CreatedAccountIds = createdAccountIds });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while processing the AddEntity request.");
            return BadRequest($"Error: {ex.Message}");
        }
    }



    // You can add other necessary methods here as well
}
