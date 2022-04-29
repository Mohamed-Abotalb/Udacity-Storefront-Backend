import { UserModel } from "../../models/users.model";
import { User } from "../../types/user.type";
import client from "../../database";

const store = new UserModel();

export const beforeAndAfter = async (user : User) => {
  beforeAll(async () => {
    const createdUser : User | null = await store.createUser(user);
    user.id = createdUser.id;
  });

  afterAll(async () => {
    const connection = await client.connect();
    const sql : string = 'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await connection.query(sql);
    connection.release();
  });
}

describe("Users Model", () => {
  describe("User Model CRUD Methods Existing", () => {
    it('should have a getUsers method', () => {
        expect(store.getUsers).toBeDefined();
    });

    it('should have a getUser method', () => {
        expect(store.getUser).toBeDefined();
    });

    it('should have a createUser method', () => {
        expect(store.createUser).toBeDefined();
    });

    it('should have a deleteUser method', () => {
        expect(store.deleteUser).toBeDefined();
    });

    it('should have a updateUser method', () => {
        expect(store.updateUser).toBeDefined();
    });
  })

  describe("Test User Model Functionality", () => {
    const user : User = {
      first_name: 'Mohamed',
      last_name: 'Abotalb',
      password: 'password123456789'
    }

    beforeAndAfter(user);
    
    it('create method should add a user', async () => {
      const result = await store.createUser({
        first_name: "Mahmoud",
        last_name: "Abotalb",
        password: "pass123"
      });
      expect(result.id).toEqual(2);
      expect(result.first_name).toEqual("Mahmoud");
      expect(result.last_name).toEqual("Abotalb");
    });
    
    it('getUsers method should return a list of Users', async () => {
      const result = await store.getUsers();
      expect(result.length).toEqual(2);
    });

    it('getUser method should return the correct user with its id', async () => {
      const result = await store.getUser(user.id as unknown as string);
      expect(result.id).toEqual(user.id);
      expect(result.first_name).toEqual(user.first_name);
      expect(result.last_name).toEqual(user.last_name);
    });

    it('updateUser method should update the user info', async () => {
      const result = await store.updateUser({
        ...user,
        first_name : "Ahmed",
        last_name : "Said"
      });
      expect(result.id).toBe(user.id);
      expect(result.first_name).toBe("Ahmed");
      expect(result.last_name).toBe("Said");
    });

    it('delete method should remove the user', async () => {
      const result = await store.deleteUser(user.id as unknown as string);
      expect(result).toBeUndefined();
    });
  })

  describe("Test Authentication Method", () => {
    const user : User = {
      first_name: 'Mohamed',
      last_name: 'Abotalb',
      password: 'password123456789'
    }

    beforeAndAfter(user);

    it('should have an authenticate method', () => {
      expect(store.authenticate).toBeDefined();
    });

    it("Authenticate method should return authenticated user", async () => {
      const authenticatedUser : User | null = await store.authenticate(user.first_name, user.password);
      expect(authenticatedUser?.id).toBe(user.id);
      expect(authenticatedUser?.first_name).toBe(user.first_name);
      expect(authenticatedUser?.last_name).toEqual(user.last_name);
    });

    it("Authenticate Method should return null for wrong info", async () => {
      const authenticatedUser : User | null = await store.authenticate("Ahmed", "test123");
      expect(authenticatedUser).toBe(null);
    })
  })
});