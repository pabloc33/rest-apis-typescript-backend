import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
  test("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);

    expect(response.status).not.toEqual(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  test("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo",
      price: 0,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toEqual(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  test("should validate that the price is a number and greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo",
      price: "hola",
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.status).not.toEqual(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  test("should creat a new product", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Mouse - Testing",
      price: 50,
    });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products", () => {
  test("should check if api/product url exist", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).not.toBe(404);
  });

  test("GET a JSON response with products", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveLength(1);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products/:id", () => {
  test("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server).get(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });

  test("should check a valid ID in the URL", async () => {
    const productId = "abc";
    const response = await request(server).get(`/api/products/${productId}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("ID no válido");
    expect(response.body.errors).toHaveLength(1);
  });

  test("get a JSON response for a single product", async () => {
    const productId = 1;
    const response = await request(server).get(`/api/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  test("should display validation error messages when updating a product", async () => {
    const productId = 1;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("should validate that the price is greater than 0", async () => {
    const productId = 1;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitor Curvo",
        price: -300,
        availability: true,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Precio no válido");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("should check a valid ID in the URL", async () => {
    const productId = "abc";
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Teclado - Actualizado",
        price: 200,
        availability: true,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("ID no válido");
    expect(response.body.errors).toHaveLength(1);
  });

  test("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitor Curvo",
        price: 300,
        availability: true,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("should update an existing product with valid data", async () => {
    const productId = 1;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitor Curvo",
        price: 300,
        availability: true,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("PATCH /api/products/:id", () => {
  test("should return a 404 response for a non-existing product", async () => {
    const productId = 2000;
    const response = await request(server)
      .patch(`/api/products/${productId}`)
      .send({});

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("should update the product ", async () => {
    const productId = 1;
    const response = await request(server)
      .patch(`/api/products/${productId}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("error");
  });
});

describe("DELETE /api/products/:id", () => {
  test("should check a valid ID", async () => {
    const productId = "abc";
    const response = await request(server)
      .delete(`/api/products/${productId}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("ID no válido");
    expect(response.body.errors).toHaveLength(1);
  });

  test("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server)
      .delete(`/api/products/${productId}`)
      .send({});

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("should delete a product", async () => {
    const productId = 1;
    const response = await request(server)
      .delete(`/api/products/${productId}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBe("Producto Eliminado");

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("error");
  });
});
