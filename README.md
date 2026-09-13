# Grid Application - Full Stack

## Overview
A full-stack application with Angular 22 frontend using CDK virtual scrolling and .NET Core 8 backend with EF Core.

## Features

### Frontend (Angular 22)
- **CDK Virtual Scrolling**: Efficiently render large datasets
- **Pagination**: Navigate through pages of data
- **Sorting**: Click column headers to sort
- **Debounced Search**: Search with 300ms debounce to optimize API calls
- **Edit/Delete**: Inline edit dialog and delete confirmation
- **Material Design**: Professional UI with Angular Material

### Backend (.NET Core 8)
- **REF Core**: Database ORM for SQL Server
- **REST API**: Full CRUD operations
- **Pagination**: Server-side pagination support
- **Filtering**: Search across multiple fields
- **Sorting**: Flexible sorting on any column
- **CORS**: Enabled for Angular frontend on localhost:4200

## Installation

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The Angular app will be available at `http://localhost:4200`

### Backend Setup
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
The API will be available at `http://localhost:5000`

## API Endpoints

### GET /api/items
Fetch items with pagination, sorting, and search

**Query Parameters:**
- `pageNumber` (int): Page number (1-based)
- `pageSize` (int): Items per page
- `sortBy` (string): Column to sort by (id, name, email, phone, address, createdAt)
- `sortOrder` (string): asc or desc
- `searchText` (string): Optional search text

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-0101",
      "address": "123 Main St",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalCount": 5,
  "pageNumber": 1,
  "pageSize": 10
}
```

### POST /api/items
Create a new item

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "555-0102",
  "address": "456 Oak Ave"
}
```

### PUT /api/items/{id}
Update an existing item

### DELETE /api/items/{id}
Delete an item

## Database
- **SQL Server** (LocalDB for development)
- **Database Name**: GridDB
- Automatic migrations on startup
- Sample data included in seed

## Technologies

### Frontend
- Angular 22
- Angular Material
- Angular CDK
- RxJS with debounce
- TypeScript 5.5

### Backend
- .NET Core 8
- Entity Framework Core 8
- SQL Server
- Swagger/OpenAPI

## Features Details

### Debounced Search
The search input has a 300ms debounce to prevent excessive API calls while typing. The implementation uses RxJS `debounceTime` operator.

### Virtual Scrolling
The CDK virtual scrolling module is integrated to handle large datasets efficiently without rendering all rows at once.

### Responsive Design
The grid is fully responsive and works on desktop, tablet, and mobile devices.
