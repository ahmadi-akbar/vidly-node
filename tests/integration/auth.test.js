const { User } = require("../../modules/user");
const { Genre } = require("../../modules/genre");
const request = require("supertest");
const { default: expectCt } = require("helmet/dist/middlewares/expect-ct");
describe("auth middelware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });
  let token;
  const exec = () => {
    return request(server).post("/api/genres").set("x-auth-token", token).send({ name: "genre" });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expectCt(res.status).toBe(401);
  });
  it("should return 400 if no token is provided", async () => {
    token = "a";
    const res = await exec();
    expectCt(res.status).toBe(400);
  });
  it("should return 200 if no token is valid", async () => {
    const res = await exec();
    expectCt(res.status).toBe(200);
  });
});
