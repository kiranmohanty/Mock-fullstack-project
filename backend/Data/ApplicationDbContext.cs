using Microsoft.EntityFrameworkCore;
using GridApi.Models;

namespace GridApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Item entity
            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Seed sample data
            modelBuilder.Entity<Item>().HasData(
                new Item { Id = 1, Name = "John Doe", Email = "john@example.com", Phone = "555-0101", Address = "123 Main St", CreatedAt = DateTime.UtcNow },
                new Item { Id = 2, Name = "Jane Smith", Email = "jane@example.com", Phone = "555-0102", Address = "456 Oak Ave", CreatedAt = DateTime.UtcNow },
                new Item { Id = 3, Name = "Bob Johnson", Email = "bob@example.com", Phone = "555-0103", Address = "789 Pine Rd", CreatedAt = DateTime.UtcNow },
                new Item { Id = 4, Name = "Alice Brown", Email = "alice@example.com", Phone = "555-0104", Address = "321 Elm St", CreatedAt = DateTime.UtcNow },
                new Item { Id = 5, Name = "Charlie Davis", Email = "charlie@example.com", Phone = "555-0105", Address = "654 Birch Ln", CreatedAt = DateTime.UtcNow }
            );
        }
    }
}
