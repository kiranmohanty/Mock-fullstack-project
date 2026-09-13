using GridApi.Models;
using GridApi.DTOs;

namespace GridApi.Repositories
{
    public interface IItemRepository
    {
        Task<GridResponseDto> GetItemsAsync(int pageNumber, int pageSize, string sortBy, string sortOrder, string? searchText);
        Task<ItemDto?> GetItemByIdAsync(int id);
        Task<ItemDto> CreateItemAsync(CreateItemDto dto);
        Task<ItemDto?> UpdateItemAsync(int id, UpdateItemDto dto);
        Task<bool> DeleteItemAsync(int id);
    }
}
