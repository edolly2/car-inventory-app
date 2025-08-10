import React, { useState, useEffect } from "react";

export default function CarInventoryManager() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ id: null, make: "", model: "", year: "", price: "" });
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState({ min: "", max: "" });
  const [filterPrice, setFilterPrice] = useState({ min: "", max: "" });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("carInventory");
    if (saved) setCars(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("carInventory", JSON.stringify(cars));
  }, [cars]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editing) {
      setCars(cars.map((car) => (car.id === form.id ? form : car)));
      setEditing(false);
    } else {
      setCars([...cars, { ...form, id: Date.now() }]);
    }

    setForm({ id: null, make: "", model: "", year: "", price: "" });
  };

  const handleEdit = (car) => {
    setForm(car);
    setEditing(true);
  };

  const handleDelete = (id) => {
    setCars(cars.filter((car) => car.id !== id));
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Search, filter, sort pipeline
  const filteredCars = cars
    .filter((car) => {
      const searchText = search.toLowerCase();
      return (
        car.make.toLowerCase().includes(searchText) ||
        car.model.toLowerCase().includes(searchText) ||
        car.year.toString().includes(searchText) ||
        car.price.toString().includes(searchText)
      );
    })
    .filter((car) => {
      if (filterYear.min && Number(car.year) < Number(filterYear.min)) return false;
      if (filterYear.max && Number(car.year) > Number(filterYear.max)) return false;
      return true;
    })
    .filter((car) => {
      if (filterPrice.min && Number(car.price) < Number(filterPrice.min)) return false;
      if (filterPrice.max && Number(car.price) > Number(filterPrice.max)) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const valA = Number(a[sortConfig.key]);
      const valB = Number(b[sortConfig.key]);
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });

  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <h1>Eric's Car Inventory Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="make"
          placeholder="Make"
          value={form.make}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button type="submit">{editing ? "Update Car" : "Add Car"}</button>
      </form>

      {/* Search & Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search make/model/year/price..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        {/* Year Filter */}
        <input
          type="number"
          placeholder="Min Year"
          value={filterYear.min}
          onChange={(e) => setFilterYear({ ...filterYear, min: e.target.value })}
          style={{ width: "100px", marginRight: "5px" }}
        />
        <input
          type="number"
          placeholder="Max Year"
          value={filterYear.max}
          onChange={(e) => setFilterYear({ ...filterYear, max: e.target.value })}
          style={{ width: "100px", marginRight: "20px" }}
        />

        {/* Price Filter */}
        <input
          type="number"
          placeholder="Min Price"
          value={filterPrice.min}
          onChange={(e) => setFilterPrice({ ...filterPrice, min: e.target.value })}
          style={{ width: "100px", marginRight: "5px" }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filterPrice.max}
          onChange={(e) => setFilterPrice({ ...filterPrice, max: e.target.value })}
          style={{ width: "100px" }}
        />
      </div>

      {/* Table */}
      {filteredCars.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>
                Year{" "}
                <button onClick={() => handleSort("year")}>
                  {sortConfig.key === "year" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
                </button>
              </th>
              <th>
                Price{" "}
                <button onClick={() => handleSort("price")}>
                  {sortConfig.key === "price" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
                </button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => (
              <tr key={car.id}>
                <td>{car.make}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>${Number(car.price).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(car)}>Edit</button>
                  <button onClick={() => handleDelete(car.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cars match your search/filter.</p>
      )}
    </div>
  );
}
