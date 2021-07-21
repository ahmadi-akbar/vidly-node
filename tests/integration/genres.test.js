const { expectCt } = require("helmet");
const { iteratee } = require("lodash");
const request = require("supertest");
const { Genre } = require("../../modules/genre");
let server;
const { User } = require("../../modules/user");

describe("./api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });

  describe("Get/", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([{ name: "genre1" }, { name: "genre2" }]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Get/:id", () => {
    it("should return a Genre if valid Id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return a 404 if invalid Id is passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });
  // // Traditional way Post
  // describe("Post", () => {
  //   it("should return 401 if client is not logged in", async () => {
  //     const res = await request(server).post("./api/genres").send({ name: "genre1" });
  //     expect(res.status).toBe(401);
  //   });

  //   it("should return 400 if genre is less than5 character", async () => {
  //     const token = new User().generateAuthToken();

  //     const res = await (await request(server).post("./api/genres")).set("x-auth-token", token).send({ name: "1234" });

  //     expect(res.status).toBe(400);
  //   });

  //   it("should return 400 if genre is more than 50 character", async () => {
  //     const token = new User().generateAuthToken();

  //     const name = newArray(52).join("a");
  //     const res = await (await request(server).post("./api/genres")).set("x-auth-token", token).send({ name: name });

  //     expect(res.status).toBe(400);
  //   });

  //   it("shouldsave the genre if it is valid", async () => {
  //     const token = new User().generateAuthToken();

  //     const res = await (await request(server).post("./api/genres")).set("x-auth-token", token).send({ name: "genre1" });

  //     const genre = await Genre.find({ name: "genre1" });
  //     expect(genre).not.toBeNull();
  //   });

  //   it("should return the genre if it is valid", async () => {
  //     const token = new User().generateAuthToken();

  //     const res = await (await request(server).post("./api/genres")).set("x-auth-token", token).send({ name: "genre1" });

  //     expect(res.body).toHaveProperty("_id");
  //     expect(res.body).toHaveProperty("name", "genre1");
  //   });
  // });

  // Mosh's Refacturing Post
  describe("Post", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server).post("/api/genres").set("x-auth-token").send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token: "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than5 character", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 character", async () => {
      name = newArray(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("shouldsave the genre if it is valid", async () => {
      await exec();
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
