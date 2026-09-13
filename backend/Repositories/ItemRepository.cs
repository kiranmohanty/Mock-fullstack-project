using GridApi.Data;
using GridApi.Models;
using GridApi.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace GridApi.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly ApplicationDbContext _context;

        public ItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GridResponseDto> GetItemsAsync(int pageNumber, int pageSize, string sortBy, string sortOrder, string? searchText)
        {
            var query = _context.Items.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                searchText = searchText.ToLower();
                query = query.Where(x => x.Name.ToLower().Contains(searchText) ||
                                         x.Email.ToLower().Contains(searchText) ||
                                         x.Phone.ToLower().Contains(searchText) ||
                                         x.Address.ToLower().Contains(searchText));
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply sorting
            var validSortColumns = new[] { "id", "name", "email", "phone", "address", "createdAt" };
            var sortColumn = validSortColumns.Contains(sortBy.ToLower()) ? sortBy : "id";
            var sortDirection = sortOrder.ToLower() == "desc" ? "descending" : "ascending";

            query = query.OrderBy($"{sortColumn} {sortDirection}");

            // Apply pagination
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new GridResponseDto
            {
                Items = items.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<ItemDto?> GetItemByIdAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            return item != null ? MapToDto(item) : null;
        }

        public async Task<ItemDto> CreateItemAsync(CreateItemDto dto)
        {
            var item = new Item
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                CreatedAt = DateTime.UtcNow
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();
            return MapToDto(item);
        }

        public async Task<ItemDto?> UpdateItemAsync(int id, UpdateItemDto dto)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return null;

            item.Name = dto.Name;
            item.Email = dto.Email;
            item.Phone = dto.Phone;
            item.Address = dto.Address;

            _context.Items.Update(item);
            await _context.SaveChangesAsync();
            return MapToDto(item);
        }

        public async Task<bool> DeleteItemAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return false;

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        private static ItemDto MapToDto(Item item)
        {
            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Email = item.Email,
                Phone = item.Phone,
                Address = item.Address,
                CreatedAt = item.CreatedAt
            };
        }
    }
}
