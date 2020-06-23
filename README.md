# Dissinet

# Dissinet Client

# Dissinet Database

# Dissinet Server

## Endpoints 

### Actants `/actants`

### Actions `/actions`

### Statements `/statements`

#### CRUD

- [x] `GET /statements`
- [x] `GET /statements/{id}`
- [x] `POST /statements`
- [x] `DELETE /statements/{id}`

#### Paging

- [ ] `GET /statements?limit=100`
- [ ] `GET /statements?limit=100&offset=10`

#### Ordering (Sorting)

- [ ] `GET /statements/order_by=desc(certainty)`

#### Filtering

- [x] `GET /statements/{id}?territoryId={id}`

### Territories
